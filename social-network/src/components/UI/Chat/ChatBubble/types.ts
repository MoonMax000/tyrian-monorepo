import { ButtonProps } from '@/components/shadcnui/button';
import { HTMLAttributes, ReactNode } from 'react';

export type Variant = 'received' | 'sent';
export type Layout = 'default' | 'ai';

export interface ChatBubbleProps extends HTMLAttributes<HTMLDivElement> {
  variant?: Variant;
  layout?: Layout;
  children?: ReactNode;
}

export interface ChatBubbleChildProps {
  variant?: Variant;
  layout?: Layout;
  [key: string]: unknown;
}

export interface ChatBubbleAvatarProps {
  variant?: Variant;
  layout?: Layout;
  src?: string;
  fallback?: string;
  className?: string;
}

export interface ChatBubbleMessageProps extends HTMLAttributes<HTMLDivElement> {
  isLoading?: boolean;
  hasText?: boolean;
  variant?: Variant;
  layout?: Layout;
}

export interface ChatBubbleTimestampProps extends HTMLAttributes<HTMLDivElement> {
  name?: string;
  timestamp: string;
  role?: string;
  subscription?: string;
  viewCount?: number;
  isCurrentUser?: boolean;
  isMessageRead?: boolean;
}

export type ChatBubbleActionProps = ButtonProps & {
  icon: ReactNode;
};

export interface ChatBubbleActionWrapperProps extends HTMLAttributes<HTMLDivElement> {
  variant?: Variant;
}
