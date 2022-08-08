import lodash from "lodash";
import schedule from "node-schedule";
import {syw,sywOne,sywLevelUp,sywSave,sywDeleteAll,sywDeleteOne} from './syw.js'
import {sywList} from './sywList.js'
import {sywMenu} from './sywMenu.js'
import {gachaCover} from './gachaCover.js'
import {characterAyaka, weaponAyaka} from './gachaList.js'
import {helpCover} from './helpCover.js'
import {tencentAI} from './aiCover.js'
import {ayakaVoice} from './voiceQuery.js'
import {bilibiliLinkTransfer} from './bilibiliLinkTransfer.js'
import {pretendSearch,pretendSet,pretend} from './pretend.js'
import {strengthen} from './weapon.js'
import __config from '../config.js';

import {gachaStatic} from './gachaStatic.js'

if(__config.useAyakaGacha && __config.useAyakaGachaSchedule){
  schedule.scheduleJob('0 0 23 * * *', gachaStatic);
}

export {
  syw,
  sywOne,
  sywLevelUp,
  sywSave,
  sywDeleteAll,
  sywDeleteOne,
  sywList,
  sywMenu,
  gachaCover,
  characterAyaka,
  weaponAyaka,
  helpCover,
  tencentAI,
  ayakaVoice,
  bilibiliLinkTransfer,
  pretendSearch,
  pretendSet,
  pretend,
  strengthen
};

let rule = {
  syw: {
    reg: "^/刷遗物*",
    priority: 1000, //优先级，越小优先度越高
    describe: "【抽取】获取随机圣遗物",
  },
  sywOne: {
    reg: "^/查看[0-9]+$",
    priority: 1000,
    describe: "【查看】查看的某个圣遗物",
  },
  sywLevelUp: {
    reg: "^/强化$",
    priority: 1000,
    describe: "【强化】圣遗物强化",
  },
  sywSave: {
    reg: "^/保存$",
    priority: 1000,
    describe: "【保存】保存圣遗物",
  },
  sywDeleteAll: {
    reg: "^/删除全部圣遗物$",
    priority: 1000,
    describe: "【删除】删除已存的所有圣遗物",
  },
  sywDeleteOne: {
    reg: "^/删除[0-9]+$",
    priority: 1000,
    describe: "【删除】删除选定序号的圣遗物",
  },
  sywList: {
    reg: "^/圣遗物仓库?$",
    priority: 1000,
    describe: "【查看】查看保存的圣遗物",
  },
  sywMenu: {
    reg: "^/圣遗物仓库$",
    priority: 100,
    describe: "【查看】查看保存的圣遗物",
  },
  gachaCover: {
    reg: "^/*(10|[武器池]*[十]+|抽|单)[连抽卡奖][123武器池]*$",
    priority: __config.useAyakaGacha ? 10 : 9999,
    describe: "【十连，十连2，十连武器】模拟原神抽卡",
  },
  characterAyaka: {
    reg: "^/角色仓库$",
    priority: 100,
    describe: "【查看】查看群内抽卡5x角色列表",
  },
  weaponAyaka: {
    reg: "^/武器仓库$",
    priority: 100,
    describe: "【查看】查看群内抽卡5x武器列表",
  },
  helpCover: {
    reg: "^/*(命令|帮助|菜单|help|说明|功能|指令|使用说明)$",
    priority: __config.useAyakaMenu ? 10 : 9999,
    describe: "【#帮助】查看指令说明",
  },
  tencentAI: {
    reg: "noCheck",
    priority: __config.useAyakaAi ? 19990 : 99999,
    describe: "腾讯智障ai",
  },
  ayakaVoice: {
    reg: "^/*(.*)语音$",
    priority: 200,
    describe: "【#帮助】查看指令说明",
  },
  bilibiliLinkTransfer: {
    reg: "^https://www.bilibili.com/video/BV",
    priority: 100,
    describe: "bilibili链接转图片方便查看详情",
  },

  pretendSearch: {
    reg: "^/伪装查看群号$",
    priority: 200,
    describe: "伪装查看群号合集",
  },
  pretendDel: {
    reg: "^/伪装删除$",
    priority: 200,
    describe: "伪装删除群号",
  },
  pretendSet: {
    reg: "^/伪装设置群号[0-9]+$",
    priority: 200,
    describe: "伪装设置群号",
  },
  pretend: {
    reg: ".*",
    priority: 10000,
    describe: "发言",
  },
  strengthen: {
    reg: "^/精炼武器*",
    priority: 1000,
    describe: "【抽取】获取随机圣遗物",
    fnc: strengthen
  }
};

lodash.forEach(rule, (r) => {
  r.priority = r.priority || 50;
  r.prehash = true;
  r.hashMark = true;
});

export { rule };



// setTimeout(async function () {
//   let msgStr = await redis.get("miao:restart-msg");
//   if (msgStr) {
//     let msg = JSON.parse(msgStr);
//     await common.relpyPrivate(msg.qq, msg.msg);
//     await redis.del("miao:restart-msg");
//     let msgs = [`当前喵喵版本: ${currentVersion}`, `您可使用 #喵喵版本 命令查看更新信息`];
//     await common.relpyPrivate(msg.qq, msgs.join("\n"));
//   }
// }, 1000);
