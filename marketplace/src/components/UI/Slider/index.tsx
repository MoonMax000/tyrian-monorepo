import { useState, useEffect, ReactNode, type FC } from 'react';

import Button from '../Button/Button';

import ArrowButton from '@/assets/Navbar/ArrowButton.svg';

import { cn } from '@/utils/cn';

export interface Slide {
  id: number;
  content: ReactNode;
  background?: string;
}

interface SliderProps {
  slides: Slide[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showNavigation?: boolean;
  showDots?: boolean;
  className?: string;
  showCount?: boolean;
  sliderButtonsVariant?: 'center' | 'top';
  leftButtonClassName?: string;
  rightButtonClassName?: string;
}

const Slider: FC<SliderProps> = ({
  slides,
  autoPlay = true,
  autoPlayInterval = 5000,
  showNavigation = true,
  showDots = true,
  className = '',
  showCount = true,
  sliderButtonsVariant = 'center',
  leftButtonClassName,
  rightButtonClassName,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    if (!autoPlay || isPaused || slides.length <= 1) return;

    const interval = setInterval(nextSlide, autoPlayInterval);
    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, isPaused, nextSlide, slides.length]);

  if (slides.length === 0) {
    return (
      <div className={`flex items-center justify-center h-64 bg-gray-100 rounded-lg ${className}`}>
        <p className='text-gray-500'>No slides</p>
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden rounded-lg ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        className='flex h-full transition-transform duration-500 ease-in-out'
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide) => (
          <div
            key={slide.id}
            className='w-full !h-full flex-shrink-0 border border-[#2E2744] rounded-2xl'
            style={{ minWidth: '100%' }}
          >
            <div
              className={`w-full h-full flex items-center justify-center rounded-2xl ${
                slide.background || 'bg-gradient-to-r from-blue-500 to-purple-600'
              }`}
            >
              <div className='w-full h-full text-white'>{slide.content}</div>
            </div>
          </div>
        ))}
      </div>

      {showNavigation && slides.length > 1 && (
        <div
          className={cn('absolute flex gap-x-2', {
            'w-full justify-between top-1/2 -translate-y-1/2 px-4':
              sliderButtonsVariant === 'center',
            'top-4 right-4': sliderButtonsVariant === 'top',
          })}
        >
          <Button
            ghost={sliderButtonsVariant === 'top'}
            variant={sliderButtonsVariant === 'center' ? 'primary' : undefined}
            onClick={prevSlide}
            className={cn('p-1  rounded-full transition-colors duration-200', leftButtonClassName)}
            aria-label='Prev slide'
          >
            <ArrowButton className='rotate-90' aria-hidden='true' />
          </Button>
          <Button
            ghost={sliderButtonsVariant === 'top'}
            variant={sliderButtonsVariant === 'center' ? 'primary' : undefined}
            onClick={nextSlide}
            className={cn('p-1 rounded-full transition-colors duration-200', rightButtonClassName)}
            aria-label='Next slide'
          >
            <ArrowButton className='rotate-[270deg]' aria-hidden='true' />
          </Button>
        </div>
      )}

      {showDots && slides.length > 1 && (
        <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2'>
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-white' : 'bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Go to slide: ${index + 1}`}
            />
          ))}
        </div>
      )}

      {slides.length > 1 && showCount && (
        <div className='absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm'>
          {currentSlide + 1} / {slides.length}
        </div>
      )}
    </div>
  );
};

export default Slider;
