import { segment } from "oicq";
import lodash from "lodash";
import fs from "fs";
import fetch from 'node-fetch'
import { render } from "../adapter/render.js";
import utils from '../utils/utils.js'

// if (!fs.existsSync(process.cwd()+`/data/html/ayaka-plugin/storage/`)) {
//   fs.mkdirSync(process.cwd()+`/data/html/ayaka-plugin/storage/`);
// }

export class storage extends plugin {
  constructor () {
    super({
      name: '仓储',
      dsc: '用户仓储资源展示',
      /** https://oicqjs.github.io/oicq/#events */
      event: 'message',
      priority: 5000,
      rule: [{
        reg: "^-角色$",
        fnc: 'ayakaRole',
      },{
        reg: "^-武器$",
        fnc: 'ayakaWeapon',
      },{
        reg: "^-.*装备[0-9]*$",
        fnc: 'ayakaEquip',
      },{
        reg: "^-精炼[0-9]*$",
        fnc: 'ayakaWeaponUp',
      },{
        reg: "^-删除无用武器$", /*删除4星及以下[未升级&&未精炼]武器*/
        fnc: 'ayakaWeaponDelete',
      },{
        reg: "^-材料$",
        fnc: 'ayakaMaterial',
      },{
        reg: "^-挖矿$",
        fnc: 'ayakaMining',
      }]
    })
  }

//查看
  async ayakaRole(e){
    if (e.img || e.hasReply) {
      return;
    }

    logger.mark('===ayaka storage role===')

    const user_id = e.user_id; //qq
    const name = e.sender.card; //qq昵称

    let role = await utils.getRedis(`ayaka:${user_id}:role`);
    let weapon = await utils.getRedis(`ayaka:${user_id}:weapon`);
    role.sort((a, b) => b.star - a.star);
    role.map(res => {
      const thisWeapon = lodash.find(weapon, {id: res?.equip?.weaponId});
      if(res?.equip?.weaponId > -1 && thisWeapon){
        res.withWeapon = true;
        res.equip.weapon = {
          ...thisWeapon
        };
      }
    });

    // console.log(role)

    let base64 = await render("pages", "storageRole", {
      name: name,
      user_id: user_id,
      list: role, //{name, star, element, num, level}
      type: 'character'
    });

    if (base64) {
      await e.reply(base64);
    }
    return true;
  }

  async ayakaWeapon(e){
    if (e.img || e.hasReply) {
      return;
    }

    logger.mark('===ayaka storage weapon===')

    const user_id = e.user_id; //qq
    const name = e.sender.card; //qq昵称

    let weapon = await utils.getRedis(`ayaka:${user_id}:weapon`);

    let base64 = await render("pages", "storageWeapon", {
      name: name,
      user_id: user_id,
      list: weapon.sort((a, b) => b.star - a.star), //{name, star, element, num, level}
      type: 'weapon'
    });

    if (base64) {
      await e.reply(base64);
    }
    return true;
  }

  async ayakaWeaponUp(e){
    if (e.img || e.hasReply) {
      return;
    }

    logger.mark('===ayaka storage weapon up===')

    let idx = + e.msg.replace('-精炼', '') - 1;

    const user_id = e.user_id; //qq
    const name = e.sender.card; //qq昵称

    let weapon = await utils.getRedis(`ayaka:${user_id}:weapon`);
    weapon.sort((a, b) => b.star - a.star);

    const one = weapon?.[idx];
    if(!one) return;

    if(one.num >= 5){
      return await e.reply([segment.at(e.user_id, name), ` [${one.name}]已精炼至满级。`]);
    }

    let otherIdxList = [];
    const select = weapon.filter((res, i)=>{
      if(res.name === one.name && i !== idx && res.num === 1){
        otherIdxList.push(i);
        return res;
      }
    })
    if(select.length === 0){
      return await e.reply([segment.at(e.user_id, name), ` 当前没有[${one.name}]可供精炼。`]);
    }

    one.num += 1;
    weapon.splice(otherIdxList[0], 1);

    await utils.setRedis(`ayaka:${user_id}:weapon`, weapon);
    return await e.reply([segment.at(e.user_id, name), ` [${one.name}]物精炼${one.num}成功~`]);
  }

  //ayakaWeaponDelete
  async ayakaWeaponDelete(e){
    if (e.img || e.hasReply) {
      return;
    }

    logger.mark('===ayaka storage weapon delete===')

    const user_id = e.user_id; //qq
    const name = e.sender.card; //qq昵称

    let weapon = await utils.getRedis(`ayaka:${user_id}:weapon`);

    await utils.setRedis(`ayaka:${user_id}:weapon`, weapon.filter(res=>res.star > 4 || res.num > 1 || res.level > 1));
    return await e.reply([segment.at(e.user_id, name), ` 无用武器删除成功~`]);
  }

  //查看item材料
  async ayakaMaterial(e){
    if (e.img || e.hasReply) {
      return;
    }

    logger.mark('===ayaka storage material===')

    const user_id = e.user_id; //qq
    const name = e.sender.card; //qq昵称

    let item = await utils.getRedis(`ayaka:${user_id}:item`, {});

    // let base64 = await render("pages", "storageWeapon", {
    //   name: name,
    //   user_id: user_id,
    //   list: weapon.sort((a, b) => b.star - a.star), //{name, star, element, num, level}
    //   type: 'weapon'
    // });
    //
    // if (base64) {
    //   await e.reply(base64);
    // }
    return true;
  }

  //挖矿
  async ayakaMining(e){
    if (e.img || e.hasReply) {
      return;
    }

    logger.mark('===ayaka storage mining===')

    const user_id = e.user_id; //qq
    const name = e.sender.card; //qq昵称

    let item = await utils.getRedis(`ayaka:${user_id}:item`, {});

    // let base64 = await render("pages", "storageWeapon", {
    //   name: name,
    //   user_id: user_id,
    //   list: weapon.sort((a, b) => b.star - a.star), //{name, star, element, num, level}
    //   type: 'weapon'
    // });
    //
    // if (base64) {
    //   await e.reply(base64);
    // }
    return true;
  }

  //装备
  async ayakaEquip(e){
    if (e.img || e.hasReply) {
      return;
    }

    logger.mark('===ayaka storage equip===')

    const user_id = e.user_id; //qq
    const name = e.sender.card; //qq昵称

    const keyArr = e.msg.replace('-', '').split('装备');
    const roleName = utils.getRoleNameByNickname(keyArr[0]);
    const weaponId = keyArr[1];

    const savedRole = await utils.getRedis(`ayaka:${user_id}:role`, []);
    let savedWeapon = await utils.getRedis(`ayaka:${user_id}:weapon`, []);
    savedWeapon.sort((a, b) => b.star - a.star);

    const role = lodash.find(savedRole, {name: roleName});
    const weapon = savedWeapon?.[+weaponId-1];
    if(!role){
      return await e.reply([segment.at(e.user_id, name), ` 暂未获取角色:${roleName}`]);
    }
    if(!weapon){
      return await e.reply([segment.at(e.user_id, name), ` 序号为${weaponId}的武器不存在`]);
    }

    const selectedRoleType = utils.getWeaponTypeByName(roleName);
    if(selectedRoleType !== weapon.element){
      return await e.reply([segment.at(e.user_id, name), ` ${roleName}无法装备类型为${weapon.element}的武器`]);
    }

    const weapon_id = weapon.id;
    const anotherIsEquipArr = savedRole.filter(res => res?.equip?.weaponId === weapon_id && roleName !== res.name);
    let outer_msg = '';

    if(anotherIsEquipArr.length !== 0){
      anotherIsEquipArr[0].equip.weaponId = -1;
      outer_msg = ` ${anotherIsEquipArr[0].name}已卸下${weapon.name}(Lv:${weapon.level})，${role.name}已装备。`
    }else{
      outer_msg = ` ${role.name}已装备${weapon.name}(Lv:${weapon.level})。`
    }
    if(!role.equip){
      role.equip = {};
    }
    role.equip.weaponId = weapon_id;

    await utils.setRedis(`ayaka:${user_id}:role`, savedRole);

    return await e.reply([segment.at(e.user_id, name), outer_msg]);

  }

}
