export interface UploadFile {
  id: string;
  originalFile: File;
  originalUrl: string;
  originalSize: number;
  thumbnails?: Thumbnail[];
  originalAspectRatio?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

export interface Thumbnail {
  size: { width: number; height: number };
  blob: Blob;
  url: string;
  actualSize: { width: number; height: number };
}
