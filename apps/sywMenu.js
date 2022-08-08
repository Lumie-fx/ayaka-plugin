import { segment } from "oicq";
import lodash from "lodash";
import fs from "fs";

const _path = process.cwd();

export const rule = {
  sywMenu: {
    reg: "^/圣遗物菜单$",
    priority: 100,
    describe: "【查看】查看保存的圣遗物",
  }
};

//创建html文件夹
// if (!fs.existsSync(`./data/html/genshin/sywMenu/`)) {
//   fs.mkdirSync(`./data/html/genshin/sywMenu/`);
// }

//查看
export async function sywMenu(e, {render}){
  if (e.img || e.hasReply) {
    return;
  }
  const user_id = e.user_id; //qq
  const name = e.sender.card; //qq昵称

  let base64 = await render("pages", "sywMenu", {
    save_id: user_id,
    name: name,
    hd_bg: '夜兰'
  });

  if (base64) {
    let msgRes = await e.reply(segment.image(`base64://${base64}`));
  }

  return true;
}
