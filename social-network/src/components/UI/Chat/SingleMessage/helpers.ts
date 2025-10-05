import { Group } from '@/app/data';

export const motionVariants = {
  initial: { opacity: 0, scale: 1, y: 50, x: 0 },
  animate: { opacity: 1, scale: 1, y: 0, x: 0 },
  exit: { opacity: 0, scale: 1, y: 1, x: 0 },
};

export const motionTransition = (index: number) => ({
  opacity: { duration: 0.1 },
  layout: { type: 'spring' as const, bounce: 0.3, duration: index * 0.01 + 0.1 },
});

export const getCurrentGroup = (
  chatId: string,
  currentChatType: 'group' | 'user',
  groups: Group[],
) => {
  if (currentChatType === 'group' && chatId !== null) {
    return groups.find((g) => g.id === Number(chatId)) ?? null;
  }
  return null;
};
