export const InputType = {
  TEXT: 'text',
  IMAGE: 'image',
  VOICE: 'voice',
  VIDEO: 'video',
  FILE: 'file',
  LOCATION: 'location',
  LINK: 'link',
} as const;

export type MessageType = (typeof InputType)[keyof typeof InputType];

// 压缩图片
export interface CompressedFile {
  originalFile: File;
  originalUrl: string;
  originalSize: number;
  thumbnails?: thumbnail[];

  originalAspectRatio?: number | string;
}

export type thumbnail = {
  size: { name: string; width: number; height: number };
  blob: Blob;
  url: string;
  actualSize: { width: number; height: number };
};
