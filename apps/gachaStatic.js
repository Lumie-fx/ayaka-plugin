import { segment } from "oicq";
import lodash from "lodash";
import fs from "fs";

export const rule = {
  gachaStatic: {
    reg: "^测试今日抽卡统计$",
    priority: 100,
    describe: "【查看】查看群内今日抽卡5x角色列表",
  }
};

//创建html文件夹
if (!fs.existsSync(`./data/html/genshin/gachaStatic/`)) {
  fs.mkdirSync(`./data/html/genshin/gachaStatic/`);
}

export async function gachaStatic(e, {render}){
  if (e.img || e.hasReply) {
    return;
  }
  const user_id = e.user_id; //qq
  const name = e.sender.card; //qq昵称
  const group = e.group_id;

  let gachaKey = `genshin:gacha:key`;
  let gachaValue = `genshin:gacha:value:`;


  let _key = await global.redis.get(gachaKey);
  _key = JSON.parse(_key || '[]')

  if(_key.length > 0){
    for(let group_id of _key){
      let _value = await global.redis.get(gachaValue+group_id);
      _value = JSON.parse(_value || '[]')

      let base64 = await render("pages", "gachaStatic", {
        save_id: user_id,
        name: name,
        _value: lodash.find(_value, {groupId: group_id})
      });

      if (base64) {
        let msg = segment.image(`base64://${base64}`);
        //todo reply 各个群
        let msgRes = await e.reply(msg);
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

