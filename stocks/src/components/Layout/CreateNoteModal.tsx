import { FC, useState } from 'react';
import ModalV2 from '@/components/UI/ModalV2';
import Toggle from '../UI/Toggle';
import Textarea from '../UI/Textarea';
import Input from '../UI/Input';
import Xmark from '@/assets/icons/xmark.svg';
import Button from '../UI/Button';
import { useToggle } from '@/hooks/useToggle';

interface CreateNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateNoteModal: FC<CreateNoteModalProps> = ({ isOpen, onClose }) => {
  const [isActiveSubscribe, setIsActiveSubscribe] = useState<boolean>(true);

  const [showDateTime, toggleDateTimeVisible] = useToggle();

  return (
    <ModalV2
      isOpen={isOpen}
      onClose={onClose}
      title='Create Note'
      contentClassName='py-6 px-4 border-gunpowder border-[1px] w-full max-w-[704px]'
      withCloseButton
    >
      <form>
        <div className='flex flex-col gap-y-4'>
          <Input label='Title' placeholder='Enter a title' />
          <Textarea placeholder='Note a text...' className='min-h-[196px]' />
          <div className='flex items-center justify-between gap-x-4 pb-[20px] border-b-[1px] border-onyxGrey'>
            <span className='text-[15px] font-bold text-white'>Get Notitification</span>
            <Toggle isActive={isActiveSubscribe} onChange={setIsActiveSubscribe} />
          </div>
          <div>
            {!showDateTime && (
              <button
                onClick={toggleDateTimeVisible}
                className='text-[15px] text-purple font-bold hover:underline'
              >
                + Add Date & Time
              </button>
            )}
            {showDateTime && (
              <div className='flex flex-col md:flex-row items-center gap-4'>
                <span className='font-bold text-[15px]'>Date & Time</span>
                <div className='flex items-center gap-x-4 ml-auto'>
                  <Input
                    type='date'
                    placeholder='DD/MM/YYYY'
                    className='[&::-webkit-calendar-picker-indicator]:invert [&::-moz-calendar-picker-indicator]:invert'
                    wrapperClassName='max-w-[150px] md:w-full'
                  />
                  <Input
                    type='time'
                    placeholder='00:00'
                    className='[&::-webkit-calendar-picker-indicator]:invert [&::-moz-calendar-picker-indicator]:invert'
                    wrapperClassName='max-w-[110px] md:w-full'
                  />
                </div>
                <div className='pl-[22px] border-l-[1px] border-onyxGrey flex items-center justify-center ml-8'>
                  <button onClick={toggleDateTimeVisible} className='text-red'>
                    <Xmark width={16} height={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className='flex flex-col sm:flex-row items-center justify-center gap-6 mt-10'>
          <Button onClick={onClose} variant='transparent' className='px-[66.5px] py-3'>
            Cancel
          </Button>
          <Button
            onClick={onClose}
            className='px-[66.5px] py-3 bg-gradient-to-l from-[#A06AFF] to-[#482090] hover:bg-white'
          >
            Create
          </Button>
        </div>
      </form>
    </ModalV2>
  );
};

export default CreateNoteModal;
