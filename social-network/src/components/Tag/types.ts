export type TagType = 'ideas' | 'videos' | 'opinions' | 'analytics' | 'softwares';

export interface TagProps {
  type: TagType;
  className?: string;
}
