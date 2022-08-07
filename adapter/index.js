import plugin from '../../../lib/plugins/plugin.js'
import * as App from '../apps/index.js'
import { render } from './render.js'

export class Ayaka extends plugin {
  constructor () {
    let rule = {
      reg: '.+',
      fnc: 'dispatch'
    }
    super({
      name: 'ayaka-plugin',
      desc: '云原神插件',
      event: 'message',
      priority: 50,
      rule: [rule]
    })
    Object.defineProperty(rule, 'log', {
      get: () => !!this.isDispatch
    })
  }

  accept () {
    this.e.original_msg = this.e.original_msg || this.e.msg
  }

  async dispatch (e) {
    let msg = e.original_msg || ''
    if (!msg) {
      return false
    }
    console.log("-------------------------")
    console.log(msg)
    msg = msg.replace('#', '').trim()
    for (let fn in App.rule) {
      let cfg = App.rule[fn]
      if (App[fn] && new RegExp(cfg.reg).test(msg)) {
        let ret = await App[fn](e, {
          render
        })
        if (ret === true) {
          this.isDispatch = true
          return true
        }
      }
    }
    return false
  }
}
