import YAML from 'yaml'
import fs from 'node:fs'

const ayakaConfig = YAML.parse(
  fs.readFileSync(process.cwd()+"/plugins/ayaka-plugin/config/ayaka.set.yaml", "utf8")
)

export default {
  //配置注入
  config: {
    ...ayakaConfig
  },
  //                         1=1s  35day
  async setRedis(key, value, time = 30e6){
    await redis.set(key, JSON.stringify(value), {
      EX: time
    })
  },
  async getRedis(key, type = []){
    const value = await redis.get(key)
    let item = null;
    try{
      item = value ? JSON.parse(value) : type
    }catch (e){
      item = value
    }
    return item
  },
  async clearRedis(key){
    await redis.set(key, '')
  },
  type(item){
    return Object.prototype.toString.call(item).slice(8,-1)
  },

  //体力消耗
  async strengthCalculate(user_id, amount = 20){
    const strengthKey = `ayaka:${user_id}:strength`;
    let strengthObj = await this.getRedis(strengthKey, {
      lastUpdatedTime: +new Date(),
      strength: 160
    });

    const now = + new Date(), strengthTime = 480000; //每点体力恢复时间 86400 * 1000 / 180;

    const recover = parseInt((now - strengthObj.lastUpdatedTime)/strengthTime + ''); //恢复的体力
    if(strengthObj.strength + recover >= 160){
      strengthObj.strength = 160;
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
      fullStrength: 160,
      strength: strengthObj.strength
    };
  }
}