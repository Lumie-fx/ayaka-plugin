import { segment } from "oicq";
import lodash from "lodash";
import fs from "fs";
import fetch from 'node-fetch'
import { render } from "../adapter/render.js";
import utils from "../utils/utils.js";

export class ayakaTest extends plugin {
  constructor () {
    super({
      name: 'ayaka测试命令',
      dsc: 'ayaka测试命令',
      event: 'message',
      priority: 5000,
      rule: [{
        reg: "测试",
        fnc: 'ayakaTest',
      }]
    })
  }

  async ayakaTest(e){
    if (e.img || e.hasReply) {
      return;
    }
    await utils.setRedis('test', {value: 'test ayaka set redis'})
    const v = await utils.getRedis('test');
    logger.mark(v.value)


    return true;
  }
}
