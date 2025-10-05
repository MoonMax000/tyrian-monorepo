import { useRef, useState } from 'react';
import { Image } from 'lucide-react';

interface FileUploaderProps {
  value: { previewUrl: string; fileType: string; file?: File } | null;
  onChange: (value: { previewUrl: string; fileType: string; file?: File }) => void;
  isPremium?: boolean;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  value,
  onChange,
  isPremium = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const validateImageResolution = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = document.createElement('img');
      img.onload = () => {
        const { width, height } = img;
        const minResolution = 400;
        const maxLongSide = 4096;
        const longSide = Math.max(width, height);

        const isValid =
          width >= minResolution && height >= minResolution && longSide <= maxLongSide;

        resolve(isValid);
        URL.revokeObjectURL(img.src);
      };
      img.onerror = () => {
        resolve(false);
        URL.revokeObjectURL(img.src);
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const validateMediaDuration = (file: File, isVideo: boolean): Promise<boolean> => {
    return new Promise((resolve) => {
      const url = URL.createObjectURL(file);
      const media = isVideo ? document.createElement('video') : new Audio();

      media.onloadedmetadata = () => {
        const duration = media.duration;
        let maxDuration = 0;

        if (isVideo) {
          maxDuration = isPremium ? 15 * 60 : 5 * 60;
        } else {
          maxDuration = 10 * 60;
        }

        resolve(duration <= maxDuration);
        URL.revokeObjectURL(url);
      };

      media.onerror = () => {
        resolve(false);
        URL.revokeObjectURL(url);
      };

      media.src = url;
    });
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    const sizeMB = file.size / (1024 * 1024);
    const validationErrors: string[] = [];

    const isImage = ['jpg', 'jpeg', 'png', 'webp'].includes(ext);
    const isVideo = ['mp4', 'mov'].includes(ext);
    const isAudio = ['mp3', 'wav', 'aac'].includes(ext);
    const isDoc = ['pdf', 'docx', 'xlsx', 'csv', 'txt', 'json'].includes(ext);
    const isArchive = ['zip'].includes(ext);

    if (
      !isImage &&
      !isVideo &&
      !isAudio &&
      !isDoc &&
      !isArchive &&
      !file.name.toLowerCase().endsWith('.tar.gz')
    ) {
      validationErrors.push('Invalid file format, exactable formats: mp4, mov');
    }

    if (isImage && sizeMB > 10) {
      validationErrors.push('Image must be up to 10 MB');
    }

    if (isVideo) {
      const maxSize = isPremium ? 1024 : 500;
      if (sizeMB > maxSize) {
        validationErrors.push(`Video must be up to ${maxSize} MB`);
      }
    }

    if (isAudio && sizeMB > 50) {
      validationErrors.push('Audio must be up to 50 MB');
    }

    if (isDoc && sizeMB > 20) {
      validationErrors.push('Document must be up to 20 MB');
    }

    if ((isArchive || file.name.toLowerCase().endsWith('.tar.gz')) && sizeMB > 100) {
      validationErrors.push('Archive must be up to 100 MB');
    }

    if (isImage && validationErrors.length === 0) {
      const isValidResolution = await validateImageResolution(file);
      if (!isValidResolution) {
        validationErrors.push(
          'Image must be at least 400×400 px and no more than 4096 px on the long side',
        );
      }
    }

    if ((isVideo || isAudio) && validationErrors.length === 0) {
      const isValidDuration = await validateMediaDuration(file, isVideo);
      if (!isValidDuration) {
        if (isVideo) {
          const maxDuration = isPremium ? 15 : 5;
          validationErrors.push(`Video must be no longer than ${maxDuration} minutes`);
        } else {
          validationErrors.push('Audio must be no longer than 10 minutes');
        }
      }
    }

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    const preview = URL.createObjectURL(file);
    const fileType = file.type;

    onChange({ previewUrl: preview, fileType, file });
    setErrors([]);
  };

  const renderPreview = () => {
    if (!value) return null;

    if (value.fileType?.startsWith('image/')) {
      return <img src={value.previewUrl} alt='preview' className='w-full h-full object-cover' />;
    }

    if (value.fileType?.startsWith('video/')) {
      return <video src={value.previewUrl} controls className='w-full h-full object-cover' />;
    }

    if (
      value.fileType?.startsWith('audio/') ||
      value.file?.name.match(/\.(pdf|docx|xlsx|csv|txt|json|zip|tar\.gz)$/i)
    ) {
      return (
        <div className='flex flex-col items-center justify-center h-full'>
          <Image size={40} className='text-gray-400 mb-2' />
          <span className='text-sm text-gray-400 truncate max-w-[90%]'>{value.file?.name}</span>
        </div>
      );
    }

    return null;
  };

  return (
    <div className='w-full'>
      <div
        className='w-full h-[192px] bg-blackedGray rounded-[8px] flex items-center justify-center cursor-pointer overflow-hidden'
        onClick={handleClick}
      >
        {value ? renderPreview() : <Image size={40} className='text-gray-400' />}
        <input
          type='file'
          accept='.jpg,.jpeg,.png,.webp,.mp4,.mov,.pdf,.docx,.xlsx,.csv,.txt,.json,.wav,.aac,.zip,.tar.gz'
          className='hidden'
          onChange={handleChange}
          ref={fileInputRef}
        />
      </div>

      {errors.length > 0 && (
        <div className='mt-2 p-2 text-red rounded text-red-600 text-sm'>
          {errors.map((error, index) => (
            <div key={index}>{error}</div>
          ))}
        </div>
      )}
    </div>
  );
};
