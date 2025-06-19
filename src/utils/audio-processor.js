// public/audio-processor.js
class VoskAudioProcessor extends AudioWorkletProcessor {
  // 允许的输入输出通道数（单声道输入）
  static get parameterDescriptors() {
    return [{
      name: 'audio',
      defaultValue: 0,
      minValue: -1,
      maxValue: 1,
      automationRate: 'k-rate'
    }];
  }

  constructor() {
    super();
    // 通过 port 与主线程通信（可选，若需传递控制指令）
    this.port.onmessage = (e) => {
      // 可接收来自主线程的控制信号（如开始/停止）
    };
  }

  // 核心：处理音频帧（每帧约 10-20ms）
  process(inputs, outputs, parameters) {
    // inputs 是输入音频轨道数组（单声道）
    const input = inputs[0];
    if (!input) return true; // 无输入时跳过

    // 获取单声道音频数据（Float32Array 格式）
    const audioData = input[0]; 
    
    // 将音频数据传递给主线程的识别器（通过 postMessage）
    // 注意：Vosk 的 acceptWaveform 需要 Float32Array 或 Int16Array 格式
    this.port.postMessage({
      type: 'audio-frame',
      data: audioData
    });

    // 输出空数据（避免音频路由错误）
    outputs.forEach(output => {
      output.forEach(channel => {
        channel.fill(0);
      });
    });

    return true; // 返回 true 表示继续处理
  }
}

// 注册处理器（名称需与主线程中加载时一致）
registerProcessor('vosk-processor', VoskAudioProcessor);