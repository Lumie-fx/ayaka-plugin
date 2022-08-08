import { segment } from "oicq";
import lodash from "lodash";
import fs from "fs";
import __config from '../config.js';
import gsCfg from '../../genshin/model/gsCfg.js'
import GachaData from '../../genshin/model/gachaData.js'

//五星基础概率(0-10000)
const chance5 = 60;
//四星基础概率
const chance4 = 510;
//角色不歪的概率（0-100）
const wai = 45;

//五星武器基础概率
const chanceW5 = 70;
//四星武器基础概率
const chanceW4 = 600;

const _pth = process.cwd().replace(/\\/g,'/');

export const rule = {
  gachaCover: {
    reg: "^/*(10|[武器池]*[十]+|抽|单)[连抽卡奖][123武器池]*$",
    priority: __config.useAyakaGacha ? 10 : 9999,
    describe: "【十连，十连2，十连武器】模拟原神抽卡",
  },
};

//创建html文件夹
// if (!fs.existsSync(`./data/html/genshin/gachaCover/`)) {
//   fs.mkdirSync(`./data/html/genshin/gachaCover/`);
// }

//五星角色
let role5 = ["刻晴", "莫娜", "七七", "迪卢克", "琴"];
//五星武器
let weapon5 = ["阿莫斯之弓", "天空之翼", "天空之卷", "天空之脊", "天空之傲", "天空之刃", "四风原典", "和璞鸢", "狼的末路", "风鹰剑"];

//四星角色
let role4 = [
  "香菱",
  "辛焱",
  "迪奥娜",
  "班尼特",
  "凝光",
  "北斗",
  "行秋",
  "重云",
  "雷泽",
  "诺艾尔",
  "砂糖",
  "菲谢尔",
  "芭芭拉",
  "罗莎莉亚",
  "烟绯",
  "早柚",
  "托马",
  "九条裟罗",
  "五郎",
  "云堇",
];
//四星武器
let weapon4 = [
  "弓藏",
  "祭礼弓",
  "绝弦",
  "西风猎弓",
  "昭心",
  "祭礼残章",
  "流浪乐章",
  "西风秘典",
  "西风长枪",
  "匣里灭辰",
  "雨裁",
  "祭礼大剑",
  "钟剑",
  "西风大剑",
  "匣里龙吟",
  "祭礼剑",
  "笛剑",
  "西风剑",
];
//三星武器
let weapon3 = [
  "弹弓",
  "神射手之誓",
  "鸦羽弓",
  "翡玉法球",
  "讨龙英杰谭",
  "魔导绪论",
  "黑缨枪",
  "以理服人",
  "沐浴龙血的剑",
  "铁影阔剑",
  "飞天御剑",
  "黎明神剑",
  "冷刃",
];


//回复统计
let count = {};
let gachaConfig = {};
let element = {};
let genshin = {};

await init();

export async function init(isUpdate) {
  gachaConfig = JSON.parse(fs.readFileSync(`${_pth}/plugins/ayaka-plugin/data/gacha.json`, "utf8"));
  element = JSON.parse(fs.readFileSync(`${_pth}/plugins/ayaka-plugin/data/element.json`, "utf8"));
  let version = isUpdate ? new Date().getTime() : 0;
  genshin = await import(`../data/roleId.js?version=${version}`);
  count = {};
}

// 抽中五星
async function getStar5(gachaData, isBigUP, up5, res5, user_id, e, name) {
  //当前抽卡数
  let nowCardNum = gachaData.num5 + 1;

  //五星抽卡数清零
  gachaData.num5 = 0;
  //没有四星，四星保底数+1
  gachaData.num4++;

  let tmpUp = wai;

  if (gachaData.isUp5 == 1) {
    tmpUp = 101;
  }

  let tmp_name = "";
  //当祈愿获取到5星角色时，有50%的概率为本期UP角色
  if (getRandomInt(100) <= tmpUp) {
    if (gachaData.isUp5 == 1) {
      isBigUP = true;
    }
    //大保底清零
    gachaData.isUp5 = 0;
    //up 5星
    tmp_name = up5[getRandomInt(up5.length)];
  } else {
    //大保底
    gachaData.isUp5 = 1;
    tmp_name = role5[getRandomInt(role5.length)];
  }

  gachaData.today.role.push({name: tmp_name, num: nowCardNum});
  gachaData.week.num++;

  res5.push({
    name: tmp_name,
    star: 5,
    type: "character",
    num: nowCardNum,
    element: element[tmp_name],
  });

  let keyaka = `genshin:gachaList:${user_id}`;
  let gachayaka = await global.redis.get(keyaka);
  gachayaka = JSON.parse(gachayaka || '{"character":[],"weapon":[]}');

  gachayaka.character.push({
    name: tmp_name,
    element: element[tmp_name],
    star: 5,
    level: 1
  })

  await global.redis.set(keyaka, JSON.stringify(gachayaka), {
    EX: 30e6,
  });

  if (e.group_id) {
    // user_id = '1387771'
    // name = '测试'
    let gachaKey = `genshin:gacha:key`;
    let gachaValue = `genshin:gacha:value:${e.group_id}`;


    let gachaKeyArr = await global.redis.get(gachaKey);
    gachaKeyArr = JSON.parse(gachaKeyArr || '[]');

    //群列表增加
    if (!gachaKeyArr.includes(e.group_id)) {
      gachaKeyArr.push(e.group_id);
      await global.redis.set(gachaKey, JSON.stringify(gachaKeyArr), {
        EX: 30e6,
      });
    }

    //群值不存在初始化
    let gachaValueArr = await global.redis.get(gachaValue);

    gachaValueArr = JSON.parse(gachaValueArr || '[]');
    if (gachaValueArr.length === 0 || gachaValueArr.map(res => res.groupId).indexOf(e.group_id) === -1) {
      gachaValueArr.push({
        groupId: e.group_id,
        data: {},
        id2Name: {}
      });
    }

    //选中当前群
    const thisGroup = gachaValueArr.filter(res => res.groupId === e.group_id)[0];
    if (thisGroup.data.length === 0 || !thisGroup.data[user_id + '']) {
      thisGroup.data[user_id + ''] = {};
    }

    const thisUser = thisGroup.data[user_id + ''];
    if (!thisUser[tmp_name]) {
      thisUser[tmp_name] = {
        element: element[tmp_name],
        timestamp: [+new Date] //同时指代抽到时间和数量
      };
    } else {
      thisUser[tmp_name] = {
        element: element[tmp_name],
        timestamp: [...thisUser[tmp_name].timestamp, +new Date]
      };
    }

    if (!thisGroup.id2Name) thisGroup.id2Name = {};
    thisGroup.id2Name[user_id] = name;

    await global.redis.set(gachaValue, JSON.stringify(gachaValueArr), {
      EX: 30e6,
    });
  }
  return isBigUP;
}

// 抽中四星
async function getStar4(gachaData, up4, resC4, resW4,user_id) {
  //保底四星数清零
  gachaData.num4 = 0;

  if (gachaData.isUp4 == 1) {
    //是否必出四星清零
    gachaData.isUp4 = 0;
    var tmpUp = 100;
  } else {
    var tmpUp = 50;
  }

  let keyaka = `genshin:gachaList:${user_id}`;
  let gachayaka = await global.redis.get(keyaka);
  gachayaka = JSON.parse(gachayaka || '{"character":[],"weapon":[]}');

  //当祈愿获取到4星物品时，有50%的概率为本期UP角色
  if (Math.ceil(Math.random() * 100) <= tmpUp) {
    //up 4星
    let tmp_name = up4[getRandomInt(up4.length)];
    resC4.push({
      name: tmp_name,
      star: 4,
      type: "character",
      element: element[tmp_name],
    });
    gachayaka.character.push({
      name: tmp_name,
      element: element[tmp_name],
      star: 4,
      level: 1
    })
  } else {
    gachaData.isUp4 = 1;
    //一半概率武器 一半4星
    if (getRandomInt(100) <= 50) {
      let tmp_name = role4[getRandomInt(role4.length)];
      resC4.push({
        name: tmp_name,
        star: 4,
        type: "character",
        element: element[tmp_name],
      });
      gachayaka.character.push({
        name: tmp_name,
        element: element[tmp_name],
        star: 4,
        level: 1
      })

    } else {
      let tmp_name = weapon4[getRandomInt(weapon4.length)];
      resW4.push({
        name: tmp_name,
        star: 4,
        type: "weapon",
        element: element[tmp_name],
      });
      gachayaka.weapon.push({
        id: randomID(),
        name: tmp_name,
        element: element[tmp_name],
        star: 4,
        level: 1
      })
    }
  }
  await global.redis.set(keyaka, JSON.stringify(gachayaka), {
    EX: 30e6,
  });
  return ;
}

// 检查是否抽卡限制
function checkGachaLimit(todayNum, dayNum, e, name, gachaData) {
  let check = false;
  if (todayNum >= dayNum && !e.isMaster) {
    let msg = lodash.truncate(name, {length: 8});

    if (gachaData.today.role.length > 0) {
      msg += "\n今日五星：";
      if (gachaData.today.role.length >= 4) {
        msg += `${gachaData.today.role.length}个\n`
      } else {
        for (let val of gachaData.today.role) {
          msg += `${val.name}(${val.num})\n`;
        }
      }
      msg = msg.trim("\n");

      if (gachaData.week.num - gachaData.today.role.length >= 1) {
        msg += `\n本周：${gachaData.week.num}个五星`;
      }
    } else {
      if (gachaData.weapon && e.msg.includes("武器")) {
        msg += `今日武器已抽\n累计${gachaData.weapon.num5}抽无五星`;
      } else {
        msg += `今日角色已抽\n累计${gachaData.num5}抽无五星`;
      }

      if (gachaData.week.num >= 2) {
        msg += `\n本周：${gachaData.week.num}个五星`;
      }
      check = true;
    }
  }
  return check;
}

//#十连
export async function gachaCover(e, {render}) {
  if (e.img || e.hasReply) {
    return;
  }

  Bot.logger.mark('=== 抽卡 ayaka cover ===');

  let user_id = e.user_id;
  let name = e.sender.card;
  let group_id = e.group_id;
  let type = e.msg.includes("武器") ? "weapon" : "role";

  let upType = 1;
  if (e.msg.indexOf("2") != -1) {
    upType = 2; //角色up卡池2
  }
  if (e.msg.indexOf("3") != -1) {
    upType = 3;
  }

  //每日抽卡次数
  let gachaDayNum = gsCfg.getGachaSet(e.group_id).count
  let LimitSeparate = gsCfg.getGachaSet(e.group_id).LimitSeparate
  let dayNum = gachaDayNum || 1;
  //角色，武器抽卡限制是否分开

  let key = `genshin:gacha:${user_id}`;
  console.log(key)
  let gachaData = await global.redis.get(key);

  //获取结算时间
  let end = getEnd();

  if (!count[end.dayEnd]) {
    count = {};
    count[end.dayEnd] = {};
  }
  if (count[end.dayEnd][user_id]) {
    count[end.dayEnd][user_id]++;
  } else {
    count[end.dayEnd][user_id] = 1;
  }

  // if(e.isGroup){
  //   e.isMaster = false;
  // }
  if (!e.isMaster && count[end.dayEnd][user_id] && count[end.dayEnd][user_id] > dayNum) {
    if (count[end.dayEnd][user_id] <= Number(dayNum) * (LimitSeparate + 1) + 4) {
      e.reply(`每天只能抽${dayNum}次`);
    }
    return true;
  }

  if (!gachaData) {
    gachaData = {
      num4: 0, //4星保底数
      isUp4: 0, //是否4星大保底
      num5: 0, //5星保底数
      isUp5: 0, //是否5星大保底
      week: { num: 0, expire: end.weekEnd },
      today: { role: [], expire: end.dayEnd, num: 0, weaponNum: 0 },
      weapon: {
        num4: 0, //4星保底数
        isUp4: 0, //是否4星大保底
        num5: 0, //5星保底数
        isUp5: 0, //是否5星大保底
        lifeNum: 0, //命定值
        type: 1, //0-取消 1-武器1 2-武器2
      },
    };
  } else {
    gachaData = JSON.parse(gachaData);

    if (new Date().getTime() >= gachaData.today.expire) {
      gachaData.today = { num: 0, weaponNum: 0, role: [], expire: end.dayEnd };
    }
    if (new Date().getTime() >= gachaData.week.expire) {
      gachaData.week = { num: 0, expire: end.weekEnd };
    }
  }

  let todayNum = gachaData.today.num;
  if (type == "weapon" && LimitSeparate) {
    todayNum = gachaData.today.weaponNum;
  }

  // 检查是否抽卡限制
  if (checkGachaLimit(todayNum, dayNum, e, name, gachaData)) {
    //回复消息
    e.reply(msg);
    //返回true不再向下执行
    return true;
  }

  let { up4, up5, upW4, upW5, poolName } = getNowPool(upType)

  if (e.msg.includes("武器")) {
    return gachaWeapon(e, gachaData, upW4, upW5, render);
  }

  //去除当前up的四星
  role4 = lodash.difference(role4, up4);

  //每日抽卡数+1
  gachaData.today.num++;

  //数据重置
  let res5 = [],
    resC4 = [],
    resW4 = [],
    resW3 = [];

  //是否大保底
  let isBigUP = false;

  //循环十次
  for (let i = 1; i <= 10; i++) {
    let tmpChance5 = chance5;

    //增加双黄概率
    if (gachaData.week.num == 1) {
      tmpChance5 = chance5 * 2;
    }

    //90次都没中五星
    if (gachaData.num5 >= 90) {
      tmpChance5 = 10000;
    }
    //74抽后逐渐增加概率
    else if (gachaData.num5 >= 74) {
      tmpChance5 = 590 + (gachaData.num5 - 74) * 530;
    }
    //60抽后逐渐增加概率
    else if (gachaData.num5 >= 60) {
      tmpChance5 = chance5 + (gachaData.num5 - 50) * 40;
    }

    //抽中五星
    if (getRandomInt(10000) <= tmpChance5) {
      isBigUP = await getStar5(gachaData, isBigUP, up5, res5, user_id, e, name);

      continue;
    }

    //没有五星，保底数+1
    gachaData.num5++;

    let tmpChance4 = chance4;

    //9次都没中四星 概率100%
    if (gachaData.num4 >= 9) {
      tmpChance4 = chance4 + 10000;
    }
    //6次后逐渐增加概率
    else if (gachaData.num4 >= 5) {
      tmpChance4 = tmpChance4 + Math.pow(gachaData.num4 - 4, 2) * 500;
    }

    //抽中四星
    if (getRandomInt(10000) <= tmpChance4) {
      await getStar4(gachaData, up4, resC4, resW4, user_id);
      continue;
    }

    //没有四星，保底数+1
    gachaData.num4++;

    //随机三星武器
    let tmp_name = weapon3[getRandomInt(weapon3.length)];
    resW3.push({
      name: tmp_name,
      star: 3,
      type: "weapon",
      element: element[tmp_name],
    });
  }

  let list = [...res5, ...resC4, ...resW4, ...resW3];

  let info = `累计「${gachaData.num5}抽」`;

  if (res5.length > 0) {
    let role5 = res5[res5.length - 1];
    info = `${role5.name}「${role5.num}抽」`;
  }

  if (isBigUP) {
    info += "大保底";
  }

  if (res5.length >= 4) {
    info = "";
  }

  let base64 = await render("pages", "gachaCover", {
    save_id: user_id,
    name: name,
    info: info,
    list: list,
    poolName: poolName,
    fiveNum:res5.length,
  });

  if (base64) {
    redis.set(key, JSON.stringify(gachaData), {
      EX: end.keyEnd,
    });

    let msg = segment.image(`base64://${base64.file.toString("base64")}`);
    let msgRes = await e.reply(msg);

    if (msgRes && msgRes.message_id && e.isGroup && e.groupConfig.delMsg && res5.length <= 0 && resC4.length <= 2) {
      setTimeout(() => {
        e.group.recallMsg(msgRes.message_id);
      }, e.groupConfig.delMsg);
    }
  }

  return true;
}

function getNowPool(upType) {
  let end, up4, up5, upW4, upW5, poolName, raw_up5;
  for (let val of gachaConfig) {
    if (new Date().getTime() <= new Date(val.endTime).getTime()) {
      end = val;
      break;
    }
  }
  if (!end) {
    end = gachaConfig.pop()
  }

  if(upType == 3 ){
    end = lodash.sample(gachaConfig);
    upType = lodash.random(1, 2);
  }

  up4 = end.up4;
  if (upType == 1) {
    up5 = end.up5;
  } else {
    up5 = end.up5_2;
  }
  upW4 = end.weapon4;
  upW5 = end.weapon5;
  poolName = genshin.abbr[up5[0]] ? genshin.abbr[up5[0]] : up5[0];
  poolName = `角色池:${poolName}`;
  raw_up5 = [...end.up5, ...end.up5_2];
  return { up4, up5, upW4, upW5, poolName, raw_up5 }
}

//返回随机整数
function getRandomInt(max = 10000) {
  return Math.floor(Math.random() * max);
}

function getEnd() {
  let now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth();
  let day = now.getDate();
  let dayEnd = "";
  //每日数据-凌晨4点更新
  if (now.getHours() < 4) {
    dayEnd = new Date(year, month, day, "03", "59", "59").getTime();
  } else {
    dayEnd = new Date(year, month, day, "23", "59", "59").getTime() + 3600 * 4 * 1000;
  }

  //每周结束时间
  let weekEnd = dayEnd + 86400 * (7 - now.getDay()) * 1000;
  //redis过期时间
  let keyEnd = Math.ceil((dayEnd + 86400 * 5 * 1000 - now.getTime()) / 1000);

  return { dayEnd, weekEnd, keyEnd };
}

//#十连武器
async function gachaWeapon(e, gachaData, upW4, upW5, render) {
  let user_id = e.user_id;
  //角色，武器抽卡限制是否分开
  let LimitSeparate = gsCfg.getGachaSet(e.group_id).LimitSeparate || 0;
  let gachatConfig = await GachaData.init(e);
  gachaData.weapon.bingWeapon = gachatConfig.getBingWeapon()

  if (!gachaData.weapon) {
    gachaData.weapon = {
      num4: 0, //4星保底数
      isUp4: 0, //是否4星大保底
      num5: 0, //5星保底数
      isUp5: 0, //是否5星大保底
      lifeNum: 0, //命定值
      type: 1, //0-取消 1-武器1 2-武器2
      bingWeapon: upW5[1],
    };
  } else {
    if (gachaData.weapon.bingWeapon) {
      if (!upW5.includes(gachaData.weapon.bingWeapon)) {
        gachaData.weapon.bingWeapon = upW5[0];
        gachaData.weapon.type = 1;
        gachaData.weapon.lifeNum = 0;
      }
    } else if (gachaData.weapon.type == 1) {
      gachaData.weapon.bingWeapon = upW5[0];
      gachaData.weapon.lifeNum = 0;
    }
  }

  let bingWeapon = gachaData.weapon.bingWeapon ;

  //去除当前up的四星
  weapon4 = lodash.difference(weapon4, upW4);
  weapon5 = lodash.difference(weapon5, upW5);

  //每日抽卡数+1
  if (LimitSeparate) {
    if (!gachaData.today.weaponNum) {
      gachaData.today.weaponNum = 0;
    }
    gachaData.today.weaponNum++;
  } else {
    if (!gachaData.today.Num) {
      gachaData.today.num = 0;
    }
    gachaData.today.num++;
  }

  let res5 = [],
    resC4 = [],
    resW4 = [],
    resW3 = [];

  let isBigUP = false; //是否大保底
  let isBing = false; //是否定轨获取

  //循环十次
  for (let i = 1; i <= 10; i++) {
    let tmpChance5 = chanceW5;

    //增加双黄概率
    if (gachaData.week.num == 1) {
      tmpChance5 = chanceW5 * 3;
    }

    //80次都没中五星
    if (gachaData.weapon.num5 >= 80) {
      tmpChance5 = 10000;
    }
    //62抽后逐渐增加概率
    else if (gachaData.weapon.num5 >= 62) {
      tmpChance5 = chanceW5 + (gachaData.weapon.num5 - 61) * 700;
    }
    //50抽后逐渐增加概率
    else if (gachaData.weapon.num5 >= 45) {
      tmpChance5 = chanceW5 + (gachaData.weapon.num5 - 45) * 60;
    } else if (gachaData.weapon.num5 >= 10 && gachaData.weapon.num5 <= 20) {
      tmpChance5 = chanceW5 + (gachaData.weapon.num5 - 10) * 30;
    }

    let keyaka = `genshin:gachaList:${user_id}`;
    console.log(keyaka)
    let gachayaka = await global.redis.get(keyaka);
    gachayaka = JSON.parse(gachayaka || '{"character":[],"weapon":[]}');

    //抽中五星
    if (getRandomInt(10000) <= tmpChance5) {
      //当前抽卡数
      let nowCardNum = gachaData.weapon.num5 + 1;

      //五星抽卡数清零
      gachaData.weapon.num5 = 0;
      //没有四星，四星保底数+1
      gachaData.weapon.num4++;

      let tmpUp = 60; //下毒

      if (gachaData.weapon.isUp5 == 1) {
        tmpUp = 101;
      }

      let tmp_name = "";
      if (gachaData.weapon.lifeNum >= 2) {
        tmp_name = bingWeapon;
        gachaData.weapon.lifeNum = 0;
        isBing = true;
        isBigUP = false;
      }
      //当祈愿获取到5星武器时，有75%的概率为本期UP武器
      else if (getRandomInt(100) <= tmpUp) {
        if (gachaData.weapon.isUp5 == 1) {
          isBigUP = true;
        } else {
          isBigUP = false;
        }
        //大保底清零
        gachaData.weapon.isUp5 = 0;
        //up 5星
        tmp_name = upW5[getRandomInt(upW5.length)];

        if (tmp_name == bingWeapon) {
          gachaData.weapon.lifeNum = 0;
        }
        isBing = false;
      } else {
        //大保底
        gachaData.weapon.isUp5 = 1;
        tmp_name = weapon5[getRandomInt(weapon5.length)];
        isBigUP = false;
        isBing = false;
      }

      if (gachaData.weapon.type > 0 && tmp_name != bingWeapon) {
        gachaData.weapon.lifeNum++;
      }

      gachaData.today.role.push({ name: tmp_name, num: nowCardNum });
      gachaData.week.num++;

      res5.push({
        name: tmp_name,
        star: 5,
        type: "weapon",
        num: nowCardNum,
        element: element[tmp_name],
      });

      gachayaka.weapon.push({
        id: randomID(),
        name: tmp_name,
        element: element[tmp_name],
        star: 5,
        level: 1
      })


      Bot.logger.mark(gachayaka);


      await global.redis.set(keyaka, JSON.stringify(gachayaka), {
        EX: 30e6,
      });

      continue;
    }

    //没有五星，保底数+1
    gachaData.weapon.num5++;

    let tmpChance4 = chance4;

    //9次都没中四星 概率100%
    if (gachaData.weapon.num4 >= 9) {
      tmpChance4 = chanceW4 + 10000;
    }
    //6次后逐渐增加概率
    else if (gachaData.weapon.num4 >= 5) {
      tmpChance4 = tmpChance4 + Math.pow(gachaData.weapon.num4 - 4, 2) * 500;
    }

    //抽中四星
    if (getRandomInt(10000) <= tmpChance4) {
      //保底四星数清零
      gachaData.weapon.num4 = 0;

      if (gachaData.weapon.isUp4 == 1) {
        //是否必出四星清零
        gachaData.weapon.isUp4 = 0;
        var tmpUp = 100;
      } else {
        var tmpUp = 75;
      }
      let tmp_name
      //当祈愿获取到4星物品时，有75%的概率为本期UP武器
      if (Math.ceil(Math.random() * 100) <= tmpUp) {
        //up 4星
        tmp_name = upW4[getRandomInt(upW4.length)];
        resC4.push({
          name: tmp_name,
          star: 4,
          type: "weapon",
          element: element[tmp_name],
        });
        gachayaka.weapon.push({
          id: randomID(),
          name: tmp_name,
          element: element[tmp_name],
          star: 4,
          level: 1
        })
      } else {
        gachaData.weapon.isUp4 = 1;
        //一半概率武器 一半角色
        if (getRandomInt(100) <= 50) {
          tmp_name = role4[getRandomInt(role4.length)];
          resC4.push({
            name: tmp_name,
            star: 4,
            type: "character",
            element: element[tmp_name],
          });
          gachayaka.character.push({
            id: randomID(),
            name: tmp_name,
            element: element[tmp_name],
            star: 4,
            level: 1
          })
        } else {
          tmp_name = weapon4[getRandomInt(weapon4.length)];
          resW4.push({
            name: tmp_name,
            star: 4,
            type: "weapon",
            element: element[tmp_name],
          });
          gachayaka.weapon.push({
            id: randomID(),
            name: tmp_name,
            element: element[tmp_name],
            star: 4,
            level: 1
          })
        }
      }
      await global.redis.set(keyaka, JSON.stringify(gachayaka), {
        EX: 30e6,
      });
      continue;
    }

    //没有四星，保底数+1
    gachaData.weapon.num4++;

    //随机三星武器
    let tmp_name = weapon3[getRandomInt(weapon3.length)];
    resW3.push({
      name: tmp_name,
      star: 3,
      type: "weapon",
      element: element[tmp_name],
    });
  }

  let key = `genshin:gacha:${user_id}`;
  await global.redis.set(key, JSON.stringify(gachaData), {
    EX: getEnd().keyEnd,
  });

  let list = [...res5, ...resC4, ...resW4, ...resW3];

  let info = `累计「${gachaData.weapon.num5}抽」`;

  if (res5.length > 0) {
    let role5 = res5[res5.length - 1];
    info = `${role5.name}「${role5.num}抽」`;
  }
  if (isBing) {
    info += "定轨";
  }
  if (isBigUP) {
    info += "大保底";
  }

  let base64 = await render("pages", "gachaCover", {
    save_id: user_id,
    name: e.sender.card,
    info: info,
    list: list,
    isWeapon: true,
    bingWeapon: bingWeapon,
    lifeNum: gachaData.weapon.lifeNum,
    fiveNum:res5.length,
  });

  if (base64) {
    let msg = segment.image(`base64://${base64.file.toString("base64")}`);
    let msgRes = await e.reply(msg);

    if (msgRes && msgRes.message_id && e.isGroup && e.groupConfig.delMsg && res5.length <= 0 && resC4.length <= 2) {
      setTimeout(() => {
        e.group.recallMsg(msgRes.message_id);
      }, e.groupConfig.delMsg);
    }
  }

  return true;
}

// 返回随机ID
function randomID() {
  return Number(Math.random().toString().substr(2,0) + Date.now()).toString(36);
}