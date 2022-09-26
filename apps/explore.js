import { segment } from "oicq";
import lodash from "lodash";
import fs from "fs";
import { render } from "../adapter/render.js";

import exploreEvents from '../utils/exploreEvents.js'

export class ayakaExplore extends plugin {
  constructor () {
    super({
      name: '-探索',
      dsc: '探索获取矿石等资源',
      /** https://oicqjs.github.io/oicq/#events */
      event: 'message',
      priority: 100,
      rule: [{
        reg: "^-探索$",
        fnc: 'ayakaExplore',
      }]
    })
  }

  //探索
  async ayakaExplore(e){
    if (e.img || e.hasReply) {
      return;
    }
    const user_id = e.user_id; //qq
    const name = e.sender.card; //qq昵称

    //todo 体力消耗40

    const msg = await exploreEvents.start(0, user_id);
    // console.log(msg)
    // await e.reply(await Bot.makeForwardMsg(msgList));
    const newList = msg.map(res => {
      return {
        message: res,
        nickname: Bot.nickname,
        user_id: Bot.uin,
      }
    })

    const msgList = await Bot.makeForwardMsg(newList)
    return await e.reply(msgList);
  }
}