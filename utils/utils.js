export default {
  //                         1=1s  35day
  async setRedis(key, value, time = 30e6){
    await redis.set(key, JSON.stringify(value), {
      EX: time
    })
  },
  async getRedis(key, type = []){
    const value = await redis.get(key)
    let item = null;
    try{
      item = value ? JSON.parse(value) : type
    }catch (e){
      item = value
    }
    return item
  },
  async clearRedis(key){
    await redis.set(key, '')
  },
  type(item){
    return Object.prototype.toString.call(item).slice(8,-1)
  }
}