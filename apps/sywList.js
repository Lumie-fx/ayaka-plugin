import { segment } from "oicq";
import lodash from "lodash";
import fs from "fs";
import { render } from "../adapter/render.js";

//创建html文件夹
// if (!fs.existsSync(`./data/html/genshin/sywList/`)) {
//   fs.mkdirSync(`./data/html/genshin/sywList/`);
// }

let sywConfig = {};

//await sywList.init();

export class sywList extends plugin {
  constructor () {
    super({
      name: '查看圣遗物',
      dsc: '查看模拟抽取圣遗物',
      /** https://oicqjs.github.io/oicq/#events */
      event: 'message',
      priority: 100,
      rule: [{
        reg: "^查看(圣遗物)?$",
        fnc: 'sywList',
      }]
    })
  }

  async  init() {
    sywConfig = JSON.parse(fs.readFileSync(process.cwd()+"/plugins/ayaka-plugin/resources/meta/configs/syw.json", "utf8"));
  }

//查看
  async sywList(e){
    if (e.img || e.hasReply) {
      return;
    }
    const user_id = e.user_id; //qq
    const name = e.sender.card; //qq昵称

    const key = `genshin:syw:${user_id}`;
    let sywData = await global.redis.get(key);

    sywData = JSON.parse(sywData || '{}');

    if((!sywData.bag || sywData.bag.length === 0) && (!sywData.today || sywData.bag.today === 0)){
      return await e.reply([segment.at(e.user_id, name), ` 你的背包里没有圣遗物哦~`]);
    }

    if(!sywData.bag) sywData.bag = [];
    if(!sywData.today) sywData.today = [];

    sywData.bag.map(res=>{
      let _list = '';
      res.secondMini = res.secondArr.filter(_es=>{
        const mini = sywConfig.en2mini[_es.attr];
        if(mini) _list+=mini+'/';
      });
      res.secondMini = _list ? _list.slice(0,-1) : '';
    });

    sywData.today.map(res=>{
      let _list = '';
      res.secondArr.map(_es=>{
        const mini = sywConfig.en2mini[_es.attr];
        if(mini) _list+=mini+'/';
      });
      res.secondMini = _list ? _list.slice(0,-1) : '';
    });


    let base64 = await render("pages", "sywList", {
      save_id: user_id,
      name: name,
      bag: sywData.bag,
      today: sywData.today,
      todayIdxAdd: sywData.bag.length
    });

    if (base64) {
      //let msg = segment.image(`base64://${base64}`);
      let msgRes = await e.reply(base64);
    }

    return true;

  }
}