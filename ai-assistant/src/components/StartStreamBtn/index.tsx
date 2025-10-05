import { useState, FC } from 'react';
import ModalWrapper from '@/components/ModalWrapper';
import DubleCircule from '@/assets/system-icons/duble_circule.svg';
import StartStreamModal from '../ui/Header/StartStreamModal';
import Button from '../ui/Button/Button';

export const StartStreamBtn: FC = () => {
  const [isOpenModalStartStream, setIsOpenModalStartStream] = useState(false);
  return (
    <>
      {isOpenModalStartStream && (
        <ModalWrapper onClose={() => setIsOpenModalStartStream(false)}>
          <StartStreamModal
            closeModal={() => setIsOpenModalStartStream(false)}
          />
        </ModalWrapper>
      )}

      <Button
        variant='primary'
        className='w-full py-2 flex gap-2 items-center z-[1000]'
        onClick={() => setIsOpenModalStartStream(true)}
      >
        <DubleCircule width={20} height={20} /> Start Stream
      </Button>
    </>
  );
};
