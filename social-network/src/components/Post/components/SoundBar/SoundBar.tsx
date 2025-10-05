import { FC, useEffect, useState } from 'react';

interface Props {
  isPlaying: boolean;
  barsCount?: number;
  maxHeight?: number;
  color?: string;
}

export const SoundBar: FC<Props> = ({
  isPlaying,
  barsCount = 7,
  maxHeight = 20,
  color = 'white',
}) => {
  const [heights, setHeights] = useState<number[]>(Array(barsCount).fill(maxHeight / 2));

  useEffect(() => {
    if (!isPlaying) {
      setHeights(Array(barsCount).fill(maxHeight / 3));
      return;
    }

    let animationFrame: number;
    let lastTime = 0;

    const animation = (time: number) => {
      if (time - lastTime > 100) {
        setHeights((prevHeights) =>
          prevHeights.reverse().map((_, i) => {
            const wave = Math.sin(time / 200 + i * 0.5) * (maxHeight / 2);
            return Math.max(2, maxHeight / 2 + wave);
          }),
        );
        lastTime = time;
      }
      animationFrame = requestAnimationFrame(animation);
    };

    animationFrame = requestAnimationFrame(animation);
    return () => cancelAnimationFrame(animationFrame);
  }, [isPlaying, barsCount, maxHeight]);

  return (
    <div className='flex items-center h-8 gap-0.5'>
      {heights.map((height, index) => (
        <div
          key={index}
          className={`w-0.5 rounded-sm bg-${color} transition-all duration-75 ease-out`}
          style={{ height: `${height}px` }}
        />
      ))}
    </div>
  );
};
