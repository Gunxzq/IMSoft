import { MessageType } from '../../store/modules/types/message';

export interface MessageDetail {
  id: string;
  type: MessageType;
  content: string;
  time: string;
  isSelf: boolean;
  userId: string;
}

export interface ImageMessage extends MessageDetail {
  imageUrl: string;
  // 缩略图
  previewUrl?: string;
  downloadStatus: 'idle' | 'downloading' | 'downloaded' | 'failed';
  progress?: number;
}

export interface FileMessage extends MessageDetail {
  fileName: string;
  fileSize: string;
  fileUrl: string;
  typeIcon: string;
  previewUrl?: string;
  downloadStatus: 'idle' | 'downloading' | 'downloaded' | 'failed';
  progress?: number;
}

export interface VoiceMessage extends MessageDetail {
  url: string; // 语音文件URL
  duration: number; // 时长（秒）
  // waveformData?: string; // 语音波形数据（Base64编码的SVG路径，可选）
  playStatus: 'idle' | 'playing' | 'played'; // 播放状态
}

// 视频消息类型（扩展自基础消息）
export interface VideoMessage extends MessageDetail {
  url: string; // 视频文件URL
  coverUrl?: string; // 封面图URL（可选，未提供时截取视频首帧）
  duration: number; // 时长（秒）
  playStatus: 'idle' | 'playing' | 'paused' | 'loaded' | 'error' | 'loading'; // 播放状态
  currentTime: number; // 当前播放进度（秒，仅playing时有效）
}
