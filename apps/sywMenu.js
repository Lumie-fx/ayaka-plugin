import { segment } from "oicq";
import lodash from "lodash";
import fs from "fs";
import { render } from "../adapter/render.js";

//创建html文件夹
// if (!fs.existsSync(process.cwd()+`/data/html/genshin/sywMenu/`)) {
//   fs.mkdirSync(process.cwd()+`/data/html/genshin/sywMenu/`);
// }

export class sywMenu extends plugin {
  constructor () {
    super({
      name: '圣遗物菜单',
      dsc: '【查看】查看保存的圣遗物',
      /** https://oicqjs.github.io/oicq/#events */
      event: 'message',
      priority: 100,
      rule: [{
        reg: "^圣遗物菜单$",
        fnc: 'sywMenu',
      }]
    })
  }

//查看
  async  sywMenu(e){
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
      let msgRes = await e.reply(base64);
    }

    return true;
  }
}