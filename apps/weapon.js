import { segment } from "oicq";
import lodash from "lodash";
import fs from "fs";
import { render } from '../adapter/render.js'

export const rule = {
    strengthen: {
        reg: "^/精炼武器*",
        priority: 1000,
        describe: "【抽取】获取随机圣遗物",
        fnc: 'strengthen'
    }

}

export async function strengthen(e) {
    e.reply(e.msg)
    this.finish('strengthen')
}