import { CommentData } from '@/store/postsApi';

export const countComments = (comments?: CommentData[]): number => {
  if (!comments) return 0;
  let count = 0;
  const stack: CommentData[] = [...comments];

  while (stack.length) {
    const comment = stack.pop()!;
    count++;
    if (comment.children?.length) {
      stack.push(...comment.children);
    }
  }

  return count;
};
