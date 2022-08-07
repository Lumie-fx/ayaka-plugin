export * from './apps/index.js'
import Data from './components/Data.js'
import __config from './config.js';

let index = { Ayaka: {} }
if (true) {
  index = await Data.importModule('/plugins/ayaka-plugin/adapter', 'index.js')
}
export const ayaka = index.Ayaka || {}



console.log(`ayaka plugin:${__config.ver}初始化~`);