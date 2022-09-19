import { segment } from "oicq";
import lodash from "lodash";
import fs from "fs";
import fetch from 'node-fetch'
import { render } from "../adapter/render.js";
import utils from '../utils/utils.js'

if (!fs.existsSync(process.cwd()+`/data/html/ayaka-plugin/storage/`)) {
  fs.mkdirSync(process.cwd()+`/data/html/ayaka-plugin/storage/`);
}

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

    let base64 = await render("pages", "storage", {
      name: name,
      user_id: user_id,
      list: role.sort((a, b) => b.star - a.star), //{name, star, element, num, level}
      type: 'character'
    });

    if (base64) {
      await e.reply(base64);
    }

    return true;
  }
}
