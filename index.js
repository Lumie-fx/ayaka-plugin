import lodash from "lodash";
import {syw,sywOne,sywLevelUp,sywSave,sywDeleteAll,sywDeleteOne} from './apps/syw.js'
import {sywList} from './apps/sywList.js'
import {sywMenu} from './apps/sywMenu.js'
import {gachaCover} from './apps/gachaCover.js'
import {characterAyaka, weaponAyaka} from './apps/gachaList.js'
import {helpCover} from './apps/helpCover.js'
import __config from './config.js';

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
  helpCover
};

let rule = {
  syw: {
    reg: "^抽[取]*",
    priority: 100, //优先级，越小优先度越高
    describe: "【抽取】获取随机圣遗物",
  },
  sywOne: {
    reg: "^查看[0-9]+$",
    priority: 101,
    describe: "【查看】查看的某个圣遗物",
  },
  sywLevelUp: {
    reg: "^强化$",
    priority: 101,
    describe: "【强化】圣遗物强化",
  },
  sywSave: {
    reg: "^保存$",
    priority: 101,
    describe: "【保存】保存圣遗物",
  },
  sywDeleteAll: {
    reg: "^删除全部圣遗物$",
    priority: 101,
    describe: "【删除】删除已存的所有圣遗物",
  },
  sywDeleteOne: {
    reg: "^删除[0-9]+$",
    priority: 100,
    describe: "【删除】删除选定序号的圣遗物",
  },
  sywList: {
    reg: "^查看(圣遗物)?$",
    priority: 100,
    describe: "【查看】查看保存的圣遗物",
  },
  sywMenu: {
    reg: "^圣遗物菜单$",
    priority: 100,
    describe: "【查看】查看保存的圣遗物",
  },
  gachaCover: {
    reg: "^#*(10|[武器池]*[十]+|抽|单)[连抽卡奖][123武器池]*$",
    priority: __config.useAyakaGacha ? 10 : 9999,
    describe: "【十连，十连2，十连武器】模拟原神抽卡",
  },
  characterAyaka: {
    reg: "^角色仓库$",
    priority: 100,
    describe: "【查看】查看群内抽卡5x角色列表",
  },
  weaponAyaka: {
    reg: "^武器仓库$",
    priority: 100,
    describe: "【查看】查看群内抽卡5x武器列表",
  },
  helpCover: {
    reg: "^#*(命令|帮助|菜单|help|说明|功能|指令|使用说明)$",
    priority: __config.useAyakaMenu ? 10 : 9999,
    describe: "【#帮助】查看指令说明",
  },
};

lodash.forEach(rule, (r) => {
  r.priority = r.priority || 50;
  r.prehash = true;
  r.hashMark = true;
});

export { rule };

console.log(`ayaka plugin:${__config.ver}初始化~`);

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
