export const clampValue = (v: number, max: number) => Math.min(Math.max(v, 0), max);

export const fillFor = (starIndex: number, ratingValue: number) => {
  const diff = ratingValue - starIndex;
  if (diff >= 1) return 100;
  if (diff <= 0) return 0;
  return Math.round(diff * 100);
};

export const pickByPointer = (e: React.MouseEvent<HTMLButtonElement>, starIndex: number) => {
  const rect = e.currentTarget.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const isHalf = x < rect.width / 2;
  return starIndex + (isHalf ? 0.5 : 1);
};
