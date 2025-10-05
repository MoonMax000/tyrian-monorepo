export const getBrightColorFromString = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const hue = Math.abs(hash) % 360;

  const saturation = 90;
  const lightness = 60;

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};
