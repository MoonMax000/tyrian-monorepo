'use client';

import Paper from '@/components/ui/Paper/Paper';
import { FC, useState, useRef, ChangeEvent, DragEvent } from 'react';
import DownloadIcon from '@/assets/system-icons/downloadIcon.svg';
import Button from '@/components/ui/Button/Button';

interface ChangeProfilePictureCardProps {
  onClose: () => void;
  onSave: (file: File) => void;
}

const ChangeProfilePictureCard: FC<ChangeProfilePictureCardProps> = ({
  onClose,
  onSave,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (selectedFile: File) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(selectedFile.type)) {
      setError('Invalid format. Allowed: JPEG, PNG, GIF.');
      return false;
    }

    const maxSize = 10 * 1024 * 1024;
    if (selectedFile.size > maxSize) {
      setError('File is too large. Max size is 10 MB.');
      return false;
    }

    setError(null);
    return true;
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    if (selectedFile && validateFile(selectedFile)) {
      checkImageResolution(selectedFile);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && validateFile(droppedFile)) {
      checkImageResolution(droppedFile);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleSelectClick = () => {
    fileInputRef.current?.click();
  };

  const checkImageResolution = (imageFile: File) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(imageFile);

    img.onload = () => {
      if (img.width <= 512 && img.height <= 512) {
        setFile(imageFile);
        setPreviewUrl(objectUrl);
        setError(null);
      } else {
        setError('Image must be no more than 512x512px.');
        setFile(null);
        setPreviewUrl(null);
        URL.revokeObjectURL(objectUrl);
      }
    };

    img.onerror = () => {
      setError('Invalid image file.');
      URL.revokeObjectURL(objectUrl);
    };

    img.src = objectUrl;
  };

  return (
    <Paper className='w-[393px] rounded-[24px] p-[24px] gap-[24px] flex flex-col border-none'>
      <div className='text-[24px] font-bold'>Profile Picture</div>
      <div className='text-[15px] font-[500] text-lighterAluminum'>
        Upload a new profile picture. Make sure the image is clear, square, and
        centered.
        <br />
        <br />
        Allowed formats: JPEG, PNG, or GIF, max size: 10 MB, size no more than:
        512x512px.
      </div>

      <Paper
        className='flex flex-col items-center justify-center rounded-[8px] py-[24px] px-[16px] gap-[8px] border-dashed border-onyxGrey cursor-pointer'
        onClick={handleSelectClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <input
          type='file'
          ref={fileInputRef}
          accept='image/jpeg,image/png,image/gif'
          className='hidden'
          onChange={handleFileChange}
        />

        {previewUrl ? (
          <img
            src={previewUrl}
            alt='Preview'
            className='w-[160px] h-[160px] rounded-full object-cover'
          />
        ) : (
          <>
            <div className='flex justify-start gap-[4px]'>
              <DownloadIcon className='w-[24px] h-[24px] text-lightPurple' />
              <div className='text-[15px] font-bold'>
                Upload profile picture
              </div>
            </div>
            <div className='text-[12px] font-bold text-webGray uppercase'>
              Drag here or{' '}
              <span className='text-lightPurple underline'>select</span>
            </div>
          </>
        )}
      </Paper>

      {error && <div className='text-red-500 text-[13px]'>{error}</div>}

      <div className='flex justify-end gap-[16px] mt-[24px]'>
        <Button
          ghost
          type='button'
          onClick={onClose}
          className='w-[165.5px] h-[44px] backdrop-blur-[100px] py-[10px] px-[24px] text-white'
        >
          Cancel
        </Button>
        <Button
          className='w-[165.5px] h-[44px] p-[10px]'
          disabled={!file}
          onClick={() => {
            if (file) {
              onSave(file);
            }
            onClose();
          }}
        >
          Save
        </Button>
      </div>
    </Paper>
  );
};

export default ChangeProfilePictureCard;
