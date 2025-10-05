import Button from '@/components/UI/Button';
import SectionWrapper from '../SectionWrapper';
import Paper from '@/components/Paper';
import { FormEvent, useState } from 'react';
import Textarea from '@/components/UI/Textarea';

const Feedback = () => {
  const [value, setValue] = useState<string>('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!value) {
      return alert('Заполните обязательное поле');
    }

    // todo response
  };

  return (
    <SectionWrapper>
      <Paper className='!px-0'>
        <div className='border-b border-onyxGrey pb-4'>
          <h1 className='text-h4 pl-6'>Feedback</h1>
        </div>

        <div className='border-t-2 border-blackedGray mt-4'>
          <form className='px-6 flex flex-col gap-6' onSubmit={handleSubmit}>
            <div>
              <p className='text-body-15 opacity-[48%] mb-4'>Please share your thoughts with us!</p>

              <Textarea
                className='!min-h-[220px]'
                placeholder='Message...'
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            </div>
            <div className='flex justify-end gap-6'>
              <Button variant='transparent' type='submit' className='!w-[180px] h-10' disabled={!value}>
                Cancel
              </Button>
              <Button type='submit' className='!w-[180px] h-10' disabled={!value}>
                Submit
              </Button>
            </div>
          </form>
        </div>
      </Paper>
    </SectionWrapper>
  );
};

export default Feedback;
