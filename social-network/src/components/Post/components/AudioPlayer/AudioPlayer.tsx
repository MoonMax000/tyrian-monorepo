import Input from '@/components/UI/TextInput';
import clsx from 'clsx';
import Link from 'next/link';
import { useState, useRef, useEffect, FC, ChangeEvent } from 'react';
import VolumeIcon from '@/assets/icons/volume.svg';
import PlayIcon from '@/assets/icons/play.svg';
import DownloadIcon from '@/assets/icons/download.svg';
import PauseIcon from '@/assets/icons/pause.svg';
import { SoundBar } from '../SoundBar/SoundBar';
import { useClickOutside } from '@/hooks/useClickOutside';

export interface Track {
  id: string;
  title: string;
  artist: string;
  src: string;
  duration: number;
  downloadUrl: string;
}

interface Props {
  track: Track | Track[];
  onPlay?: () => void;
  onPause?: () => void;
  onTrackChange?: (track: Track) => void;
  className?: string;
}

export const AudioPlayer: FC<Props> = ({ track, onPlay, onPause, onTrackChange, className }) => {
  const tracks = Array.isArray(track) ? track : [track];
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [showVolume, setShowVolume] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(tracks[0]?.duration || 0);
  const [error, setError] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressInterval = useRef<NodeJS.Timeout>(null);
  const volumeRef = useRef<HTMLDivElement>(null);

  const currentTrack = tracks[currentTrackIndex];

  useClickOutside(volumeRef, () => setShowVolume(false));

  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.volume = volume;

    const handleLoadedMetadata = () => {
      setDuration(audioRef.current?.duration || currentTrack.duration);
      setError(null);
    };

    const handleError = () => {
      setError('Download failed. Try to check file format.');
      setIsPlaying(false);
    };

    const handleEnded = () => {
      if (tracks.length > 1) {
        nextTrack();
      } else {
        setIsPlaying(false);
        setProgress(0);
        setCurrentTime(0);
      }
    };

    const audio = audioRef.current;
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('error', handleError);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.pause();
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('ended', handleEnded);
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [currentTrack.duration, tracks.length]);

  useEffect(() => {
    if (!audioRef.current || !currentTrack) return;

    setError(null);
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime(0);

    try {
      audioRef.current.src = currentTrack.src;
      audioRef.current.load();
      setDuration(currentTrack.duration);

      if (onTrackChange) {
        onTrackChange(currentTrack);
      }
    } catch (err) {
      setError('Unsupportable format');
      console.log(err);
    }
  }, [currentTrack, onTrackChange]);

  const nextTrack = () => {
    const nextIndex = (currentTrackIndex + 1) % tracks.length;
    setCurrentTrackIndex(nextIndex);
  };

  const prevTrack = () => {
    const prevIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    setCurrentTrackIndex(prevIndex);
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const togglePlay = async () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      onPause?.();
      setIsPlaying(false);
    } else {
      try {
        await audioRef.current.play();
        onPlay?.();
        setIsPlaying(true);
      } catch (err) {
        setError('Error. Check file');
        console.error('Playback error:', err);
      }
    }
  };

  const handleProgressChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;

    const newProgress = parseFloat(e.target.value);
    setProgress(newProgress);

    if (isFinite(audioRef.current.duration)) {
      const newTime = (newProgress / 100) * audioRef.current.duration;
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  useEffect(() => {
    const updateProgress = () => {
      if (audioRef.current && isFinite(audioRef.current.duration)) {
        const newProgress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
        setProgress(newProgress);
        setCurrentTime(audioRef.current.currentTime);
      }
    };

    if (isPlaying) {
      progressInterval.current = setInterval(updateProgress, 500);
    }

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [isPlaying]);

  return (
    <div
      className={clsx(
        'flex items-center justify-between w-full max-w-3xl mx-auto px-3 py-2 bg-transparent rounded-lg shadow',
        className,
      )}
    >
      {tracks.length > 1 && (
        <button
          onClick={prevTrack}
          disabled={!!error}
          className='flex items-center justify-center w-8 h-8 rounded-full text-gray-600 hover:bg-gray-100 disabled:text-gray-400'
        >
          left
        </button>
      )}

      <button
        onClick={togglePlay}
        disabled={!!error}
        className={`relative flex items-center justify-center w-[44px] h-[44px] rounded-full bg-[linear-gradient(270deg,#A06AFF_0%,#482090_100%)] ${
          error ? 'bg-gray-400' : 'bg-purple-600 hover:bg-purple-700'
        } transition-colors`}
      >
        <SoundBar isPlaying={isPlaying} color='white' />
      </button>

      <div className='flex-1 mx-3'>
        {error && <div className='text-red-500 text-sm mb-2'>{error}</div>}

        {currentTrack && (
          <div className='mb-1 w-full'>
            <div className='font-medium truncate max-w-[530px]'>{currentTrack.title}</div>
          </div>
        )}

        <div className='relative h-2 top-3 w-full'>
          <Input
            type='range'
            inputWrapperClassName='!px-0 !py-0'
            min='0'
            max='100'
            value={progress}
            onChange={handleProgressChange}
            disabled={!!error}
            className={`absolute w-full h-1 rounded-full appearance-none cursor-pointer accent-purple mx-[-2px]  ${
              error ? 'bg-gray-300' : ''
            }`}
            style={
              !error
                ? {
                    background: 'linear-gradient(270deg, #A06AFF 0%, #482090 100%)',
                  }
                : {}
            }
          />
        </div>

        <div className='flex items-center justify-between mt-5'>
          <div className='flex gap-2'>
            <button
              onClick={togglePlay}
              disabled={!!error}
              className={`flex items-center justify-center rounded-full ${
                error ? 'bg-gray-400' : 'bg-purple-600 hover:bg-purple-700'
              } transition-colors`}
            >
              {isPlaying ? (
                <PauseIcon className='w-[20px] h-[20px]' />
              ) : (
                <PlayIcon className='w-[20px] h-[20px]' />
              )}
            </button>
            <div className='flex' ref={volumeRef}>
              <button
                onClick={() => setShowVolume(!showVolume)}
                disabled={!!error}
                className='flex items-center text-gray-600 hover:text-purple-600 disabled:text-gray-400'
              >
                <VolumeIcon />
              </button>

              {showVolume && (
                <div className='absolute bottom-[35px] mb-2 left-[115px] bg-transparent p-2 rounded shadow-lg z-10'>
                  <Input
                    type='range'
                    min='0'
                    max='1'
                    step='0.01'
                    value={volume}
                    onChange={handleVolumeChange}
                    disabled={!!error}
                    className={`w-24 h-2 rounded-full appearance-none accent-purple cursor-pointer ${
                      error ? 'bg-gray-300' : 'bg-gray-200'
                    }`}
                    style={
                      !error
                        ? {
                            background: 'linear-gradient(270deg, #A06AFF 0%, #482090 100%)',
                          }
                        : {}
                    }
                  />
                </div>
              )}
            </div>
          </div>

          <div className={`text-sm  ${error ? 'text-gray-400' : 'text-whiteGray'}`}>
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>
      </div>

      <div className='flex items-center gap-2'>
        {tracks.length > 1 && (
          <button
            onClick={nextTrack}
            disabled={!!error}
            className='flex items-center justify-center w-8 h-8 rounded-full text-gray-600 hover:bg-gray-100 disabled:text-gray-400'
          >
            right
          </button>
        )}

        <Link
          href={error ? '#' : currentTrack?.downloadUrl}
          download
          className={`flex items-center justify-center w-10 h-10 rounded-full ${
            error ? 'bg-gray-200 cursor-not-allowed' : 'bg-gray-100 hover:bg-gray-200'
          } transition-colors`}
        >
          <DownloadIcon />
        </Link>
      </div>
    </div>
  );
};
