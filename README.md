# master分支进行3.0版本适配和功能迁移。


# ayaka-plugin
yunzai-bot组件，ayaka

# 此分支只支持2.0！


# 使用注意
config.js内置2个开关, 覆盖原有菜单, 覆盖原有抽卡

1.未集成喵喵插件的不推荐打开菜单覆盖

2.覆盖原有抽卡需要打开才能查询到角色仓库

3.语音功能需要安装以下包、并配置ffmpeg环境变量
npm install fluent-ffmpeg --save
npm install mstts-js --save
