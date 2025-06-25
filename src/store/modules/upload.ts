import { defineStore } from 'pinia';
import { reactive } from 'vue';
import Compressor from 'compressorjs';
import type { UploadFile, Thumbnail } from './types/upload';
import { generateMessageId } from '../../utils/tool';

const thumbnailSizes = [
  { name: '小', width: 150, height: 0 },
  { name: '中', width: 300, height: 0 },
  { name: '大', width: 600, height: 0 },
];

export const useUploadStore = defineStore('upload', () => {
  const fileList = reactive<Map<string, UploadFile[]>>(new Map());
  const compressQuality = 0.8;

  function addFiles(rawFiles: File[], key: string) {
    console.log('addFiles', rawFiles);
    //
    if (!fileList.has(key)) {
      fileList.set(key, []);
    }
    rawFiles.forEach(file => {
      const list = fileList.get(key) as UploadFile[];
      // const existing = list.find(f => f.originalFile.name === file.name && f.originalFile.size === file.size);
      // if (!existing) {
      list.push({
        id: generateMessageId(),
        originalFile: file,
        originalUrl: URL.createObjectURL(file),
        originalSize: file.size,
        status: 'pending',
      });
      // }
    });
  }

  async function processFile(file: UploadFile, key: string) {
    let list = fileList.get(key) as UploadFile[];
    const index = list.findIndex(f => f.id === file.id);
    if (index === -1 || file.status !== 'pending') return;
    list[index].status = 'processing';

    try {
      const imgBitmap = await createImageBitmap(file.originalFile);
      const width = imgBitmap.width;
      const height = imgBitmap.height;
      imgBitmap.close();
      console.log('width', width, 'height', height);
      // 压缩图片
      const thumbnails = await Promise.all(
        thumbnailSizes.map(async size => {
          console.log('size', size);
          return new Promise<Thumbnail>(resolve => {
            new Compressor(file.originalFile, {
              quality: compressQuality,
              width: size.width,
              height: size.height,
              mimeType: 'image/webp',
              async success(compressedBlob) {
                const imgBitmap = await createImageBitmap(compressedBlob);
                const width = imgBitmap.width;
                const height = imgBitmap.height;
                imgBitmap.close();

                // base64
                const base64 = await new Promise<string>((resolve, reject) => {
                  try {
                    const reader = new FileReader();
                    reader.onerror = reject;
                    reader.readAsDataURL(compressedBlob); // 读取 Blob 为 Data URL
                    reader.onload = () => {
                      // 读取结果是 Data URL（格式："data:image/png;base64,xxx"），截取纯 Base64 部分
                      const dataURL = reader.result as string;
                      resolve(dataURL);
                    };
                  } catch (error) {
                    console.log(error);
                  }
                });
                // console.log(base64);
                resolve({
                  size,
                  blob: compressedBlob,
                  url: URL.createObjectURL(compressedBlob),
                  base64: base64,
                  actualSize: { width, height }, // 实际宽高可选
                });
              },
              error() {
                resolve({
                  size,
                  blob: file.originalFile.slice(0),
                  url: file.originalUrl,
                  actualSize: { width, height },
                });
              },
            });
          });
        }),
      );
      console.log('list', thumbnails);
      list[index].thumbnails = thumbnails;
      list[index].originalAspectRatio = (width / height).toFixed(2);
      list[index].status = 'completed';

      return thumbnails;
    } catch (err) {
      console.error('压缩失败:', err);
      list[index].status = 'failed';
    }
  }

  async function startProcessing(key: string, callback: (...args: any[]) => void) {
    if (fileList.has(key)) {
      let list = fileList.get(key) as UploadFile[];
      for (const file of list.filter(f => f.status === 'pending')) {
        let data = await processFile(file, key);
        console.log('处理文件:');
        // 发送消息
        callback(data);
      }
    } else {
      console.warn('没有文件可以处理');
    }
  }

  function clearFiles(key: string) {
    if (fileList.has(key)) {
      let list = fileList.get(key) as UploadFile[];
      list.forEach(file => {
        if (file.originalUrl) URL.revokeObjectURL(file.originalUrl);
        if (file.thumbnails) {
          file.thumbnails.forEach(t => {
            if (t.url) URL.revokeObjectURL(t.url);
          });
        }
      });
      list = [];
    }
  }

  return {
    fileList,
    addFiles,
    startProcessing,
    clearFiles,
  };
});
