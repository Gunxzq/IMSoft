# 架构

模块之间要减少依赖，模块只要关心自己的事情。即可能的去依赖事件发布器，而不是具体的模块。

## 状态管理

### 公共部分

store 可以通过导入 **WebSocketService** 实例，来监听或关闭需要的事件

## **connection**

管理连接：连接重试、连接状态、建立连接、断开连接。

## **users**

管理用户。

### **message**

管理消息

## utils

### **WebSocketService**

封装 ==websocket==，避免暴露 socket 的底层接口。

提供监听事件和关闭事件的封装，并管理这些事件。

导出 WebSocketService 类的实例
