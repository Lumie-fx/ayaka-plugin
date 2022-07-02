import { segment } from "oicq";
import lodash from "lodash";
import fs from "fs";
import fetch from 'node-fetch'


export const rule = {
  bilibiliLinkTransfer: {
    reg: "^https://www.bilibili.com/video/BV",
    priority: 100,
    describe: "bilibili链接转图片方便查看详情",
  }
};

//创建html文件夹
if (!fs.existsSync(`./data/html/genshin/sywMenu/`)) {
  fs.mkdirSync(`./data/html/genshin/sywMenu/`);
}

//查看
export async function bilibiliLinkTransfer(e, {render}){
  if (e.img || e.hasReply) {
    return;
  }

  const msg = e.msg.replace('https://www.bilibili.com/video/BV', '');
  const bv = msg.split('?')[0].replace(/[^a-zA-Z0-9]/g,'');
  const url = `https://api.magecorn.com/bilicover/get-cover.php?type=bv&id=${bv}&client=2.5.1`;

  const req = await fetch(url);
  const json = await req.json();

  if(json?.code !==0) return;

  const reqImg = await fetch(json.url);
  const img = await reqImg.buffer();

  if(!img) return;

  const user_id = e.user_id; //qq
  const name = e.sender.card; //qq昵称

  let base64 = await render("pages", "bilibiliLinkTransfer", {
    save_id: user_id,
    name: name,
    up: json.up,
    title: json.title,
    base64: 'data:image/jpeg;base64,'+img.toString('base64')
  });

  if (base64) {
    let msgRes = await e.reply(segment.image(`base64://${base64}`));
  }

  return true;
}
