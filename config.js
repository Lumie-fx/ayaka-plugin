export default {
  ver: '1.2',          //ayaka plugin version
  useAyakaMenu: true,  //启动ayaka菜单覆盖yunzai原有菜单
  useAyakaGacha: true, //启用ayaka抽卡覆盖yunzai抽卡功能
  useAyakaAi: true,    //启动ayaka智障ai覆盖
  useAyakaCharacterVoice: true, //开启角色语音功能, 需要ffmpeg
  useAyakaGachaSchedule: true, //启动自动推送群内抽卡统计, useAyakaGacha===true必须
  useAyakaPretend: true,//启动主人伪装聊天 ==> 主人设置伪装群号, 对机器人私聊, 机器人会对群内发言相同内容
}