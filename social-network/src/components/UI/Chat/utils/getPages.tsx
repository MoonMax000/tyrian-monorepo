export const getPages = (currentPage: number, count: number, totalPages: number): number[] => {
  if (totalPages <= 0 || count <= 0) return [];
  if (currentPage < 1) currentPage = 1;
  if (currentPage > totalPages) currentPage = totalPages;

  if (totalPages <= count) {
    return [...new Array(totalPages)].map((_, index) => index + 1);
  }

  const halfCount = Math.floor(count / 2);
  let start = Math.max(1, currentPage - halfCount);
  const end = Math.min(totalPages, start + count - 1);

  if (end - start + 1 < count) {
    start = Math.max(1, end - count + 1);
  }

  return [...new Array(end - start + 1)].map((_, index) => start + index);
};