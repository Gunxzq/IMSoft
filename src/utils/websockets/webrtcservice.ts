import { ref, useAttrs } from 'vue';
import WebSocketServiceIstance from './websokcet';

export class WebRTCService {
  private peerConnection: RTCPeerConnection;

  //本地流
  private localStream = ref<MediaStream | null>(null);
  // 远程流,可能是多个
  private remoteStream = ref<MediaStream[] | null>(null);
  constructor() {
    this.peerConnection = new RTCPeerConnection();
    this.initLocalStream();
  }

  get localVideo() {
    return this.localStream;
  }

  //初始化媒体流
  private async initLocalStream() {
    try {
      let localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      this.localStream.value = localStream;
    } catch (error) {
      console.error(error);
    }
  }

  //   开始通话
  public async startCall() {
    try {
      this.localStream?.value?.getTracks().forEach(track => {
        // 将视频轨道添加到 WebRTC 连接
        if (this.localStream.value) this.peerConnection.addTrack(track, this.localStream.value);
      });
    } catch (error) {
      console.error('Error accessing media devices:', error);
    }
  }

  //   结束通话
  endCall() {
    this.peerConnection.close();
    // getTracks返回所有轨道的数组(音频、视频轨道)
    // track.stop停止每个轨道的采集
    this.localStream.value?.getTracks().forEach(track => track.stop());
    // if (localVideo.value) localVideo.value.srcObject = null;
  }
  /**
   * 监听用户加入
   * @param data 服务器需要的信息
   */
  onUserJoin(data: any) {
    WebSocketServiceIstance.onEvent('user-connected', userId => {
      console.log('User connected:', userId);
      this.createOffer(data);
    });
  }
  /**
   * 加入房间
   * @param data
   */
  joinRoom(data: any) {
    try {
      // 加入房间
      WebSocketServiceIstance.emitEvent('join-room', data);
    } catch (error) {}
  }
  // 创建 Offer
  async createOffer(data: any) {
    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offer);

    let offerData = Object.assign(data, offer);
    // 触发
    WebSocketServiceIstance.emitEvent('offer', offerData);
  }

  /**
   * 监听offer
   */
  async onOffer(data: any) {
    try {
      // 创建 answer
      WebSocketServiceIstance.onEvent('offer', async () => {
        await this.peerConnection.setRemoteDescription(new RTCSessionDescription(data));
        const answer = await this.peerConnection.createAnswer();
        await this.peerConnection.setLocalDescription(answer);
        // 触发
        WebSocketServiceIstance.emitEvent('answer', answer);
      });
    } catch (error) {}
  }
}
