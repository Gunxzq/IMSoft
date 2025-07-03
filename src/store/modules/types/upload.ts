export interface UploadFile {
  id: string;
  originalFile: File;
  originalUrl: string;
  originalSize: number;
  thumbnails?: Thumbnail[];
  originalAspectRatio?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

// 缩略图
export interface Thumbnail {
  size: { width: number; height: number };
  blob: Blob;
  url: string;
  base64?: string;
  actualSize: { width: number; height: number };
}
