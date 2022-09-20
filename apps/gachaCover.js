/** 导入plugin */
import plugin from '../../../lib/plugins/plugin.js'
import GachaData from '../../genshin/model/gachaData.js'
import fs from 'node:fs'
import lodash from 'lodash'
import puppeteer from '../../../lib/puppeteer/puppeteer.js'
import utils from '../utils/utils.js'

export class gacha extends plugin {
  constructor () {
    super({
      name: '十连',
      dsc: '模拟抽卡，每天十连一次，四点更新',
      event: 'message',
      priority: 10,
      rule: [
        {
          reg: '^#*(10|[武器池常驻]*[十]+|抽|单)[连抽卡奖][123武器池常驻]*$',
          fnc: 'gacha'
        },
        {
          reg: '(^#*定轨|^#定轨(.*))$',
          fnc: 'weaponBing'
        }
      ]
    })
  }

  /** #十连 */
  async gacha () {

    logger.mark('===ayaka gacha cover===')

    this.GachaData = await GachaData.init(this.e)

    if (this.checkLimit()) return

    let data = await this.GachaData.run()

    /** ayaka gacha cover start*/

    //#001 logger.mark(data)

    let savedRole = await utils.getRedis(`ayaka:${data.saveId}:role`);
    let savedWeapon = await utils.getRedis(`ayaka:${data.saveId}:weapon`);
    let savedItem = await utils.getRedis(`ayaka:${data.saveId}:item`, {});
    //星辉
    let starlight = savedItem?.starlight || 0;
    //
    //utils.type(data.saveId), utils.type(savedRole), savedWeapon)
    const groupData = lodash.groupBy(data.list, 'type');
    if(groupData?.role){
      groupData.role.map(res => {
        if(res.star > 3){
          const here = lodash.find(savedRole, {name: res.name});
          if(here){
            here.num += 1;
            if(res.star === 4){
              if(here.num < 8) starlight += 2;
              else starlight += 5;
            }
            if(res.star === 5){
              if(here.num < 8) starlight += 10;
              else starlight += 25;
            }
          }
          else savedRole.push({
            name: res.name,
            star: res.star,
            element: res.element,
            num: 1,
            level: 1,
          });
        }
      });
      await utils.setRedis(`ayaka:${data.saveId}:role`, savedRole);
    }
    if(groupData?.weapon){

      let weaponId = await utils.getRedis(`ayaka:${data.saveId}:weaponId`, 0);

      groupData.weapon.map(res => {
        if(res.star > 3){
          savedWeapon.push({
            name: res.name,
            star: res.star,
            element: res.element,
            num: 1,
            level: 1,
            id: weaponId++,
          });
          if(res.star === 4){
            starlight += 2;
          }
          if(res.star === 5){
            starlight += 10;
          }
        }
      });
      await utils.setRedis(`ayaka:${data.saveId}:weapon`, savedWeapon);
      await utils.setRedis(`ayaka:${data.saveId}:weaponId`, weaponId);
    }

    await utils.setRedis(`ayaka:${data.saveId}:item`, {...savedItem, starlight});

    // const newR = await utils.getRedis(`ayaka:${data.saveId}:role`);
    const newW = await utils.getRedis(`ayaka:${data.saveId}:weapon`);
    // const newI = await utils.getRedis(`ayaka:${data.saveId}:item`);
    // console.log(newR)
    console.log(newW)
    // console.log(newI)

    /** ayaka gacha cover end*/

    /** 生成图片 */
    let img = await puppeteer.screenshot('gacha', data)
    if (!img) return

    /** 撤回消息 */
    let recallMsg = this.GachaData.set.delMsg

    /** 出货了不撤回 */
    if (data.nowFive >= 1 || data.nowFour >= 4) {
      recallMsg = 0
    }

    await this.reply(img, false, { recallMsg })
  }

  /** 检查限制 */
  checkLimit () {
    /** 主人不限制 */
    if (this.e.isMaddster) return false

    let { user } = this.GachaData
    let { num, weaponNum } = user.today

    let nowCount = num
    if (this.GachaData.type == 'weapon') nowCount = weaponNum

    if (this.GachaData.set.LimitSeparate == 1) {
      if (nowCount < this.GachaData.set.count * 10) return false
    } else {
      if (num + weaponNum < this.GachaData.set.count * 10) return false
    }

    let msg = lodash.truncate(this.e.sender.card, { length: 8 }) + '\n'

    if (user.today.star.length > 0) {
      msg += '今日五星：'
      if (user.today.star.length >= 4) {
        msg += `${user.today.star.length}个`
      } else {
        user.today.star.forEach(v => {
          msg += `${v.name}(${v.num})\n`
        })
        msg = lodash.trim(msg, '\n')
      }
      if (user.week.num >= 2) {
        msg += `\n本周：${user.week.num}个五星`
      }
    } else {
      msg += `今日已抽，累计${nowCount}抽无五星`
    }
    this.reply(msg, false, { recallMsg: this.GachaData.set.delMsg })
    return true
  }

  /** #定轨 */
  async weaponBing () {
    let Gacha = await GachaData.init(this.e)

    let { NowPool, user, msg = '' } = Gacha

    if (user.weapon.type >= 2) {
      user.weapon.type = 0
      user.weapon.bingWeapon = ''
      msg = '\n定轨已取消'
    } else {
      user.weapon.type++
      user.weapon.bingWeapon = NowPool.weapon5[user.weapon.type - 1]
      msg = []
      NowPool.weapon5.forEach((v, i) => {
        if (user.weapon.type - 1 == i) {
          msg.push(`[√] ${NowPool.weapon5[i]}`)
        } else {
          msg.push(`[  ] ${NowPool.weapon5[i]}`)
        }
      })
      msg = '定轨成功\n' + msg.join('\n')
    }
    /** 命定值清零 */
    user.weapon.lifeNum = 0
    Gacha.user = user
    Gacha.saveUser()

    this.reply(msg, false, { at: this.e.user_id })
  }

  /** 初始化创建配置文件 */
  async init () {
    GachaData.getStr()

    let file = './plugins/genshin/config/gacha.set.yaml'

    if (fs.existsSync(file)) return

    fs.copyFileSync('./plugins/genshin/defSet/gacha/set.yaml', file)
  }
}
