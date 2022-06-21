import { segment } from "oicq";
import lodash from "lodash";
import fs from "fs";
import fetch from 'node-fetch'
import {parseString} from 'xml2js'
import ffmpeg from 'fluent-ffmpeg'

const _path = process.cwd();
const {roleId} = await import(`file://${_path}/config/genshin/roleId.js`);

if (!fs.existsSync(`./voice/`)) {
  fs.mkdirSync(`./voice/`);
}

export const rule = {
  //帮助说明
  ayakaVoice: {
    reg: "^#*(.*)语音$",
    priority: 200,
    describe: "【#帮助】查看指令说明",
  },
};


export async function ayakaVoice(e, {render}) {
  if (e.at && !e.atBot) {
    return;
  }

  const msg = e.msg.replace('语音', '');

  let voiceFlag = false;
  let charactorArr = null;
  for(let _key in roleId){
    const arr = roleId[_key]
    if(arr.includes(msg)){
      voiceFlag = true;
      charactorArr = arr;
    }
  }

  if(!voiceFlag) return;

  const character = charactorArr[0];

  const response = await fetch('https://wiki.biligame.com/ys/'+encodeURIComponent(character + '语音'));
  const text = await response.text();

  const matches = text.match(/<div class="bikit-audio".*?<\/div>/g).filter(res=>res.indexOf('patchwiki')>-1);
  if(matches.length === 0) return;

  const one = lodash.sample(matches);
  const url = urlReset(one);

  const response2 = await fetch(url);
  //res.test()，res.json()，res.blob()，res,arrayBuffer，res.buffer()
  const arrayBuffer = await response2.arrayBuffer();
  const vpath_end = './voice/'+msg+'语音.amr';
  const vpath = './voice/'+msg+'语音.mp3';

  fs.writeFileSync(vpath, Buffer.from(arrayBuffer));

  voiceChange(vpath, vpath_end).then(()=>{
    e.reply(segment.record(vpath_end));
  })

  return true;
}

function urlReset(str){
  const u = str.replace(/(.*)(patchwiki.*mp3)(.*)/, '$2');
  return 'https://' + u
}

function voiceChange(vpath, vpath_end){
  return new Promise((resolve ,reject) => {
    ffmpeg(vpath).format("avi").on('error', (err) => {
      // console.log('An error occurred: ' + err.message);
      reject()
    }).on('progress', (progress) => {
      console.log('Processing: ' + progress.targetSize + ' KB converted');
    }).on('end', () => {
      // console.log('Processing finished !');
      resolve();
    }).save(vpath_end);//path where you want to save your file
  })
}