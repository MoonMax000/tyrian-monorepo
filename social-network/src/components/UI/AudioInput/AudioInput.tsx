import { AudioPlayer, Track } from '@/components/Post/components/AudioPlayer/AudioPlayer';
import React, { useState, useRef, ChangeEvent } from 'react';
import { AudioLines } from 'lucide-react';

interface AudioInputProps {
  onFileSelect?: (file: File, track: Track) => void;
  accept?: string;
  className?: string;
  disabled?: boolean;
}

export const AudioInput: React.FC<AudioInputProps> = ({
  onFileSelect,
  accept = 'audio/*',
  className = '',
  disabled = false,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [generatedTrack, setGeneratedTrack] = useState<Track | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const createTrackFromFile = (file: File): Promise<Track> => {
    return new Promise((resolve) => {
      const objectUrl = URL.createObjectURL(file);

      const audio = new Audio();
      audio.src = objectUrl;

      audio.addEventListener('loadedmetadata', () => {
        const track: Track = {
          id: `uploaded-${Date.now()}-${file.name}`,
          title: file.name.replace(/\.[^/.]+$/, ''),
          artist: 'Loaded file',
          src: objectUrl,
          duration: audio.duration || 0,
          downloadUrl: objectUrl,
        };

        resolve(track);
      });

      audio.addEventListener('error', () => {
        const track: Track = {
          id: `uploaded-${Date.now()}-${file.name}`,
          title: file.name.replace(/\.[^/.]+$/, ''),
          artist: 'Loaded file',
          src: objectUrl,
          duration: 0,
          downloadUrl: objectUrl,
        };
        resolve(track);
      });
    });
  };

  const handleFileSelect = async (file: File) => {
    if (file && file.type.startsWith('audio/')) {
      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      const isCorrectFormat = ['mp3', 'wav', 'aac'].includes(ext);
      const fileSize = file.size / (1024 * 1024);
      if (fileSize > 50) {
        setErrors(['Error, file is larger than 50 MB']);
        return;
      }

      if (!isCorrectFormat) {
        setErrors(['Error, invalid format, valid formats: mp3, wav, aac']);
        return;
      }

      setIsLoading(true);
      setSelectedFile(file);
      setShowPlayer(true);

      try {
        const track = await createTrackFromFile(file);
        setGeneratedTrack(track);
        onFileSelect?.(file, track);
      } catch (error) {
        console.error('Error creating track:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`w-full ${className}`}>
      <input
        ref={fileInputRef}
        type='file'
        accept={accept}
        onChange={handleInputChange}
        className='hidden'
        disabled={disabled || isLoading}
      />

      {!showPlayer && (
        <div className='flex flex-col gap-2'>
          <div
            className={`border-2 border-[#2E2744] rounded-lg p-6 text-center transition-all duration-200 ${
              isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
            } ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            onClick={disabled || isLoading ? undefined : handleClick}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className='flex flex-col items-center justify-center space-y-3'>
              {isLoading ? (
                <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500'></div>
              ) : (
                <AudioLines />
              )}
            </div>
          </div>
          {errors.map((err, index) => (
            <div key={index} className='text-red'>
              {err}
            </div>
          ))}
        </div>
      )}

      {showPlayer && selectedFile && generatedTrack && !isLoading && (
        <>
          <div className='mt-6'>
            <AudioPlayer track={generatedTrack} />
          </div>
        </>
      )}
    </div>
  );
};
