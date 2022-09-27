import lodash from "lodash";
import utils from "../utils/utils.js";

export default {
  event: {
    lv1: [
      {text: '遇见盗宝鼬，一不留神被偷了摩拉。', key: 'calc', thing: 'mora', amount: - Math.ceil(Math.random()*5) * 1000},
      {text: '遇见盗宝鼬，打晕它得到了摩拉。', key: 'calc', thing: 'mora', amount: Math.ceil(Math.random()*5) * 1000},
      {text: '遇见盗宝鼬，相安无事无事发生。'},
      {text: '被大野猪拱了，你很生气但是追不上它。'},
      {text: '被大野猪拱了，你追上去把它剁成了兽肉。'},
      {text: '看见了飞在空中的晶蝶，但是它飞太高了你拿它没有办法'},
      {text: '看见了飞在空中的晶蝶，你尝试抓它', key: 'check', check: true, checkSucc: 'catchCrystalButterfly'},
      {text: '你很口渴，去喝了不少水。', key: 'item', item: ['LotsOfWater']},
    ],
    lv2: [
      {text: '你走在路上，意外捡到了北国银行的贵宾卡。', key: 'item', item: ['BankOfNorthVIPCard']},
      {text: '你见到了一群丘丘人，痛揍了它们一顿，得到了不少摩拉。', key: 'calc', thing: 'mora', amount: 8000},
      {text: '一个火把丘丘人突然袭击你，你被撞倒在地，摩拉散落一地。', key: 'calc', thing: 'mora', amount: -5000},
      {text: '你遇见了多莉，得到了奇怪的罐装知识。', key: 'item', item: ['CanningKnowledge']},
      {text: '你遇见了带面具的巫女，', key: 'check', check: true, checkSucc: 'helpWitch', banned: []},
    ],
    lv3: [
      {text: '你见到了一群盗宝团，痛揍了它们一顿，得到了许多摩拉。', key: 'calc', thing: 'mora', amount: 20000},
      {text: '你见到了一群盗宝团，痛揍了它们一顿，得到了一张藏宝图。', key: 'item', item: ['TreasureMap']},
    ],
    lv4: [
      {text: '你走到了北国银行门口，', key: 'check', check: ['BankOfNorthVIPCard'], checkSucc: 'northBankSucc', checkFail: 'northBankFail'},
      {text: '你到了黄金屋，遇到了好战的公子，', key: 'check', check: true, checkSucc: 'tartagliaV1'},
      {text: '你到了黄金屋，屋内没有一个人，但是里面的摩拉都是贴图你拿不起来。'},
    ],
    lv5: [
      {text: '你在路中央看到了亮闪闪的东西，过去将它捡了起来。', key: 'calc', thing: 'primogem', amount: 100},
      {text: '你遇见了？？？', key: 'check', check: ['CanningKnowledge','LotsOfWater'], checkSucc: 'naXiDaSucc', checkFail: 'naXiDaFail'},
    ]
  },
  check: {
    northBankSucc: [
      {text: '找到服务员交还了贵宾卡。', priority: 300},
      {text: '进入了银行，意外找到了储藏室中的摩拉箱。', key: 'calc', thing: 'mora', amount: 200000},
    ],
    northBankFail: [
      {text: '因为没有贵宾卡，只能走开了。'},
      {text: '妄想进入银行，被管理人发现并揍了一顿。', key: 'finish'},
      {text: '使用荒星卡bug卡进了银行，', key: 'check', check: true, checkSucc: 'northBankSucc'},
    ],
    tartagliaV1: [
      {text: '他二话不说就跟你开打，你被暴揍了一顿。'},
      {text: '他二话不说就跟你开打，结果被你几下制服，开启了二阶段，', key: 'check', check: true, checkSucc: 'tartagliaV2'},
      {text: '他二话不说就跟你开打，被你压制后想使用大鲸鱼，结果鲸鱼今天休假了用不出来，被打进了二阶段，', key: 'check', check: true, checkSucc: 'tartagliaV2'},
    ],
    tartagliaV2: [
      {text: '他使用雷元素力后迅捷的动作让你反应不及，你被暴揍了一顿。'},
      {text: '他使用雷元素力后仍被你压制，愤怒之下开启了魔王武装，', key: 'check', check: true, checkSucc: 'tartagliaV3'},
      {text: '他使用雷元素力后因为速度过快撞到了墙，为了掩饰尴尬开启了魔王武装', key: 'check', check: true, checkSucc: 'tartagliaV3'},
    ],
    tartagliaV3: [
      {text: '魔王武装后的达达利亚过于恐怖，你被暴揍了一顿。'},
      {text: '你自沉着应对，矫健的身姿游走于电光水隙之间，最终把他打成了地脉花，你获得了丰富的奖励。', key: 'calc', thing: 'primogem', amount: 100},
    ],
    catchCrystalButterfly: [
      {text: '可惜它飞太高了你够不着。'},
      {text: '最终被你抓到了。', key: 'strength', amount: 20},
    ],
    naXiDaSucc: [
      {text: '但是你水喝多了尿急没有理她，而是直接冲向了厕所，出来后发现她在等你，她说她叫纳西妲，并帮你解开了罐装知识的秘密，你得到了亮闪闪的东西。', key: 'calc', thing: 'primogem', amount: 300},
    ],
    naXiDaFail: [
      {text: '但是你并不认识？？？'},
    ],
    helpWitch: [
      {text: '她说她叫八重神子，她带面具只是觉得好玩。', priority: 300},
      {text: '她说她叫博丽灵梦，不好意思走错片场了。', priority: 300},
      //todo  banned 根据已经有的包里/长期道具，将不会出现此条支线
      {banned: ['FoxMask'], text: '她说她叫花散里，希望你能帮她祓除神樱的污秽，', key: 'check',
       check: ['KazariGanTian', 'KazariShenShe', 'KazariWuBaiZang', 'KazariHuangHai', 'KazariSheFengXing'], checkSucc: 'kazariLineFin', checkFail: 'kazariLine'},
      {text: '她说她叫阿祇，希望你能帮她举行千灯的仪式，支线制作中...'},
      {text: '她说她叫久岐忍，希望你能帮她摆脱家庭束缚，支线制作中...'},
    ],
    kazariLine: [
      {banned: ['KazariGanTian'], text: '来到绀田村，获得绀田村长的情报，祓去了村下神樱枝条的污秽。', key: 'item', item: ['KazariGanTian'], saveItem: true, thing: 'primogem', amount: 50},
      {banned: ['KazariShenShe'], text: '来到废弃神社，得到巫女影子的帮助，祓去了山下神樱枝条的污秽。', key: 'item', item: ['KazariShenShe'], saveItem: true, thing: 'primogem', amount: 50},
      {banned: ['KazariWuBaiZang'], text: '来到镇守之森，得到五百藏的指引，祓去了隐藏在山中神樱枝条的污秽。', key: 'item', item: ['KazariWuBaiZang'], saveItem: true, thing: 'primogem', amount: 50},
      {banned: ['KazariHuangHai'], text: '来到荒海，历经千辛万苦，祓去了海底深处神樱枝条的污秽。', key: 'item', item: ['KazariHuangHai'], saveItem: true, thing: 'primogem', amount: 50},
      {banned: ['KazariSheFengXing'], text: '来到社奉行，得到了神里绫华的帮助，祓去了社奉行山下神樱枝条的污秽。', key: 'item', item: ['KazariSheFengXing'], saveItem: true, thing: 'primogem', amount: 50},
    ],
    kazariLineFin: [
      {text: ['你成功解决了5处污秽，花散里告诉你该进行最后的大祓了，', '一番恶战过后，你成功消灭了恶瘴，但是面具巫女。。。', '你得到了珍稀物品「狐狸面具」。'], key: 'item', item: ['FoxMask'], saveItem: true},
    ]
  },

  msgList: [],
  itemList: [],
  exploreSavedItem: {}, //探索保存的长期道具
  gain: {},
  attr: {
    base: [5,5,5,5],
    refine: {}
  },
  gainList: {
    mora: '摩拉',
    primogem: '原石',
    exploreExp: '探索经验',
    strength: '体力',
  },

  exploreLv: 0,

  async start(num = 0, id){
    //初始化数据
    this.msgList = [];
    this.itemList = [];
    this.gain = {
      exploreExp: 0,
    };
    const exploreSave = await utils.getRedis(`ayaka:${id}:explore`, {});
    this.exploreLv = exploreSave?.exploreLv || 0;
    this.exploreExp = exploreSave?.exploreExp || 0;

    this.msgList.push(`当前探索等级: Lv${this.exploreLv}。`);

    for(let i = 0;i < this.exploreLv * 2; i++){
      const idx = Math.floor(Math.random() * 4);
      this.attr.base[idx] ++;
    }
    this.attr.refine = {
      str: this.attr.base[0],
      int: this.attr.base[1],
      agi: this.attr.base[2],
      luc: this.attr.base[3],
    }
    //初始化属性

    //事件执行
    await this.next(num, id);
    this.msgList.push('已结束。');
    this.msgList.push('============');

    let gainMsg = '本次探索获取：';
    for(let _key in this.gain){
      gainMsg += this.gainList[_key] + this.gain[_key] + '，';
    }
    gainMsg = gainMsg.slice(0, -1) + '。';

    this.msgList.push(gainMsg);

    //数据处理
    //todo 数据保存
    console.log(this.gain);

    return this.msgList;
  },
  async next(num, id){

    num += Math.floor(Math.random() * 20) + 10;

    //todo
    // 1.事件lv6~8 探险等级6、8、10解锁


    const full = 100 + this.exploreLv * 10; //100~200
    const per = {
      lv1: .4, lv2: .7, lv3: .85, lv4: .95, lv5: 1
    };

    console.log(num, full * per.lv1, full);

    let eventLv = '';
    if(num < full * per.lv1){
      eventLv = 'lv1';
      this.gain.exploreExp += utils.config.explore.expGain[0];
    }else if(num < full * per.lv2){
      eventLv = 'lv2';
      this.gain.exploreExp += utils.config.explore.expGain[1];
    }else if(num < full * per.lv3){
      eventLv = 'lv3';
      this.gain.exploreExp += utils.config.explore.expGain[2];
    }else if(num < full * per.lv4){
      eventLv = 'lv4';
      this.gain.exploreExp += utils.config.explore.expGain[3];
    }else if(num <= full * per.lv5){
      eventLv = 'lv5';
      this.gain.exploreExp += utils.config.explore.expGain[4];
    }else{
      return this.msgList;
    }

    let finish = false;
    const event = this.sample(this.event[eventLv]);

    const func = async (event) => {
      if(event.text){
        this.msgList = this.msgList.concat(event.text);
      }
      if(event.key === 'finish'){
        finish = true;
      }else if(event.key === 'item'){
        event.item.forEach(res => {
          if(!this.itemList.includes(res)){
            this.itemList.push(res);
          }
        });
        if(event.thing){
          this.gain[event.thing] = (this.gain?.[event.thing] || 0) + event.amount;
        }
        if(event.saveItem){
          let exploreSavedItem = await utils.getRedis(`ayaka:${id}:exploreSavedItem`, []);
          await utils.setRedis(`ayaka:${id}:exploreSavedItem`, lodash.uniq([...exploreSavedItem, ...event.item]));
        }
      }else if(event.key === 'check'){
        if(event.check === true){
          const newEventList = this.check[event.checkSucc];
          await func(this.sample(newEventList));
        }else{
          let flag = true;
          event.check.forEach(res => {
            if(!this.itemList.includes(res)) flag = false;
          });
          const newEventList = flag ? this.check[event.checkSucc] : this.check[event.checkFail];
          await func(this.sample(newEventList));
        }
      }else{
        if(event.thing){
          this.gain[event.thing] = (this.gain?.[event.thing] || 0) + event.amount;
        }
      }
    }

    await func(event);

    if(finish){
      this.msgList.push('探索中断。');
      return this.msgList;
    }else{
      await this.next(num, id);
    }
  },

  sample(eventArr){
    const priorityArr = eventArr.map(res => res?.priority || 100);
    const full = priorityArr.reduce((sum, now) => sum + now, 0);
    const drop = Math.floor(Math.random() * full);
    let chooseIdx = 0;
    eventArr.reduce((sum, now, idx) => {
      if(sum - drop < 0){
        chooseIdx = idx;
      }
      return sum + (now?.priority || 100);
    }, 0);
    return eventArr[chooseIdx];
  }
}
