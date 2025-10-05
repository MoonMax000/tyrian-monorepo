'use clientx';
import { ChangeEvent, FC, useEffect, useState } from 'react';
import DownloadFileInput from '../DownloadFileInput';
import Paper from '@/components/ui/Paper/Paper';
import { useMutation } from '@tanstack/react-query';
import { UserService } from '@/services/UserService';

const allowedFileFormats = ['png', 'jpeg', 'gif'];
const MAX_FILE_SIZE = 10485760;

interface FormState {
  banner?: string;
}
interface Props {
  cover_url?: string;
}

export const UploadBanner: FC<Props> = ({ cover_url }) => {
  const [formState, setFormState] = useState<FormState>({ banner: cover_url });

  useEffect(() => {
    setFormState({ banner: cover_url });
  }, [cover_url]);

  const { mutateAsync: uploadBanner } = useMutation({
    mutationFn: (file: File) => UserService.changeBanner(file),
  });

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formatIsAllowed = allowedFileFormats.some((format) =>
      file.type.includes(format),
    );
    if (!formatIsAllowed) {
      alert('Неразрешённый формат файла');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      alert('Слишком большой файл');
      return;
    }

    const url = URL.createObjectURL(file);
    setFormState((prev) => ({ ...prev, banner: url }));

    uploadBanner(file);
  };

  const bannerImage = (
    <img
      src={formState.banner || '/images/banner.jpg'}
      alt='banner'
      className='object-cover w-full h-full'
    />
  );

  return (
    <Paper className='p-4'>
      <div className='flex items-center gap-4 justify-between'>
        <div className='min-w-[284px] h-[160px] rounded-lg overflow-hidden'>
          {bannerImage}
        </div>

        <div className='flex w-full flex-col gap-6 items-center justify-center'>
          <DownloadFileInput
            className='!w-[180px] bg-gradient-to-r from-darkPurple to-lightPurple border-darkPurple rounded-lg py-[15px] text-center text-sm leading-[14px] font-bold'
            accept='.jpeg,.png,.gif'
            onChange={handleFileChange}
          >
            Upload Banner
          </DownloadFileInput>

          <p className='text-[15px] leading-5 font-medium text-lighterAluminum text-center max-tablet:text-left'>
            Supported formats: JPEG, PNG or GIF. Max.size: 10 МБ.
          </p>
        </div>
      </div>
    </Paper>
  );
};
