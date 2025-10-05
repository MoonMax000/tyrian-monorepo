export const getPages = (pos: number, count: number, totalPages: number): number[] => {
  if (totalPages <= count) {
    return [...new Array(totalPages)].map((_, index) => index + 1);
  }

  const needTail = (count - 1) / 2;

  let tailLeft = needTail + 1;
  const tailRight = totalPages - pos;
  if (tailRight < needTail) {
    tailLeft += needTail - tailRight;
  }

  const startIndex = Math.max(1, pos - tailLeft + 1);

  return [...new Array(count)].map((_, index) => startIndex + index);
};
