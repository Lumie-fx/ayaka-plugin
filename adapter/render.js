import lodash from 'lodash'
import Data from './Data.js'
import puppeteer from '../../../lib/puppeteer/puppeteer.js'

const plugin = 'ayaka-plugin'

const _path = process.cwd()

export async function render (app = '', tpl = '', data = {}, imgType = 'jpeg') {
  // 在data中保存plugin信息
  data._plugin = plugin

  if (lodash.isUndefined(data._res_path)) {
    data._res_path = `../../../../../plugins/${plugin}/resources/`;
    data.ayaka = `../../../../../plugins/${plugin}/resources/`;
    data._sys_res_path = `../../../../../plugins/`;
    data.root = `../../../../../plugins/`;
  }
  Data.createDir(_path + '/data/', `html/${plugin}/${app}/${tpl}`)
  data.saveId = data.saveId || data.save_id || tpl
  data.tplFile = `./plugins/${plugin}/resources/${app}/${tpl}.html`
  data.pluResPath = data._res_path
  return await puppeteer.screenshot(`ayaka-plugin/${app}/${tpl}`, data)
}
