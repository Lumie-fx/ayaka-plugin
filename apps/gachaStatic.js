import { segment } from "oicq";
import lodash from "lodash";
import fs from "fs";
import { getPluginRender, render } from "../../../lib/render.js";

export const rule = {
  gachaStatic: {
    reg: "^今日抽卡统计$",
    priority: 100,
    describe: "【查看】查看群内今日抽卡5x角色列表",
  }
};

//创建html文件夹
if (!fs.existsSync(`./data/html/genshin/gachaStatic/`)) {
  fs.mkdirSync(`./data/html/genshin/gachaStatic/`);
}

export async function gachaStatic(){
  // if (e.img || e.hasReply) {
  //   return;
  // }
  // const user_id = e.user_id; //qq
  // const name = e.sender.card; //qq昵称
  // const group = e.group_id;

  let gachaKey = `genshin:gacha:key`;
  let gachaValue = `genshin:gacha:value:`;


  let _key = await global.redis.get(gachaKey);
  _key = JSON.parse(_key || '[]')

  if(_key.length > 0){
    for(let group_id of _key){
      let _value = await global.redis.get(gachaValue+group_id);
      if(!_value) return;
      _value = JSON.parse(_value || '[]');

      const one = lodash.find(_value, {groupId: group_id});
      if(!one?.data) return;

      const date = new Date();
      const today = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
      const todayStamp = +new Date(today);

      const _data = one.data;

      let flag = false;
      for(let _key in _data){
        const gachaInfo = _data[_key]; //{琴: {element: "风", timestamp: Array(1)}, ...}
        for(let _role in gachaInfo){
          const timeArr = gachaInfo[_role].timestamp;
          const todayTimeArr = timeArr.filter(res=>{   //[...]
            return (res>=todayStamp-60*60*1000) && (res<todayStamp+60*60*1000*23)
          })
          if(todayTimeArr.length > 0) flag = true;
        }
      }

      if(!flag) return;

      try{
        let base64 = await getPluginRender("ayaka-plugin")("pages", "gachaStatic", {
          save_id: group_id,
          name: group_id,
          _value: one
        });

        if (base64) {
          let msg = segment.image(`base64://${base64}`);
          // let msgRes = await e.reply(msg);
          Bot.pickGroup(group_id).sendMsg(msg).catch((err) => {
            Bot.logger.mark(err);
          });
        }
      }catch (e){
        Bot.logger.mark('群号:'+group_id+'抽卡统计推送异常')
      }
    }
  }

  return true;
}

export async function weaponAyaka(e, {render}){
  if (e.img || e.hasReply) {
    return;
  }
  const user_id = e.user_id; //qq
  const name = e.sender.card; //qq昵称

  return await e.reply([segment.at(e.user_id, name), ` 功能尚未开启`]);

  let keyaka = `genshin:gachayaka:${user_id}`;
  let gachayaka = await global.redis.get(keyaka);
  gachayaka = JSON.parse(gachayaka || '{"character":[],"weapon":[]}');

  let base64 = await render("pages", "gachaList", {
    save_id: user_id,
    name: name,
    gachayaka: gachayaka.weapon,
    type: 'weapon'
  });

  if (base64) {
    let msg = segment.image(`base64://${base64}`);
    let msgRes = await e.reply(msg);
  }

  return true;
}

