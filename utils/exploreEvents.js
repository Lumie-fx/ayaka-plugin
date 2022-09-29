import lodash from "lodash";
import utils from "../utils/utils.js";

export default {
  event: {
    lv1: [
      {text: '遇见盗宝鼬，一不留神被偷了摩拉。', thing: 'mora', amount: - lodash.random(1, 5) * 1000},
      {text: '遇见盗宝鼬，打晕它得到了摩拉。', thing: 'mora', amount: lodash.random(1, 5) * 1000},
      {text: '遇见盗宝鼬，相安无事无事发生。'},
      {text: '你走在路上，遇到了野生的菌类，', next: 'patchMushroom'},
      {text: '被大野猪拱了，你很生气但是追不上它。'},
      {text: '被大野猪拱了，你追上去把它剁成了兽肉。', thing: 'exp', amount: 1},
      {text: '看见了飞在空中的晶蝶，但是它飞太高了你拿它没有办法。'},
      {text: '看见了飞在空中的晶蝶，你尝试抓它', next: 'catchCrystalButterfly'},
      {text: '你很口渴，去喝了不少水。', item: ['LotsOfWater'], key: 'check', check: this.refineAttr.luk > lodash.random(6,8), checkSucc: 'waterIsGood'},
      {text: '你发现你穿越到了500年前，', next: 'go500Ago'},
      {text: '你见到了一群丘丘人，痛揍了它们一顿，得到了不少摩拉。', thing: 'mora', amount: 8000},
      {text: '你见到了一群丘丘人，痛揍了它们一顿。', thing: 'exp', amount: 2},
      {text: '一个火把丘丘人冲上来对你使出了火之神神乐，你应对不及，被连招致死。', key: 'finish'},
      {text: '你在蒙德桥上看见了一群鸽子，', next: 'meetDoveV1'},
      {text: '你在蒙德城内上看见一个少女在为如何打碎木桩发愁，她说她叫艾琳，想让你教她，', next: 'meetAiLin'},
    ],
    lv2: [
      {text: '你走在路上，意外捡到了北国银行的贵宾卡。', item: ['BankOfNorthVIPCard']},
      {text: '你遇见了多莉，得到了奇怪的罐装知识。', item: ['CanningKnowledge']},
      {text: '你遇见了带面具的巫女，', next: 'helpWitch'},
      {text: '你到了西风骑士团，遇到了从中走出的骑兵队长，', next: 'meetKaiYa'}, //todo v我50
      {text: '你看到3朵甜甜花围着一个宝箱，心生戒备，绕开花朵打开了宝箱，拿到了奖励。', thing: 'mora', amount: 15000},
      {text: '一个雷莹术士突然对你展开攻击，你猝不及防之下中招了。', thing: 'exp', amount: -2},
      {text: `你看见一个落单的${lodash.sample(['雷莹术士','岩使游击兵','冰铳重卫士','火铳游击兵','雷锤前锋军'])}，`, next: 'meetFatui'},
      {text: '你来到望舒客栈，借着言笑大厨的厨具做了一道拿手好菜，', next: 'wangShuCook'},
    ],
    lv3: [
      {text: '你见到了一群盗宝团，痛揍了它们一顿，得到了许多摩拉。', thing: 'mora', amount: 20000},
      {text: '你见到了一群盗宝团，痛揍了它们一顿。', thing: 'exp', amount: 3},
      {text: '你见到了一群盗宝团，痛揍了它们一顿，得到了一张藏宝图。', item: ['TreasureMap']},
      {text: '你遇见了一个愚人众小队，以执行官达达鸭朋友的名义骗到了不少战略资金。', thing: 'mora', amount: 50000},
      {text: '你遇见了镀金旅团，', next: 'meetGoldenParty'},
      {text: '你在璃月港散步，', next: 'walkingOnLiYue'}
    ],
    lv4: [
      {banned: ['OldStone'], text: '你来到层岩巨渊，走在路上被什么东西绊了一跤，你一看，', key: 'check', check: this.refineAttr.luk > lodash.random(4,8), checkSucc: 'oldStoneSucc', checkFail: 'oldStoneFail'},
      {text: '你走到了北国银行门口，', key: 'check', check: ['BankOfNorthVIPCard'], checkSucc: 'northBankSucc', checkFail: 'northBankFail'},
      {text: '你到了黄金屋，遇到了好战的公子，', key: 'check', check: ['ChildBody'], checkSucc: 'tartagliaStep0', checkFail: 'tartagliaStep1'},
      {text: '你到了黄金屋，屋内全是摩拉，却没有一个人，但是里面的摩拉都是贴图你拿不起来。'},
      {text: '经历了许多事件，你心生困意，找了个地方睡了一觉，', key: 'check', check: ['ChildBody'], checkSucc: 'meetLanNaRaSucc', checkFail: 'meetLanNaRaFail'},
    ],
    lv5: [
      {text: '你在路中央看到了亮闪闪的东西，过去将它捡了起来。', thing: 'primogem', amount: 100},
      {text: '你遇见了？？？', key: 'check', check: ['CanningKnowledge','LotsOfWater'], checkSucc: 'naXiDaSucc', checkFail: 'naXiDaFail'},
      {text: '你来到了鸣神大社，', key: 'check', check: ['FoxMask'], checkSucc: 'goMingShenSucc', checkFail: 'goMingShenFail'},
    ],
    //魔神级
    lv6: [
      {text: '你来到了一场盛大的花神诞祭，你愉快的过完了整个祭奠，直到「嘀——」的一声，你发现整个世界回到了起点。', func:()=>{this.num=0;}},
    ],
    //尘世执政级
    lv7: [],
    //天理级/世界之外
    lv8: []
  },
  check: {
    walkingOnLiYue: [
      {text: '偶然听到了田铁嘴在说书，在他面前一个老大爷喝着茶，听的津津有味，', key: 'check', check: ['OldStone'], checkSucc: 'meetZhongLiSucc', checkFail: 'meetZhongLiFail'}
    ],
    meetZhongLiSucc: [
      {text: ['老大爷目不斜视听着书，突然出声：“小友，不妨坐下来一同听书？”',
             '这老大爷明明没有看你，你却觉得自己的全身被看透，身体不自觉地坐于一旁，就连精神也完全陷入听书之中，平日里呕哑嘲哳的说书，此时竟如白开水般被你吸纳理解……',
             '……“正所谓——「金石迸碎荡尘埃，磐山纡水尽为开，创龙点睛得助力，盘桓遂引雨露来！」”说书结束，田铁嘴退场，',
             '你久久无法回神，老大爷喝完最后一口茶，侧目：“小友于我有缘，可否将「老石」割爱于我？”',
             '你不自觉地拿出从层岩巨渊之外得来的石头，回过神来，那奇人与手上的石头皆已消失不见。'], thing: 'exp', amout: 10, item: ['ZhongLiThink'], deleteItem: ['OldStone']},
    ],
    meetZhongLiFail: [
      {text: '你对说书不感兴趣，走开了。', thing: 'exp', amout: 1},
    ],
    oldStoneSucc: [
      {text: '绊倒你的是一块蓝紫色的晶莹石头，你觉得它不简单，把它装入了口袋。', item: ['OldStone'], saveItem: true},
    ],
    oldStoneFail: [
      {text: '原来就是一块普通石头，你只能自认倒霉。'},
    ],
    wangShuCook: [
      {text: '你做的是金丝虾球，吸引了刻晴的注意。', item: ['KeQingThink'], thing: 'exp', amout: 1},
      {text: '你做的是杏仁豆腐，吸引了魈的注意。', item: ['XiaoThink'], thing: 'exp', amout: 1},
      {text: '你做的是仙跳墙，但是你水平太菜搞砸了，赔了不少材料钱。', thing: 'mora', amount: -20000},
    ],
    waterIsGood: [
      {text: '你喝到的是圣水，你觉得你现在充满了力量。', func:()=>{this.refineAttr.str+=1;}},
    ],
    meetKaiYa: [
      {text: '因为你是异乡人，他对你很感兴趣。', thing: 'exp', amount: 1},
      {banned: new Date().getDay() !== 4, text: '他说今天是疯狂星期四，希望你v他50吃顿好的。', thing: 'mora', amount: -50},
      {banned: new Date().getDay() !== 4, text: '他说今天是疯狂星期四，想v你50吃顿好的。', thing: 'mora', amount: 50},
    ],
    meetAiLin: [
      {text: '支线制作中...'}, //todo
      //{text: '你只是随意用了一个技能，'}, //todo 学习各个技能..
    ],
    meetDoveV1: [
      {text: '你使出风元素之力，把它们打成了禽肉。', thing: 'exp', amount: 1},
      {text: '你想把它们打成禽肉，但是它们全都飞走了。'},
      {text: ['你使出风元素之力，把它们打成了禽肉，',
              '然后提米出现了，',
              '他说鸽子是朋友，你居然把它们杀了，'], thing: 'exp', amount: 1, next: 'meetTiMi'},
    ],
    meetTiMi: [
      {text: '他朝你不停哭诉，然后你好好地安慰了他。', priority: 200},
      {text: ['你正想解释，结果他突然露出真面目，其实他是愚人众执行官首席「公鸡」。',
              '他说鸽子的死值得你足足死去1000次为之缅怀悼念，',
              '你，死了。'], priority: 20, key: 'finish'},
      {text: '你正想解释，载着他的独眼小宝突然对你发起攻击，', key: 'check', check: this.refineAttr.agi > lodash.random(5, 10), checkSucc: 'avoidTiMiAttackSucc', checkFail: 'avoidTiMiAttackFail'},
    ],
    avoidTiMiAttackSucc: [
      {text: '你反应及时并躲开了攻击，一场战斗在所难免——', key: 'check', check: this.refineAttr.str > lodash.random(6, 10), checkSucc: 'fightTiMiAttackSucc', checkFail: 'fightTiMiAttackFail'},
    ],
    avoidTiMiAttackFail: [
      {text: '你没能躲开，死的不明不白。', key: 'finish'},
    ],
    fightTiMiAttackSucc: [
      {text: '支线制作中...'}, //todo
    ],
    fightTiMiAttackFail: [
      {text: '支线制作中...'}, //todo
    ],
    meetFatui: [
      {text: '大路朝天，各走一边，你们打了个照面就走开了。'},
      {text: '你觉得你可以，然后冲了上去，但是你被打趴了。', thing: 'exp', amount: -2},
      {text: '你觉得你可以，然后冲了上去，没想到你真打赢了。', thing: 'exp', amount: 2},
    ],
    patchMushroom: [
      {text: `你觉得它是${lodash.sample(['浮游水','伸缩岩','旋转雷','伸缩火','伸缩风','浮游草','旋转冰'])}蕈兽，`, next: 'patchMushroomStep1'},
    ],
    patchMushroomStep1: [
      {text: '觉得它太可爱了没忍心欺负它。'},
      {text: '把它打成了蘑菇孢子。', thing: 'exp', amount: 1},
      {text: '打跑了一只，引来了一群，这次跑的是你。', thing: 'exp', amount: 1},
      {text: ['你以为是蕈兽，实际上你看错了，他是飘浮灵，',
              '你被打跑了。']},
      {text: ['你以为是蕈兽，实际上你看错了，他是飘浮灵，',
              '它嚣张的眼神让你很生气，你跟它干了一架，'], next: 'fightWithPiaoFuLing'},
    ],
    fightWithPiaoFuLing: [
      {text: '很抱歉你没打过。'},
      {text: '你干掉了它，正当你松口气的时候，它突然爆炸把你炸晕了。', thing: 'exp', amount: 1},
      {text: '你用体重优势把它从空中扯下，戳爆了它。', thing: 'exp', amount: 3},
    ],
    goMingShenSucc: [
      //todo 非重复获得判断
      {text: '欣赏樱花的途中，八重宫司认出了你手中的面具，她感慨颇深，并愿折下狐枝随你同行。', key: 'role', role: '八重神子'}, //todo deleteItem: [] 是否可重复做
    ],
    goMingShenFail: [
      {text: '欣赏了神社内的樱花，觉得心情愉悦。'},
    ],
    meetLanNaRaSucc: [
      {text: '因为你是小孩子，醒来后你居然看见一棵蔬菜给你准备了不少水果。支线制作中...'},
    ],
    meetLanNaRaFail: [
      {text: '结果睡过了头，醒来天已经很晚了。'},
    ],
    meetGoldenParty: [
      {text: '觉得他们人太多，自己可能不是对手，走开了。'},
      {text: '见到了正在跳舞的沙中净水，一时看入迷了，结果被人发现从后面击中了后脑勺，晕了过去，', next: 'beKnockedOff'},
    ],
    beKnockedOff: [
      {text: '晕倒后，你被灌下了神秘药水，身体变成了小孩子的模样！', item: ['ChildBody']},
      {text: '晕倒后，你被送去了博士「Dottore」的研究所，寄。', key: 'finish'},
    ],
    northBankSucc: [
      {text: '找到服务员交还了贵宾卡。', priority: 300},
      {text: '进入了银行，意外找到了储藏室中的摩拉箱。', thing: 'mora', amount: 200000},
    ],
    northBankFail: [
      {text: '因为没有贵宾卡，只能走开了。'},
      {text: '妄想进入银行，被管理人发现并揍了一顿。', key: 'finish'},
      {text: '使用荒星卡bug卡进了银行，', next: 'northBankSucc'},
    ],
    tartagliaStep0: [
      {text: '他看你只是个小孩子，对你没兴趣，把你赶走了。'},
      {text: '他看你是个小孩子，觉得你很可爱，给了你一些摩拉买玩具。', thing: 'mora', amount: 100000},
    ],
    tartagliaStep1: [
      {text: '他二话不说就跟你开打，你被暴揍了一顿。'},
      {text: '他二话不说就跟你开打，结果被你几下制服，开启了二阶段，', next: 'tartagliaStep2'},
      {text: '他二话不说就跟你开打，被你压制后想使用大鲸鱼，结果鲸鱼今天休假了用不出来，被打进了二阶段，', next: 'tartagliaStep2'},
    ],
    tartagliaStep2: [
      {text: '他使用雷元素力后迅捷的动作让你反应不及，你被暴揍了一顿。', thing: 'exp', amount: 3},
      {text: '他使用雷元素力后仍被你压制，愤怒之下开启了魔王武装，', next: 'tartagliaStep3'},
      {text: '他使用雷元素力后因为速度过快撞到了墙，为了掩饰尴尬开启了魔王武装', next: 'tartagliaStep3'},
    ],
    tartagliaStep3: [
      {text: '魔王武装后的达达利亚过于恐怖，你被暴揍了一顿。', thing: 'exp', amount: 5},
      {text: '你自沉着应对，矫健的身姿游走于电光水隙之间，最终把他打成了地脉花，你获得了丰富的奖励。', thing: 'primogem', amount: 100},
    ],
    catchCrystalButterfly: [
      {text: '可惜它飞太高了你够不着。'},
      {text: '最终被你抓到了。', thing: 'strength', amount: 20},
    ],
    naXiDaSucc: [
      {text: '但是你水喝多了尿急没有理她，而是直接冲向了厕所，出来后发现她在等你，她说她叫纳西妲，并帮你解开了罐装知识的秘密，你得到了亮闪闪的东西。', thing: 'primogem', amount: 300},
    ],
    naXiDaFail: [
      {text: '但是你并不认识？？？'},
    ],
    helpWitch: [
      {text: '她说她叫八重神子，她带面具只是觉得好玩。', priority: 300},
      {text: '她说她叫博丽灵梦，不好意思走错片场了。', priority: 300},
      {banned: ['FoxMask'], text: '她说她叫花散里，希望你能帮她祓除神樱的污秽，', key: 'check', priority: 100,
       check: ['KazariGanTian', 'KazariShenShe', 'KazariWuBaiZang', 'KazariHuangHai', 'KazariSheFengXing'], checkSucc: 'kazariLineFin', checkFail: 'kazariLine'},
      {text: '她说她叫阿祇，希望你能帮她举行千灯的仪式，支线制作中...'},
      {text: '她说她叫久岐忍，希望你能帮她摆脱家庭束缚，支线制作中...'},
    ],
    kazariLine: [
      {banned: ['KazariGanTian'], text: '来到绀田村，获得绀田村长的情报，祓去了村下神樱枝条的污秽。', item: ['KazariGanTian'], saveItem: true, thing: 'primogem', amount: 50},
      {banned: ['KazariShenShe'], text: '来到废弃神社，得到巫女影子的帮助，祓去了山下神樱枝条的污秽。', item: ['KazariShenShe'], saveItem: true, thing: 'primogem', amount: 50},
      {banned: ['KazariWuBaiZang'], text: '来到镇守之森，得到五百藏的指引，祓去了隐藏在山中神樱枝条的污秽。', item: ['KazariWuBaiZang'], saveItem: true, thing: 'primogem', amount: 50},
      {banned: ['KazariHuangHai'], text: '来到荒海，历经千辛万苦，祓去了海底深处神樱枝条的污秽。', item: ['KazariHuangHai'], saveItem: true, thing: 'primogem', amount: 50},
      {banned: ['KazariSheFengXing'], text: '来到社奉行，得到了神里绫华的帮助，祓去了社奉行山下神樱枝条的污秽。', item: ['KazariSheFengXing'], saveItem: true, thing: 'primogem', amount: 50},
    ],
    kazariLineFin: [
      {text: ['你成功解决了5处污秽，花散里告诉你该进行最后的大祓了，',
              '一番恶战过后，你成功消灭了恶瘴，但是面具巫女她自己......',
              '你得到了珍稀物品「狐狸面具」。'], item: ['FoxMask'], saveItem: true},
    ],
    go500Ago: [
      {text: '原来这是一个梦。', priority: 900},
      {text: '支线制作中...'},
    ]
  },

  num: 0,               //步骤值
  msgList: [],
  itemList: [],
  exploreSavedItem: [], //探索保存的长期道具
  gain: {},
  attr: {
    base: [5,5,5,5],
  },
  refineAttr: {},
  gainList: {
    mora: '摩拉',
    primogem: '原石',
    exploreExp: '探索经验',
    strength: '体力',
    exp: '额外探索经验',
  },

  exploreLv: 0,

  async start(id){
    //初始化数据
    this.msgList = [];
    this.itemList = [];
    this.gain = {
      exploreExp: 0,
    };
    const exploreSave = await utils.getRedis(`ayaka:${id}:explore`, {});
    this.exploreSavedItem = await utils.getRedis(`ayaka:${id}:exploreSavedItem`, []);
    this.exploreLv = exploreSave?.exploreLv || 0;
    this.exploreExp = exploreSave?.exploreExp || 0;

    this.msgList.push(`当前探索等级: Lv${this.exploreLv}。`);

    for(let i = 0;i < this.exploreLv * 2; i++){
      const idx = Math.floor(Math.random() * 4);
      this.attr.base[idx] ++;
    }
    this.refineAttr = {
      str: this.attr.base[0],
      int: this.attr.base[1],
      agi: this.attr.base[2],
      luc: this.attr.base[3],
    }
    //初始化属性

    //事件执行
    await this.next(id);
    this.msgList.push('已结束。');
    this.msgList.push('============');
    this.msgList.push('当前为测试版本，内容扩充中，道具获取暂不计入真实收益。');

    let gainMsg = '本次探索获取：';
    for(let _key in this.gain){
      gainMsg += this.gainList[_key] + this.gain[_key] + '，';
    }
    gainMsg = gainMsg.slice(0, -1) + '。';

    this.msgList.push(gainMsg);

    //数据处理
    //todo this.gain数据保存
    console.log(this.gain);
    await utils.setRedis(`ayaka:${id}:exploreSavedItem`, this.exploreSavedItem);

    return this.msgList;
  },
  async next(id){

    this.num += Math.floor(Math.random() * 20) + 10;

    //todo
    // 1.事件lv6~8 探险等级5、7、9解锁


    const full = 100 + this.exploreLv * 10; //100~200
    const per = {
      lv1: .4, lv2: .7, lv3: .85, lv4: .95, lv5: 1
    };

    console.log(this.num, full * per.lv1, full);

    let eventLv = '';
    if(this.num < full * per.lv1){
      eventLv = 'lv1';
      this.gain.exploreExp += utils.config.explore.expGain[0];
    }else if(this.num < full * per.lv2){
      eventLv = 'lv2';
      this.gain.exploreExp += utils.config.explore.expGain[1];
    }else if(this.num < full * per.lv3){
      eventLv = 'lv3';
      this.gain.exploreExp += utils.config.explore.expGain[2];
    }else if(this.num < full * per.lv4){
      eventLv = 'lv4';
      this.gain.exploreExp += utils.config.explore.expGain[3];
    }else if(this.num <= full * per.lv5){
      eventLv = 'lv5';
      this.gain.exploreExp += utils.config.explore.expGain[4];
    }else{
      //150~200 5级事件区间为7.5~10
      //6级事件固定区间4, 7级事件固定区间2, 8级事件固定区间1
      if(this.exploreLv >= 5 && this.num <= full + 4){
        eventLv = 'lv6';
        this.gain.exploreExp += utils.config.explore.expGain[5];
      }else if(this.exploreLv >= 7 && this.num <= full + 6){
        eventLv = 'lv7';
        this.gain.exploreExp += utils.config.explore.expGain[6];
      }else if(this.exploreLv >= 9 && this.num <= full + 7){
        eventLv = 'lv8';
        this.gain.exploreExp += utils.config.explore.expGain[7];
      }else{
        return this.msgList;
      }
    }

    let finish = false;
    const event = this.sample(this.event[eventLv]);

    const func = async (event) => {
      if(event.text){
        this.msgList = this.msgList.concat(event.text);
      }
      if(event?.thing){
        this.gain[event.thing] = (this.gain?.[event.thing] || 0) + event.amount;
      }
      if(event?.item?.length > 0){
        this.itemList = lodash.uniq(this.itemList.concat(event.item));
      }
      if(event?.saveItem){
        //todo saveItem --> []
        this.exploreSavedItem = lodash.uniq(this.exploreSavedItem.concat(event.item));
      }
      if(event?.deleteItem){
        _.pullAll(this.exploreSavedItem, event.deleteItem);
      }
      if(event?.func){
        event.func();
      }
      if(event?.next){
        const newEventList = this.check[event.next];
        return await func(this.sample(newEventList));
      }
      if(event?.key === 'finish'){
        finish = true;
      }
      
      if(event.key === 'check'){
        if(event.check === true){
          const newEventList = this.check[event.checkSucc];
          await func(this.sample(newEventList));
        }else if(event.check === false && event.checkFail){
          const newEventList = this.check[event.checkFail];
          await func(this.sample(newEventList));
        }else{
          let flag = true;
          const allList = this.getAllItemList();
          event.check.forEach(res => {
            if(!allList.includes(res)) flag = false;
          });
          const newEventList = flag ? this.check[event.checkSucc] : this.check[event.checkFail];
          await func(this.sample(newEventList));
        }
      }else if(event.key === 'role'){
        //todo event.role = '八重神子'

      }else{

      }
    }

    await func(event);

    if(finish){
      this.msgList.push('探索中断。');
      return this.msgList;
    }else{
      await this.next(id);
    }
  },

  sample(eventArr){
    const allList = this.getAllItemList();
    //过滤bannedArr后的eventList
    const purifyArr = eventArr.filter(res => {
      //banned = true 将被过滤
      if(res?.banned !== true){
        //banned = ['xx1', 'xx2', ...]  且 道具中存在 xx1 || xx2 || ...  任一项将被过滤
        if(!res?.banned || res?.banned.filter(rr=>allList.includes(rr)).length === 0){
          return res;
        }
      }
    });
    
    const priorityArr = purifyArr.map(res => res?.priority || 100);
    const full = priorityArr.reduce((sum, now) => sum + now, 0);
    const drop = Math.floor(Math.random() * full);
    let chooseIdx = 0;
    purifyArr.reduce((sum, now, idx) => {
      if(sum - drop < 0){
        chooseIdx = idx;
      }
      return sum + (now?.priority || 100);
    }, 0);
    return purifyArr[chooseIdx];
  },
  
  getAllItemList(){
    const itemList = lodash.cloneDeep(this.itemList);
    const saveList = lodash.cloneDeep(this.exploreSavedItem);
    return lodash.uniq(itemList.concat(saveList));
  }
}
