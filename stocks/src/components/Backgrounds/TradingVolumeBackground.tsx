import Image from 'next/image';
import clsx from 'clsx';
import Ribbon1 from 'public/Ribbon1.png';
import Ribbon2 from 'public/Ribbon2.png';
import Ribbon4 from 'public/Ribbon4.png';
import Ribbon8 from 'public/Ribbon8.png';

export const TradingVolumeBackground = () => (
  <div className={clsx('absolute top-0 left-0 w-full h-full -z-10', 'overflow-hidden')}>
    <Image
      src={Ribbon1}
      alt='Ribbon1'
      fill
      sizes='100vw'
      priority={true}
      placeholder='blur'
      style={{
        objectFit: 'contain',
        objectPosition: '400px top',
        pointerEvents: 'none',
      }}
    />
    <Image
      src={Ribbon2}
      alt='Ribbon2'
      fill
      sizes='100vw'
      priority={false}
      placeholder='blur'
      style={{
        objectFit: 'contain',
        objectPosition: 'center 1200px',
        pointerEvents: 'none',
      }}
    />
    <Image
      src={Ribbon4}
      alt='Ribbon4'
      fill
      sizes='100vw'
      priority={false}
      placeholder='blur'
      style={{
        objectFit: 'contain',
        objectPosition: 'center 1700px',
        pointerEvents: 'none',
      }}
    />
    <Image
      src={Ribbon8}
      alt='Ribbon8'
      fill
      sizes='100vw'
      priority={false}
      placeholder='blur'
      style={{
        objectFit: 'contain',
        objectPosition: 'bottom center',
        pointerEvents: 'none',
      }}
    />
  </div>
);
