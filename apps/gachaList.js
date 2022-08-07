import { segment } from "oicq";
import lodash from "lodash";
import fs from "fs";

export const rule = {
  characterAyaka: {
    reg: "^角色仓库$",
    priority: 100,
    describe: "【查看】查看群内抽卡5x角色列表",
  },
  weaponAyaka: {
    reg: "^武器仓库$",
    priority: 100,
    describe: "【查看】查看群内抽卡5x武器列表",
  }
};

// //创建html文件夹
// if (!fs.existsSync(`./data/html/genshin/gachaList/`)) {
//   fs.mkdirSync(`./data/html/genshin/gachaList/`);
// }

export async function characterAyaka(e, {render}){
  if (e.img || e.hasReply) {
    return;
  }
  const user_id = e.user_id; //qq
  const name = e.sender.card; //qq昵称


  let keyaka = `genshin:gachayaka:${user_id}`;
  let gachayaka = await global.redis.get(keyaka);
  gachayaka = JSON.parse(gachayaka || '{"character":[],"weapon":[]}');

  if(gachayaka.character.length === 0){
    return await e.reply([segment.at(e.user_id, name), ` 你得先通过十连/抽卡获取角色哦~`]);
  }

  let data = [];
  gachayaka.character.forEach(res=>{
    console.log(res)
    let flag = false;
    data.forEach(r=>{
      if(r.name === res.name) flag = true;
    })

    if(flag){
      data.map(f=>{
        if(f.name === res.name){
          f.num = f.num + 1;
        }
      });
    }else{
      data.push({
        name: res.name,
        element: res.element,
        num: 0,
        star: 5
      })
    }
  })

  // Bot.logger.mark(data);

  let base64 = await render("pages", "gachaList", {
    save_id: user_id,
    name: name,
    list: data, //{name, element, num}
    type: 'character'
  });

  if (base64) {
    let msg = segment.image(`base64://${base64.file.toString("base64")}`);
    let msgRes = await e.reply(msg);
  }

  return true;
}

export async function weaponAyaka(e, {render}){
  if (e.img || e.hasReply) {
    return;
  }
  const user_id = e.user_id; //qq
  const name = e.sender.card; //qq昵称

 // return await e.reply([segment.at(e.user_id, name), ` 功能尚未开启`]);

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
    let msg = segment.image(`base64://${base64.file.toString("base64")}`);
    let msgRes = await e.reply(msg);
  }

  return true;
}

