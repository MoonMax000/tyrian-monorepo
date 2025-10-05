'use client';

import Paper from '@/components/ui/Paper/Paper';
import { FC } from 'react';
import DownloadIcon from '@/assets/system-icons/downloadIcon.svg';
import Button from '@/components/ui/Button/Button';

const ChangeCoverPictureCard: FC<{
  onClose: () => void;
  onSave: (file: File) => void;
}> = ({ onClose, onSave }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onSave(file);
    }
  };

  return (
    <Paper className='w-[393px] rounded-[24px] p-[24px] gap-[24px] flex flex-col border-none'>
      <div className='text-[24px] font-bold'>Cover Image</div>
      <div className='text-[15px] font-[500] text-lighterAluminum'>
        Upload a wide image to customize your profile header. Use landscape
        photo or branded banner. <br /> <br /> Allowed formats: JPEG, PNG, or
        GIF, max size: 10 MB, size: 1200x300px.
      </div>

      <label className='cursor-pointer'>
        <Paper className='flex flex-col items-center justify-center rounded-[8px] py-[24px] px-[16px] gap-[4px] border-dashed border-onyxGrey'>
          <div className='flex justify-start gap-[4px]'>
            <DownloadIcon className='w-[24px] h-[24px] text-lightPurple' />
            <div className='text-[15px] font-bold'>Upload cover image</div>
          </div>
          <div className='text-[12px] font-bold text-webGray uppercase'>
            Drag here or{' '}
            <span className='text-lightPurple underline'>select</span>
          </div>
          <input
            type='file'
            accept='image/*'
            hidden
            onChange={handleFileChange}
          />
        </Paper>
      </label>

      <div className='flex justify-end gap-[16px] mt-[24px]'>
        <Button
          ghost
          type='button'
          onClick={onClose}
          className='w-[165.5px] h-[44px] backdrop-blur-[100px] py-[10px] px-[24px] text-white'
        >
          Cancel
        </Button>
        <Button className='w-[165.5px] h-[44px] p-[10px]' onClick={onClose}>
          Save
        </Button>
      </div>
    </Paper>
  );
};

export default ChangeCoverPictureCard;