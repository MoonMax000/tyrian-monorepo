import { FC } from 'react';
import NoteIcon from '@/assets/icons/NoteIcon.svg';

interface NotesCountProps {
  notes: number;
  notesMax?: number;
}

const NotesCount: FC<NotesCountProps> = ({ notes, notesMax }) => {
  return (
    <div className='inline-flex items-center justify-center bg-gunpowder rounded-[4px] py-[2px] px-[4px] gap-1'>
      <NoteIcon width={16} height={16} className='text-lighterAluminum' />
      <p className='text-xs font-medium'>
        {notes}
        {notesMax && <span className='opacity-45'>/{notesMax}</span>}
      </p>
    </div>
  );
};

export default NotesCount;
