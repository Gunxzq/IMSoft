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
