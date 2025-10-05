'use client';
import { FC, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface IProps {
  question: string;
  answer: string;
}

const Question: FC<IProps> = ({ question, answer }) => {
  const [isOpen, setOpen] = useState<boolean>(false);

  const toggleOpen = () => {
    setOpen((prev) => !prev);
  };

  return (
    <div className='px-[22px] py-6 flex border-[1px] border-[#FFFFFF1F] rounded-lg justify-between'>
      <div className='flex flex-col gap-4'>
        <h3 className='text-[32px] font-semibold'>{question}</h3>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className='text-[18px] font-normal'>{answer}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div onClick={toggleOpen} className='relative min-w-10 h-10 cursor-pointer'>
        <motion.div
          className='absolute top-1/2 left-0 w-full h-0.5 bg-white transform -translate-y-1/2'
          animate={{ rotate: isOpen ? 0 : 90 }}
          transition={{ duration: 0.3 }}
        />
        <motion.div
          className='absolute top-1/2 left-0 w-full h-0.5 bg-white transform -translate-y-1/2'
          animate={{ rotate: isOpen ? 0 : 0 }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  );
};
export default Question;
