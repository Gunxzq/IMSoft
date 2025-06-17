# 目录结构

## utils

各种工具函数和封装：

1. 从本地获取 token：token
2. 状态管理有关的存储方法：localStorage
3. 各种工具函数：token.ts
4. websockt 封装：包含 websocket 和视频通话，以及 websocket 中间件

## componets

存放通用组件，在每个文件夹下有一个 type.ts 声明类型，和一个 test 文件用于示意组件的使用，将其复制到 app.vue 来测试

### message

对应各种消息类型的组件：

1. 文件
2. 图片
3. 链接
4. 位置
5. 文本
6. 视频
7. 语音

### video

视频通话组件

### virtualList

通用型虚拟列表组件

## store

状态管理，有如下的状态管理仓库：

1. connection(连接状态管理)
2. message(消息状态管理)
3. contacts(联系人状态管理)
4. group(群组状态管理)
5. userInfo(用户状态管理)
6. users(聊天对象状态管理)
