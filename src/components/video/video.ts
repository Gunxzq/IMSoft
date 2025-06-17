import { ref, onMounted } from 'vue';
import { io } from 'socket.io-client';

const useVideo = () => {
  const join = () => {
    socket.emit('join-room', {
      roomId: 'room1',
      userId: new Date().getTime().toString(),
    });
  };

  const localVideo = ref<HTMLVideoElement>();
  const remoteVideo = ref<HTMLVideoElement>();
  const socket = io('http://localhost:3000');
  // 媒体流对象(包含摄像头、麦克风)
  const localStream = ref<MediaStream>();
  const peerConnection = new RTCPeerConnection();

  // 处理 ICE 候选
  peerConnection.onicecandidate = event => {
    if (event.candidate) {
      socket.emit('ice-candidate', {
        roomId: 'room1',
        candidate: event.candidate,
      });
    }
  };

  // 处理远程媒体流
  peerConnection.ontrack = event => {
    remoteVideo.value!.srcObject = event.streams[0];
  };

  // 处理 Socket 事件
  socket.on('user-connected', userId => {
    console.log('User connected:', userId);
    createOffer();
  });

  socket.on('offer', async data => {
    await peerConnection.setRemoteDescription(new RTCSessionDescription(data.sdp));
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    // 发送 answer
    socket.emit('answer', {
      roomId: 'room1',
      answer: answer,
    });
  });

  socket.on('answer', async data => {
    await peerConnection.setRemoteDescription(new RTCSessionDescription(data.sdp));
  });

  socket.on('ice-candidate', async data => {
    try {
      await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
    } catch (e) {
      console.error('Error adding ICE candidate:', e);
    }
  });

  // 创建 Offer
  async function createOffer() {
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    // 触发
    socket.emit('offer', {
      roomId: 'room1',
      offer: offer,
    });
  }

  // 开始通话
  async function startCall() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localStream.value = stream;
      // 媒体标签
      localVideo.value!.srcObject = stream;
      // 将视频轨道添加到 WebRTC 连接
      peerConnection.addTrack(stream.getTracks()[0], stream);
    } catch (error) {
      console.log('无法访问媒体设备', error);
    }
  }

  // 结束通话
  function endCall() {
    peerConnection.close();
    // getTracks返回所有轨道的数组(音频、视频轨道)
    // track.stop停止每个轨道的采集
    localStream.value?.getTracks().forEach(track => track.stop());
    if (localVideo.value) localVideo.value.srcObject = null;
  }
};

export default useVideo;
