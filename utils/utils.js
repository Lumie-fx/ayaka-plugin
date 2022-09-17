export default {
  async setRedis(key, value){
    await redis.set(key, JSON.stringify(value), {
      EX: 30e6
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
  type(item){
    return Object.prototype.toString.call(item).slice(8,-1)
  }
}