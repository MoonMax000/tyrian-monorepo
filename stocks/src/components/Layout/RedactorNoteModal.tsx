import { FC, useState, ChangeEvent } from 'react';
import ModalV2 from '@/components/UI/ModalV2';
import Toggle from '../UI/Toggle';
import Textarea from '../UI/Textarea';
import Input from '../UI/Input';
import Xmark from '@/assets/icons/xmark.svg';
import Button from '../UI/Button';
import DeleteNoteModal from './DeleteNoteModal';
import { useToggle } from '@/hooks/useToggle';

const mockNoteData = {
  title: 'Gas prices in the EU will rise after stopping transit from Russia',
  text: 'Gas prices in the European Union are expected to rise due to the termination of gas transit from Russia, according to Russian Energy Minister Alexander Novak. The suspension of supplies may lead to a shortage of gas in the EU market, which, in turn, will affect the cost of energy resources. European countries are already looking for alternative sources of supply to minimize the consequences of this decision and ensure energy security.',
  date: '2023-01-01',
  time: '12:00',
};

interface EditNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: {
    title: string;
    text: string;
    date: string;
    time: string;
  };
}

const EditNoteModal: FC<EditNoteModalProps> = ({ isOpen, onClose, initialData = mockNoteData }) => {
  const [isActiveSubscribe, setIsActiveSubscribe] = useState<boolean>(true);

  const [showDateTime, toggleShowDateTime] = useToggle();

  const [note, setNote] = useState(initialData);

  const [deleteModalIsOpen, toggleDeleteModalOpen] = useToggle();

  const handleChangeNote = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setNote((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <ModalV2
      isOpen={isOpen}
      onClose={onClose}
      title='Edit Note'
      contentClassName='py-6 px-4 border-gunpowder border-[1px] w-full max-w-[704px]'
      withCloseButton
    >
      <form>
        <div className='flex flex-col gap-y-4'>
          <Input
            label='Title'
            value={note.title}
            placeholder='Enter a title'
            name='title'
            onChange={handleChangeNote}
          />
          <Textarea
            className='min-h-[196px]'
            placeholder='Note a text...'
            name='text'
            value={note.text}
            onChange={handleChangeNote}
          />
          <div className='flex items-center justify-between gap-x-4 pb-[20px] border-b-[1px] border-onyxGrey'>
            <span className='text-[15px] font-bold text-white'>Get Notitification</span>
            <Toggle isActive={isActiveSubscribe} onChange={setIsActiveSubscribe} />
          </div>
          <div>
            {!showDateTime && (
              <button
                onClick={toggleShowDateTime}
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
                    value={note.date}
                    onChange={handleChangeNote}
                    name='date'
                    type='date'
                    placeholder='DD/MM/YYYY'
                    className='[&::-webkit-calendar-picker-indicator]:invert [&::-moz-calendar-picker-indicator]:invert'
                    wrapperClassName='max-w-[150px] md:w-full'
                  />
                  <Input
                    value={note.time}
                    onChange={handleChangeNote}
                    name='time'
                    type='time'
                    placeholder='00:00'
                    className='[&::-webkit-calendar-picker-indicator]:invert [&::-moz-calendar-picker-indicator]:invert'
                    wrapperClassName='max-w-[110px] md:w-full'
                  />
                </div>
                <div className='pl-[22px] border-l-[1px] border-onyxGrey flex items-center justify-center ml-8'>
                  <button onClick={toggleShowDateTime} className='text-red'>
                    <Xmark width={16} height={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className='flex flex-col sm:flex-row items-center justify-center gap-6 mt-10'>
          <Button
            onClick={toggleDeleteModalOpen}
            variant='danger'
            className='px-[66.5px] py-3 bg-transparent border-[2px] border-red text-red'
          >
            Delete
          </Button>
          <Button
            onClick={onClose}
            className='px-[66.5px] py-3 bg-gradient-to-l from-[#A06AFF] to-[#482090] hover:bg-white'
          >
            Save
          </Button>
        </div>
      </form>
      <DeleteNoteModal isOpen={deleteModalIsOpen} onClose={toggleDeleteModalOpen} />
    </ModalV2>
  );
};

export default EditNoteModal;
