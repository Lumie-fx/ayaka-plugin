import { segment } from "oicq";
import lodash from "lodash";
import fs from "fs";
import md5 from "md5";

import __config from '../config.js';
const _path = process.cwd();

export const rule = {
  //帮助说明
  helpCover: {
    reg: "^#*(命令|帮助|菜单|help|说明|功能|指令|使用说明)$",
    priority: __config.useAyakaMenu ? 10 : 9999,
    describe: "【#帮助】查看指令说明",
  },
};

let helpImg, helpMd5;

export async function helpCover(e, {render}) {
  if (e.at && !e.atBot) {
    return;
  }

  Bot.logger.mark('=== 菜单 ayaka cover ===');

  let msg = [];
  let img;
  await getHelp(render);
  if (helpImg) {
    img = `base64://${helpImg}`;
  } else {
    img = `file:///${_path}/resources/help/help.png`;
  }

  msg.unshift(segment.image(img));

  e.reply(msg);
  return true;
}

async function getHelp(render) {
  let path = _path + '/plugins/ayaka-plugin/resources/meta/configs/help.json';
  let helpData = fs.readFileSync(path, "utf8");
  let JsonMd5 = md5(helpData);

  try {
    helpData = JSON.parse(helpData);
  } catch (error) {
    Bot.logger.error(`ayaka-plugin help.json错误`);
    return false;
  }

  if (!helpImg || JsonMd5 != helpMd5) {

    let packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));

    helpMd5 = JsonMd5;
    helpImg = await render("pages", "helpCover", {
      helpData,
      hd_bg: "久岐忍",
      version: packageJson.version,
      bgVer: 'ver4'
    });
  }

  return helpData;
}