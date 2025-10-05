import Paper from '@/components/Paper';
import Button from '@/components/UI/Button';
import IconTelegram from '@/assets/icons/social-networks/big-telegram.svg';

const TelegramSubscribe = () => {
  return (
    <Paper className='flex justify-between items-center gap-2 !pt-6'>
      <div className='flex items-center gap-[14px]'>
        <IconTelegram className='size-[64px]' width={64} height={64} />
        <div className='flex flex-col gap-2'>
          <p className='text-body-15'>Track All Dividend Data in Real-Time on Telegram</p>
          <p className='text-body-15 opacity-[64%]'>100,000+ Subscribers</p>
        </div>
      </div>

      <Button className='h-10 w-[180px]'>Subscribe</Button>
    </Paper>
  );
};

export default TelegramSubscribe;
