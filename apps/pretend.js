import { segment } from "oicq";
import lodash from "lodash";
import fs from "fs";
import __config from '../config.js'

const __path = '/plugins/ayaka-plugin/pretend/'

if (!fs.existsSync(`.${__path}`)) {
  fs.mkdirSync(`.${__path}`);
}

export const rule = {
  //帮助说明
  pretendAdd: {
    reg: "^伪装添加群号[0-9]+$",
    priority: 200,
    describe: "伪装添加群号",
  },
  pretendSearch: {
    reg: "^伪装查看群号合集$",
    priority: 200,
    describe: "伪装查看群号合集",
  },
  pretendDel: {
    reg: "^伪装删除群号[0-9]+$",
    priority: 200,
    describe: "伪装删除群号",
  },
  pretendSet: {
    reg: "^伪装设置群号[0-9]+$",
    priority: 200,
    describe: "伪装设置群号",
  },
  pretend: {
    reg: ".*",
    priority: 10000,
    describe: "发言",
  },
};


export async function pretendAdd(e, {render}) {
  if (e.at && !e.atBot) {
    return;
  }
  if(!e.isMaster || e.isGroup){
    return;
  }

  let key = `ayaka:pretend:group_id`;
  let groupData = await global.redis.get(key);
  if(!groupData) groupData = '';

  const newGroupId = e.msg.replace('伪装添加群号', '');
  groupData += newGroupId + ',';

  await global.redis.set(key, groupData, {
    EX: 30e6,
  });

  e.reply(`群号: ${newGroupId} 添加成功`);

  return true;
}


export async function pretendSearch(e, {render}) {
  if (e.at && !e.atBot) {
    return;
  }
  if(!e.isMaster || e.isGroup){
    return;
  }

  let key = `ayaka:pretend:group_id`;
  let groupData = await global.redis.get(key);
  if(!groupData) groupData = '无';

  let key2 = `ayaka:pretend:group_id_now`;
  let groupData2 = await global.redis.get(key2);
  if(!groupData2) groupData2 = '无';

  e.reply(`当前保存的群号: ${groupData}, 当前设置的群号: ${groupData2}`);

  return true;
}


export async function pretendDel(e, {render}) {
  if (e.at && !e.atBot) {
    return;
  }
  if(!e.isMaster || e.isGroup){
    return;
  }

//e.msg

  return true;
}

export async function pretendSet(e, {render}) {
  if (e.at && !e.atBot) {
    return;
  }
  if(!e.isMaster || e.isGroup){
    return;
  }

  let key = `ayaka:pretend:group_id_now`;

  const newGroupId = e.msg.replace('设置群号', '');

  await global.redis.set(key, newGroupId, {
    EX: 30e6,
  });

  e.reply(`群号: ${newGroupId} 设置成功`);

  return true;
}


export async function pretend(e, {render}) {

  if(!__config.useAyakaPretend){
    return;
  }

  if (e.at && !e.atBot) {
    return;
  }

  if(!e.isMaster || !e.isPrivate){
    return;
  }

  let key = `ayaka:pretend:group_id_now`;
  let groupData = await global.redis.get(key);

  if(!groupData) return;

  //let msg = segment.image(`base64://${base64}`);
  //e.reply(segment.image(`base64://${base64}`));

  /*
  message: [
    {
      type: 'image',
      file: '75990ca9a3853bd3532e44b689d2467510168-65-65.gif',
      url: 'https://c2cpicdw.qpic.cn/offpic_new/1160229372//1160229372-3056102424-75990CA9A3853BD3532E44B689D24675/0?term=2',
      asface: true
    }
  ],
  */

  let out = null
  const _msg = e.message[0]; //type face/image/test

  if(_msg.type === 'text'){
    out = e.msg
  }else if(_msg.type === 'face'){
    out = segment.face(_msg.id);
  }else if(_msg.type === 'image'){
    return;
  }else{
    return;
  }

  if(!out){
    return;
  }

  Bot.pickGroup(groupData).sendMsg(out).catch((err) => {
    Bot.logger.mark(err);
  });

  return true;
}
