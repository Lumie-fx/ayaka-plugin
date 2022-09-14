import fs from 'node:fs'

const files = fs.readdirSync('./plugins/ayaka-plugin/apps').filter(file => file.endsWith('.js'))

let ret = []

files.forEach((file) => {
  ret.push(import(`./apps/${file}`))
})

ret = await Promise.allSettled(ret)

let apps = {}
for (let i in files) {
  let name = files[i].replace('.js', '')

  if (ret[i].status != 'fulfilled') {
    logger.error(`载入插件错误：${logger.red(name)}`)
    logger.error(ret[i].reason)
    continue
  }
  apps[name] = ret[i].value[Object.keys(ret[i].value)[0]]
}

logger.info('------------------')
logger.info('加载ayaka插件完成..')
logger.info('------------------')

let restart = await redis.get(`Yunzai:ayaka:restart`);
if (restart) {
    restart = JSON.parse(restart);
    if (restart.isGroup) {
        Bot.pickGroup(restart.id).sendMsg(`重启成功`);
    } else {
        common.relpyPrivate(restart.id, `重启成功`);
    }
    redis.del(`Yunzai:ayaka:restart`);
}

export { apps }
