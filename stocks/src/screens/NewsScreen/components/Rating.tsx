import Paper from '@/components/Paper';
import dialBackground from '@/assets/dial_background.png';

const Rating = () => {
  return (
    <Paper className='!px-[2px] !pb-0'>
      <div className='flex items-center justify-between gap-2 px-4'>
        <h3 className='text-h4'>Tyrian Trade Raiting</h3>
        <div className='flex items-center gap-3'>
          <p className='text-body-12 font-bold opacity-40 uppercase z-[0]'>Metric:</p>
          <div className='py-[2px] px-1 rounded-[4px] bg-darkRed text-red text-body-15'>
            10%
          </div>
        </div>
      </div>

      <div className='relative mt-[56px] h-[197px]'>
        <img src={dialBackground.src} alt='img' className='h-[197px]' />
      </div>
    </Paper>
  );
};

export default Rating;
