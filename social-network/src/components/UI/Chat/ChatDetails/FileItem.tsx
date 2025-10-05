import { cn } from '@/utilts/cn';
import { FileData } from '@/app/data';

interface FileItemProps {
  className?: string;
  file: FileData;
  bottomBorder?: boolean;
}

export const FileItem = ({ className, file, bottomBorder }: FileItemProps) => {
  return (
    <div className={cn('grid gap-2 grid-cols-[min-content,1fr]', className)}>
      <div className='relative rounded-lg overflow-hidden text-[15px]' key={file.name}>
        <div className='text-xl size-16 right-1 bottom-1 bg-[#ffb46a] rounded-lg p-1 grid place-items-center'>
          {file.extension}
        </div>
      </div>
      <div className={cn({ 'border-b border-onyxGrey': bottomBorder })}>
        <div className='text-[15px]'>{file.name}</div>
        <div className='text-[13px] opacity-[48%] mb-1'>{file.size}</div>
        <div className='text-[13px] opacity-[48%] mb-1'>{file.date}</div>
      </div>
    </div>
  );
};

export default FileItem;