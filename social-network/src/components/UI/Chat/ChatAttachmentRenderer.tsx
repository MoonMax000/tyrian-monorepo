import React, { useState } from 'react';
import NextImage from 'next/image';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import Captions from 'yet-another-react-lightbox/plugins/captions';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/plugins/captions.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import { FileData, LinkData, PhotoData, VideoData } from '@/app/data';
import { Skeleton } from '@/components/shadcnui/skeleton';
import { cn } from '@/utilts/cn';
import { Maximize2, PlayCircle } from 'lucide-react';
import VideoItem from './ChatDetails/VideoItem';
import FileItem from './ChatDetails/FileItem';
import LinkItem from './ChatDetails/LinkItem';

interface ChatAttachmentRendererProps {
  attachments: {
    photos?: PhotoData[];
    videos?: VideoData[];
    files?: FileData[];
    links?: LinkData[];
  };
  isLoading?: boolean;
}

const MAX_MEDIA_PREVIEWS = 4;

const AttachmentItemSkeleton = () => (
  <div className='flex items-center space-x-3 p-2'>
    <Skeleton className='h-9 w-9 flex-shrink-0 bg-gray-600' />
    <div className='space-y-1.5 flex-grow'>
      <Skeleton className='h-4 w-3/4 bg-gray-600' />
      <Skeleton className='h-3 w-1/2 bg-gray-600' />
    </div>
  </div>
);

const getMediaLayoutStyles = (count: number) => {
  const displayCount = Math.min(count, MAX_MEDIA_PREVIEWS);
  switch (displayCount) {
    case 1:
      return {
        gridContainerClasses: 'grid grid-cols-1',
        getItemClasses: (index: number, type: 'photo' | 'video') =>
          cn(type === 'photo' ? 'aspect-square' : 'aspect-video'),
      };
    case 2:
      return {
        gridContainerClasses: 'grid grid-cols-2 gap-1',
        getItemClasses: () => 'aspect-square',
      };
    case 3:
      return {
        gridContainerClasses: 'flex flex-row gap-1 overflow-scroll',
        getItemClasses: () => 'w-[164px] h-[164px] flex-shrink-0',
      };
    case 4:
    default:
      return {
        gridContainerClasses: 'grid grid-cols-2 grid-rows-2 gap-1',
        getItemClasses: () => 'aspect-square',
      };
  }
};

export const ChatAttachmentRenderer: React.FC<ChatAttachmentRendererProps> = ({
  attachments,
  isLoading,
}) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const { photos = [], videos = [], files = [], links = [] } = attachments || {};
  const photoItems = photos.map((src) => ({ type: 'photo' as const, src }));
  const videoItems = videos.map((video) => ({ type: 'video' as const, ...video }));
  const mediaItems = [...photoItems, ...videoItems];

  const totalMediaCount = mediaItems.length;
  const visibleMediaItems = mediaItems.slice(0, MAX_MEDIA_PREVIEWS);
  const hiddenMediaCount = totalMediaCount - visibleMediaItems.length;

  const lightboxSlides = photos.map((src) => ({ src }));

  const openLightbox = (clickedItemIndex: number) => {
    let photoIndexInLightbox = -1;
    let photoCounter = 0;
    for (let i = 0; i <= clickedItemIndex && i < mediaItems.length; i++) {
      if (mediaItems[i].type === 'photo') {
        if (i === clickedItemIndex) {
          photoIndexInLightbox = photoCounter;
        }
        photoCounter++;
      }
    }

    if (photoIndexInLightbox !== -1) {
      setLightboxIndex(photoIndexInLightbox);
      setLightboxOpen(true);
    } else {
      console.log('Clicked on video preview - lightbox not configured for videos.');
    }
  };

  const { gridContainerClasses, getItemClasses } = getMediaLayoutStyles(totalMediaCount);

  const shouldRenderMedia = totalMediaCount > 0;
  const shouldRenderFiles = files.length > 0;
  const shouldRenderLinks = links.length > 0;

  return (
    <>
      <div className={cn('space-y-2 pt-1', isLoading && 'opacity-60 animate-pulse')}>
        {shouldRenderMedia && (
          <div className={cn(gridContainerClasses, isLoading && 'pointer-events-none')}>
            {isLoading
              ? Array.from({ length: visibleMediaItems.length }).map((_, index) => {
                  const hypotheticalItemType = index < photoItems.length ? 'photo' : 'video';
                  return (
                    <Skeleton
                      key={`skel-media-${index}`}
                      className={cn(
                        'w-full bg-gray-600/50',
                        getItemClasses(index, hypotheticalItemType),
                      )}
                    />
                  );
                })
              : visibleMediaItems.map((item, index) => (
                  <div
                    key={
                      item.type === 'photo'
                        ? `photo-${item.src}-${index}`
                        : `video-${item.link}-${index}`
                    }
                    className={cn(
                      'relative overflow-hidden group bg-black',
                      getItemClasses(index, item.type),
                    )}
                  >
                    {item.type === 'photo' && (
                      <>
                        <NextImage
                          src={item.src}
                          layout='fill'
                          objectFit='cover'
                          alt='Chat photo attachment'
                          className='transition-opacity duration-500 ease-out'
                          style={{ opacity: 0 }}
                          onLoadingComplete={(img) => {
                            img.style.opacity = '1';
                          }}
                          onError={(e) =>
                            console.log('Image load failed:', (e.target as HTMLImageElement).src)
                          }
                        />
                        <div
                          className='absolute inset-0 bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center cursor-pointer z-10'
                          onClick={() => openLightbox(index)}
                        >
                          <Maximize2 className='w-6 h-6 text-white opacity-0 group-hover:opacity-80 transition-opacity' />
                        </div>
                      </>
                    )}

                    {item.type === 'video' && (
                      <>
                        <VideoItem src={item.link} timeSpan={item.timeSpan} />
                        <div className='absolute inset-0 bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center cursor-pointer z-10'>
                          <PlayCircle className='w-8 h-8 text-white opacity-0 group-hover:opacity-80 transition-opacity' />
                        </div>
                      </>
                    )}

                    {index === MAX_MEDIA_PREVIEWS - 1 && hiddenMediaCount > 0 && (
                      <div
                        className='absolute inset-0 bg-opacity-60 flex items-center justify-center text-white text-lg sm:text-xl font-bold cursor-pointer z-20'
                        onClick={() => openLightbox(index)}
                      >
                        +{hiddenMediaCount}
                      </div>
                    )}
                  </div>
                ))}
          </div>
        )}

        {shouldRenderFiles && (
          <div className={cn('grid grid-cols-1 gap-1.5', isLoading && 'pointer-events-none')}>
            {isLoading
              ? Array.from({ length: files.length }).map((_, index) => (
                  <AttachmentItemSkeleton key={`skel-file-${index}`} />
                ))
              : files.map((file, id) => <FileItem file={file} key={`file-${id}`} />)}
          </div>
        )}

        {shouldRenderLinks && (
          <div className={cn('grid grid-cols-1 gap-1.5', isLoading && 'pointer-events-none')}>
            {isLoading
              ? Array.from({ length: links.length }).map((_, index) => (
                  <AttachmentItemSkeleton key={`skel-link-${index}`} />
                ))
              : links.map((link, id) => <LinkItem link={link} key={`link-${id}`} />)}
          </div>
        )}
      </div>

      {lightboxSlides.length > 0 && (
        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          slides={lightboxSlides}
          index={lightboxIndex}
          plugins={[Captions, Thumbnails, Zoom]}
          styles={{ container: { backgroundColor: 'rgba(0, 0, 0, .85)' } }}
          captions={{ descriptionTextAlign: 'center' }}
          thumbnails={{ position: 'bottom' }}
        />
      )}
    </>
  );
};
