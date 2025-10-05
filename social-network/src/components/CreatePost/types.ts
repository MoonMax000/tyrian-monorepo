export type TopicName = 'idea' | 'video' | 'opinion' | 'analytics' | 'soft';
export interface Topic {
  id: number;
  name: TopicName;
  value: string;
  icon: React.ReactNode;
}

export type BlockType = 'text' | 'h2' | 'h3' | 'file' | 'code' | 'audio';

export interface Block {
  id: string;
  type: BlockType;
  content: any;
  order: number;
}

export type Direction = 'up' | 'down';
