import { segment } from "oicq";
import lodash from "lodash";
import fs from "fs";


export const rule = {
  syw: {
    reg: "^/刷遗物*",
    priority: 1000,
    describe: "【抽取】获取随机圣遗物",
  },
  sywOne: {
    reg: "^/查看[0-9]+$",
    priority: 1000,
    describe: "【查看】查看的某个圣遗物",
  },
  sywLevelUp: {
    reg: "^/强化$", //匹配的正则
    priority: 1000, //优先级，越小优先度越高
    describe: "【强化】圣遗物强化", //描述说明
  },
  sywSave: {
    reg: "^/保存$", //匹配的正则
    priority: 1000, //优先级，越小优先度越高
    describe: "【保存】保存圣遗物", //描述说明
  },
  sywDeleteAll: {
    reg: "^/删除全部圣遗物$",
    priority: 1000,
    describe: "【删除】删除已存的所有圣遗物",
  },
  sywDeleteOne: {
    reg: "^/删除[0-9]+$",
    priority: 1000,
    describe: "【删除】删除选定序号的圣遗物",
  }
};


//创建html文件夹
// if (!fs.existsSync(`./data/html/genshin/syw/`)) {
//   fs.mkdirSync(`./data/html/genshin/syw/`);
// }


let sywConfig = {};

await init();

export async function init(isUpdate) {
  //当前缓存
  sywConfig = JSON.parse(fs.readFileSync(process.cwd()+"/plugins/ayaka-plugin/resources/meta/configs/syw.json", "utf8"));
}

//通过单个圣遗物名字, 获取套装名称、套装效果文字说明
function getSywDetailInfo(fullName){
  let _key = '';
  const one = sywConfig.list.filter(res=>{
    const keyArr = Object.keys(res);
    const key = keyArr.filter(k=>!/^[a-zA-Z0-9]+$/.test(k) && res[k][0].includes(fullName))[0];
    if(key) _key = key;
    return key;
  })[0];
  return {
    fullName: one.typeFull[one.type.indexOf(_key)],       //平息鸣雷的尊者
    effect1: one[_key][1],        //2件套效果
    effect2: one[_key][2]         //4件套效果
  }
}

//#抽圣遗物
export async function syw(e, {render}) {
  if (e.img || e.hasReply) {
    return;
  }
  //
  let user_id = e.user_id; //qq
  let name = e.sender.card; //?

  if(e.msg.length > 10) return;
  //e.msg 发的关键指令
  // Bot.logger.mark(e.msg);
  const _syw = e.msg.replace('/刷遗物','').replace('套',''); //少女
  console.log(_syw)
  let sywObj = null;

  sywObj = sywConfig.list.filter(res=>{
    return new RegExp(res.reg).test(_syw);
  })[0];

  if(!sywObj){
    return await e.reply('要输入具体的套装名称哦，比如：/刷圣遗物水套');
  }

  const _regArr = sywObj.type;
  const symbolSywNameZh = lodash.sample(_regArr);    //2件套里随机某一件名称:少女
  // const sywFullName = sywObj.typeFull[sywObj.type.indexOf(symbolSywNameZh)];//圣遗物全称
  const sywList = sywObj[symbolSywNameZh][0];        //特定套装的五个圣遗物
  const sywBase = ["flower","feather","hourglass","glass","hat"];
  const sywBaseZh = ["生之花","死之羽","时之沙","空之杯","理之冠"];
  const symbolType = lodash.sample(sywBase);         //随机一种圣遗物类型
  const _config = sywConfig.base[symbolType];        //特定圣遗物的主副属性词条集合[en]
  const mainAttr = lodash.sample(_config.main);      //随机主属性en
  const mainAttrObj = sywConfig.upgradeList[mainAttr];//该属性是数字还是百分比
  const mainNum = sywConfig.upgradeList[mainAttr].main[0];//主属性数值num
  const secAttrList = _config.secondary.filter(res=>res!==mainAttr);//副属性随机集合[en]
  const secondAttrSample = lodash.sampleSize(secAttrList,Math.random()>.75?4:3);//副属性抽取
  const type = sywBase.indexOf(symbolType);
  const thisSyw = {
    isNow: true,                                  //是否现在在升级的(用户唯一)
    id: new Date().getTime()+'syw',
    name: sywList[sywBase.indexOf(symbolType)],   //平雷之花
    type: symbolType,                             //flower
    typeZh: sywBaseZh[type],                      //生之花
    level: '0',                                   //当前等级
    mainAttr,                                     //主属性英文名称:littleLife
    mainAttrZh: sywConfig.en2zh[mainAttr],        //主属性中文名称:生命值
    eleType: mainAttr === 'elementDamage' ? lodash.sample(['风','雷','水','火','岩','冰','草']) : '',//火 | ''
    mainNum: mainAttrObj.type === 'number' ? mainNum.toFixed(0) : (mainNum.toFixed(1)+'%'), //717
    secondArr: secondAttrSample.map(res=>{
      const inner = sywConfig.upgradeList[res],
        num = lodash.sample(inner.secondary);
      return {
        attr: res,         //life
        attrZh: sywConfig.en2zh[res],//生命值
        realNum: parseFloat(num.toFixed(2)),
        num: inner.type === 'number' ? num.toFixed(0) : (num.toFixed(1)+'%') //5.8%
      }
    })
  }

  // Bot.logger.mark(thisSyw);
  const strObj = await strengthCalculate(user_id);
  if(!strObj.flag){
    return await e.reply([segment.at(e.user_id, name), ` 你的体力剩余${strObj.strength}点，不足以获取圣遗物哦~`]);
  }

  let key = `genshin:syw:${user_id}`;


  let base64 = await render("pages", "syw", {
    save_id: user_id,
    name: name,
    syw: thisSyw,
    sywDetail: getSywDetailInfo(thisSyw.name),
    strength: strObj.strength,
    fullStrength: strObj.fullStrength
  });

  if (base64) {
    let sywData = await global.redis.get(key);
    sywData = JSON.parse(sywData || '{}'); //获取当前用户所有圣遗物数据
    const now = new Date();
    const _date = now.getFullYear()+'-'+(now.getMonth()+1)+'-'+now.getDate();

    if(!sywData.today){
      sywData.today = [];
      sywData.date = _date;
    }
    if(sywData.date !== _date){//新的一天
      sywData.today = [];
    }
    if(!sywData.bag){
      sywData.bag = [];
    }

    sywData.date = _date;
    sywData.today.map(res=>res.isNow = false);//将之前圣遗物全部置为非当前, 避免强化混乱
    /**
     *  bag中isNow不置为false => bag中始终有isNow的圣遗物
     */
    sywData.bag.map(res=>res.isNow = false);  //将之前圣遗物全部置为非当前, 避免强化混乱

    sywData.today.push(JSON.parse(JSON.stringify(thisSyw)))
    redis.set(key, JSON.stringify(sywData), {
      EX: 30e6
    });

    // Bot.logger.mark(sywData.today);

    let msg = segment.image(`base64://${base64.file.toString('base64')}`);
    let msgRes = await e.reply(msg);
  }

  return true;
}

//强化
export async function sywLevelUp(e, {render}){
  if (e.img || e.hasReply) {
    return;
  }

  const user_id = e.user_id; //qq
  const name = e.sender.card; //qq昵称

  const key = `genshin:syw:${user_id}`;
  let sywData = await global.redis.get(key);
  sywData = JSON.parse(sywData || '{}');
  if(!sywData.today && !sywData.bag){
    return await e.reply([segment.at(e.user_id, name), ` 你现在没有圣遗物，要先抽取圣遗物哦~`]);
  }

  if(!sywData.today) sywData.today = [];
  if(!sywData.bag) sywData.bag = [];

  const _today = sywData.today.filter(res=>res.isNow)[0]
  const _bag = sywData.bag.filter(res=>res.isNow)[0]
  const one = _today || _bag; //当前圣遗物

  if(!one){
    return await e.reply([segment.at(e.user_id, name), ` 你需要通过「查看」命令先选中一个圣遗物哦~`]);
  }

  const mainLevel = ['0','4','8','12','16','20'];
  if(one.level === '20'){
    return await e.reply([segment.at(e.user_id, name), ` 你已经强化到最高等级啦~`]);
  }
  const levelNow = mainLevel.indexOf(one.level); //当前等级列
  one.level = mainLevel[levelNow+1];             //等级+4
  const newMainObj = sywConfig.upgradeList[one.mainAttr]; //主属性对象
  const newMainNum = newMainObj.main[levelNow+1];         //主属性新等级数值
  one.mainNum = newMainObj.type === 'number' ? newMainNum.toFixed(0) : (newMainNum.toFixed(1)+'%') //5.8%
  const secondUpIdx = lodash.sample([0,1,2,3]);  //副属性升级的index
  const secOne = one.secondArr[secondUpIdx];     //副属性选定

  if(one.secondArr.length<4){ //3词条
    const mainBase = sywConfig.base[one.type]; //base集合
    const attrAll = lodash.concat(one.secondArr.map(res=>res.attr), one.mainAttr); //已有的属性
    const newAttr = lodash.sample(mainBase.secondary.filter(res=>!attrAll.includes(res)));//新属性
    const secObj = sywConfig.upgradeList[newAttr]; //当前副属性对象
    const secNum = lodash.sample(secObj.secondary);//副属性值
    one.secondArr.push({
      attr: newAttr,
      attrZh: sywConfig.en2zh[newAttr],
      realNum: parseFloat(secNum.toFixed(2)),
      num: secObj.type === 'number' ? secNum.toFixed(0) : (secNum.toFixed(1)+'%')
    })
  }else{
    const _newNum = lodash.sample(sywConfig.upgradeList[secOne.attr].secondary) + secOne.realNum;
    one.secondArr[secondUpIdx] = {
      attr: secOne.attr,
      attrZh: secOne.attrZh,
      realNum: parseFloat(_newNum.toFixed(2)),
      num: sywConfig.upgradeList[secOne.attr].type === 'number' ? _newNum.toFixed(0) : (_newNum.toFixed(1)+'%')
    };
  }

  const base64 = await render("pages", "syw", {
    save_id: user_id,
    name: name,
    syw: one,
    sywDetail: getSywDetailInfo(one.name)
  });

  if (base64) {
    sywData.today.map(res=>{
      if(res.id === one.id){
        const _res = JSON.parse(JSON.stringify(one));
        res.level = _res.level;
        res.mainNum = _res.mainNum;
        res.secondArr = _res.secondArr;
        res.isNow = !!_today;
      }
    });

    sywData.bag.map(res=>{
      if(res.id === one.id){
        const _res = JSON.parse(JSON.stringify(one));
        res.level = _res.level;
        res.mainNum = _res.mainNum;
        res.secondArr = _res.secondArr;
        res.isNow = !!_bag;
      }
    });

    redis.set(key, JSON.stringify(sywData), {
      EX: 30e6
    });
    let msg = segment.image(`base64://${base64.file.toString("base64")}`);
    let msgRes = await e.reply(msg);
  }
  return true;
}

//保存
export async function sywSave(e){
  if (e.img || e.hasReply) {
    return;
  }

  const user_id = e.user_id; //qq
  const name = e.sender.card; //qq昵称

  const key = `genshin:syw:${user_id}`;
  let sywData = await global.redis.get(key);
  sywData = JSON.parse(sywData || '{}');
  if(!sywData.today || sywData.today.length===0){
    return await e.reply([segment.at(e.user_id, name), ` 你现在没有圣遗物，要先抽取圣遗物哦~`]);
  }

  if(sywData.today.some(res=>res.isNow)){
    const one = sywData.today.filter(res=>{
      const flag = res.isNow;
      res.isNow = false;
      return flag;
    })[0]; //今日最新的/选中的圣遗物   今日now的圣遗物选出, 并把now置为false
    if(!sywData.bag) sywData.bag = [];
    if(sywData.bag.some(res=>res.id===one.id)) return await e.reply([segment.at(e.user_id, name), ` 这个圣遗物你已经保存过啦！`]);
    if(sywData.bag.length>30) return await e.reply([segment.at(e.user_id, name), ` 当前最多只能保存30个圣遗物哦~`]);

    sywData.bag.push({
      ...one,
      isNow: true
    });

    redis.set(key, JSON.stringify(sywData), {
      EX: 30e6
    });
    return await e.reply([segment.at(e.user_id, name), ` 圣遗物保存成功~`]);
  }else{
    return await e.reply([segment.at(e.user_id, name), ` 请查看圣遗物列表，暂时没有圣遗物可以保存哦~`]);
  }

}

//删除全部圣遗物
export async function sywDeleteAll(e){
  if (e.img || e.hasReply) {
    return;
  }
  const user_id = e.user_id; //qq
  const name = e.sender.card; //qq昵称

  const key = `genshin:syw:${user_id}`;
  let sywData = await global.redis.get(key);
  sywData = JSON.parse(sywData || '{}');

  if(!sywData.bag || sywData.bag.length===0){
    return await e.reply([segment.at(e.user_id, name), ` 你的包裹中没有圣遗物哦~`]);
  }

  sywData.bag = [];
  redis.set(key, JSON.stringify(sywData), {
    EX: 30e6
  });

  // Bot.logger.mark(sywData.bag);
  return await e.reply([segment.at(e.user_id, name), ` 已删除全部圣遗物~`]);
}

//删除一个圣遗物
export async function sywDeleteOne(e){
  if (e.img || e.hasReply) {
    return;
  }
  const user_id = e.user_id; //qq
  const name = e.sender.card; //qq昵称
  const msg = e.msg;

  const key = `genshin:syw:${user_id}`;
  let sywData = await global.redis.get(key);
  sywData = JSON.parse(sywData || '{}');

  if(!sywData.bag || sywData.bag.length===0){
    return await e.reply([segment.at(e.user_id, name), ` 你的包裹中没有圣遗物哦~`]);
  }

  const idx = parseInt(msg.replace('删除','')) - 1;

  if(!sywData.bag[idx]){
    return await e.reply([segment.at(e.user_id, name), ` 你的包裹中没有这个圣遗物哦~`]);
  }

  //序列编号 1,2,3,4,5,6,7,8
  sywData.bag.splice(idx, 1);

  redis.set(key, JSON.stringify(sywData), {
    EX: 30e6
  });

  // Bot.logger.mark(sywData.bag);
  return await e.reply([segment.at(e.user_id, name), ` 已删除~`]);
}


//查看
export async function sywOne(e, {render}){
  if (e.img || e.hasReply) {
    return;
  }

  const user_id = e.user_id; //qq
  const name = e.sender.card; //qq昵称

  const key = `genshin:syw:${user_id}`;
  let sywData = await global.redis.get(key);
  sywData = JSON.parse(sywData|| '{}');

  if((!sywData.bag || sywData.bag.length === 0) && (!sywData.today || sywData.bag.today === 0)){
    return await e.reply([segment.at(e.user_id, name), ` 你现在没有圣遗物哦~`]);
  }

  const index = parseInt(e.msg.replace('/查看', ''));

  let bagOne = sywData.bag[index - 1];
  if(!bagOne){
    if(!sywData.bag) sywData.bag = [];
    const todayIdx = index - sywData.bag.length - 1;
    bagOne = sywData.today[todayIdx];
    if(!bagOne){
      return await e.reply([segment.at(e.user_id, name), ` 你没有这个圣遗物哦~`]);
    }
  }

  if(sywData.today && sywData.today.length > 0){
    sywData.today.map(res=>res.isNow = false);
  }
  sywData.bag.map(res=>res.isNow = false);
  bagOne.isNow = true;
  redis.set(key, JSON.stringify(sywData), {
    EX: 30e6
  });

  const base64 = await render("pages", "syw", {
    save_id: user_id,
    name: name,
    syw: bagOne,
    sywDetail: getSywDetailInfo(bagOne.name)
  });

  if (base64) {
    let msg = segment.image(`base64://${base64.file.toString("base64")}`);
    let msgRes = await e.reply(msg);
  }
  return true;
}

async function strengthCalculate(user_id){
  const strengthKey = `genshin:syw_strength:${user_id}`;
  let strengthStr = await global.redis.get(strengthKey);
  let strengthObj = null;
  if(!strengthStr){
    strengthObj = {
      lastUpdatedTime: +new Date(),
      strength: 160
    }
  }else{
    strengthObj = JSON.parse(strengthStr);
  }

  const now = +new Date(),
    strengthTime = 480000; //每点体力恢复时间 86400 * 1000 / 180;

  // Bot.logger.mark((now - strengthObj.lastUpdatedTime)/strengthTime);

  const recover = parseInt((now - strengthObj.lastUpdatedTime)/strengthTime + ''); //恢复的体力
  if(strengthObj.strength + recover >= 160){
    strengthObj.strength = 160;
  }else{
    strengthObj.strength = strengthObj.strength + recover;
  }

  let flag = true;

  if(strengthObj.strength < 20){
    flag = false;
  }else{
    strengthObj.strength = strengthObj.strength - 20;//如果是从抽取圣遗物的入口进入
    strengthObj.lastUpdatedTime = now;
    await global.redis.set(strengthKey, JSON.stringify(strengthObj), {
      EX: 30e6
    });
  }

  return {
    flag,
    fullStrength: 160,
    strength: strengthObj.strength
  };
}

