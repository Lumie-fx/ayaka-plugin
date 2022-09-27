import YAML from 'yaml'
import fs from 'node:fs'
import * as nickNameList from "../../miao-plugin/config/system/character_system.js";

const ayakaConfig = YAML.parse(
  fs.readFileSync(process.cwd()+"/plugins/ayaka-plugin/config/ayaka.set.yaml", "utf8")
)
const role2weaponType = YAML.parse(
  fs.readFileSync(process.cwd()+"/plugins/ayaka-plugin/config/role2weaponType.yaml", "utf8")
)

export default {
  //配置注入
  config: {
    ...ayakaConfig
  },
  set: {
    role2weaponType
  },
  //根据别名获取正式名称
  getRoleNameByNickname(nick){
    const character = nickNameList.characters;
    let name = '';
    for(let key in character){
      if(character[key].indexOf(nick) > -1){
        name = character[key][0];
      }
    }
    return name;
  },
  //根据名字获取角色武器类型 [法器 单手剑 双手剑 枪 弓]
  getWeaponTypeByName(name){
    const role2weaponType = this.set.role2weaponType
    let type = '';
    for(let key in role2weaponType){
      if(role2weaponType[key].indexOf(name) > -1){
        type = key;
      }
    }
    return type;
  },
  //                         1=1s  35day
  async setRedis(key, value, time = 30e6){
    await redis.set(key, JSON.stringify(value), {
      EX: time
    });
    return true;
  },
  async getRedis(key, type = []){
    const value = await redis.get(key);
    let item = null;
    try{
      item = value ? JSON.parse(value) : type;
    }catch (e){
      item = value;
    }
    return item;
  },
  async clearRedis(key){
    await redis.set(key, '');
  },
  type(item){
    return Object.prototype.toString.call(item).slice(8,-1);
  },

  //体力消耗
  async strengthCalculate(user_id, amount = 20){

    const max = this.config.strength.max;
    const recovery = this.config.strength.recovery;

    const strengthKey = `ayaka:${user_id}:strength`;
    let strengthObj = await this.getRedis(strengthKey, {
      lastUpdatedTime: +new Date(),
      strength: max
    });

    const now = + new Date(), strengthTime = 86400000 / recovery; //每点体力恢复时间 86400 * 1000 / 180;

    const recover = parseInt((now - strengthObj.lastUpdatedTime)/strengthTime + ''); //恢复的体力
    if(strengthObj.strength + recover >= max){
      strengthObj.strength = max;
    }else{
      strengthObj.strength = strengthObj.strength + recover;
    }

    let flag = true;

    if(strengthObj.strength < amount){
      flag = false;
    }else{
      strengthObj.strength = strengthObj.strength - amount;//如果是从抽取圣遗物的入口进入
      strengthObj.lastUpdatedTime = now;
      await this.setRedis(strengthKey, strengthObj);
    }

    return {
      flag, //true 成功 false体力不足
      fullStrength: max,
      strength: strengthObj.strength
    };
  },

  //num道具的存取            qq号     物品key   变更数量
  async loadSaveItemByNum(userId, itemName, changeNum){
    let savedItem = await this.getRedis(`ayaka:${userId}:item`, {});
    let itemCalc = (savedItem?.[itemName] || 0) + changeNum;
    if(itemCalc < 0){
      return false;
    }else{
      return await this.setRedis(`ayaka:${userId}:item`, {...savedItem, [itemName]: itemCalc});
    }
  }
}