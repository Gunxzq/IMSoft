import { pinyin } from 'pinyin-pro';

/**
 * 用于生成会话key
 * @param a 发送者
 * @param b 接收者
 * @returns 返回生成的key
 */
export function getAggregationKey(a: string, b: string): string {
  // 通过排序确保，发送方和接收方对调的情况下，key是相同的
  return [a, b].sort().join('-');
}

// 生成群聊key
export function getGroupKey(a: string): string {
  return 'group:' + a;
}

// 获取key,可以区分群聊和私聊
export function getKey(participants: string[]): string {
  // 对于群聊，participants的第一项为群ID
  // getAggregationKey是无视顺序的
  return isGroupId(participants[0]) ? getGroupKey(participants[0]) : getAggregationKey(participants[0], participants[1]);
}

// 是否为群id
export function isGroupId(id: string): boolean {
  return id.startsWith('group:');
}

// 解构群id
export function getGroupId(key: string): string {
  return key.split(':')[1];
}

// 日期格式化
export const formatTime = (timestamp: number) => {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * 解析消息的 content 字符串，提取各字段
 * @param {string} content - 拼接后的消息内容（格式如：'fileName:xxx$fileSize:xxx$...'）
 * @returns {Object} 解析后的字段对象（键为字段名，值为对应内容）
 */
export function parseMessageContent(content: string) {
  // 分割字段（按 $ 分割）
  const contentStrings = content.split('$');
  const result: { [key: string]: any } = {};

  for (const fieldStr of contentStrings) {
    // 跳过空字段（如 content 末尾多余的 $ 导致的空字符串）
    if (!fieldStr) continue;

    // console.log('fieldStr', fieldStr);
    // 分割键值对（按 : 分割，最多分割为两部分，避免值中包含 :）
    const [key, value] = fieldStr.split('==', 2);

    // 过滤无效键值对（键或值为空）
    if (key && value !== undefined) {
      result[key] = value;
    }
  }

  return result;
}

/**
 * 获取姓名的首字母（支持中文、英文、其他语言）
 * @param {string} name 姓名（如："张三"、"Alice"、"山田太郎"）
 * @returns {string} 首字母（如："Z"、"A"、"#"）
 */
export function getFirstLetter(name: string) {
  if (!name || typeof name !== 'string') return '#';

  // 去除首尾空格
  const trimmedName = name.trim();
  if (trimmedName.length === 0) return '#';

  // 提取第一个有效字符（忽略空格、符号等）
  const firstChar = trimmedName.charAt(0);

  // 1. 中文：获取拼音首字母（如："张" → "Z"）
  if (/[\u4e00-\u9fa5]/.test(firstChar)) {
    return pinyin(firstChar, { toneType: 'none' }); // 不带声调
  }

  // 2. 英文：直接取首字母大写（如："alice" → "A"）
  if (/^[a-zA-Z]$/.test(firstChar)) {
    return firstChar.toUpperCase();
  }

  // 3. 其他语言（非拉丁字母）：归为 # 组（如：日文"たろう"、阿拉伯文"محمد"）
  return '#';
}

// 将date转为时间戳
export function dateToTimestamp(date: Date): number {
  return date.getTime();
}

export function generateMessageId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
}

// blob转base64
export function blobToBase64(blob: Blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as String); // 去掉 data URL 的前缀
    reader.onerror = error => reject(error);
    reader.readAsDataURL(blob);
  });
}
