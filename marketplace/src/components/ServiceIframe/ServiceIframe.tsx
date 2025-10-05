'use client';

import { useEffect, useState } from 'react';

interface ServiceIframeProps {
  serviceUrl: string;
  serviceName: string;
}

export const ServiceIframe = ({ serviceUrl, serviceName }: ServiceIframeProps) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
  }, [serviceUrl]);

  const handleLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className='relative w-full h-full'>
      {isLoading && (
        <div className='absolute inset-0 flex items-center justify-center bg-black/50'>
          <div className='text-white text-xl'>
            Loading {serviceName}...
          </div>
        </div>
      )}
      <iframe
        src={serviceUrl}
        className='w-full h-full border-0'
        onLoad={handleLoad}
        title={serviceName}
        allow='fullscreen'
      />
    </div>
  );
};

