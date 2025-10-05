import clsx from 'clsx';

export const CryptoCurrencyBackground = () => (
  <div
    className={clsx(
      'absolute top-0 left-0 w-full h-full -z-10',
      `bg-[image:url('/bg/bg-top.png'),url('/bg/bg-mid.png'),url('/bg/bg-bot.png')]`,
      'bg-[position:top,center_500px,bottom_center]',
      'bg-no-repeat',
    )}
  />
);
