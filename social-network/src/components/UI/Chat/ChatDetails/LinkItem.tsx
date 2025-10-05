import NextImage from 'next/image';
import NextLink from 'next/link';
import { cn } from '@/utilts/cn';
import { LinkData } from '@/app/data';

interface LinkItemProps {
  className?: string;
  link: LinkData;
  bottomBorder?: boolean;
}

export const LinkItem = ({ className, link, bottomBorder }: LinkItemProps) => {
  return (
    <div className={cn('grid gap-2 grid-cols-[min-content,1fr]', className)}>
      <div className='size-11 relative rounded-lg overflow-hidden' key={link.url}>
        {link.previewType === 'url' ? (
          <NextImage src={link.preview} fill alt='' />
        ) : (
          <div className='size-11 right-1 bottom-1 bg-[#ff6b6b] rounded-lg p-1 grid place-items-center'>
            {link.preview}
          </div>
        )}
      </div>
      <div className={cn({ 'border-b border-onyxGrey': bottomBorder })}>
        <div>{link.name}</div>
        <NextLink href={link.url} className='text-[#A06AFF]'>
          {link.url}
        </NextLink>
      </div>
    </div>
  );
};

export default LinkItem;