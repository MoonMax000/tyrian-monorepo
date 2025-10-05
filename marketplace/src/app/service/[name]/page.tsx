'use client';

import { ServiceIframe } from '@/components/ServiceIframe/ServiceIframe';
import { useParams } from 'next/navigation';

const serviceMap: Record<string, { url: string; name: string }> = {
  social: { url: 'http://localhost:4204', name: 'Social Network' },
  stocks: { url: 'http://localhost:4206', name: 'Stocks' },
  crypto: { url: 'http://localhost:4203', name: 'Cryptocurrency' },
  ai: { url: 'http://localhost:3006', name: 'AI Profiles' },
  streaming: { url: 'http://localhost:3004', name: 'Live Streaming' },
};

export default function ServicePage() {
  const params = useParams();
  const serviceName = params.name as string;
  const service = serviceMap[serviceName];

  if (!service) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <div className='text-white text-2xl'>Service not found</div>
      </div>
    );
  }

  return (
    <div className='fixed inset-0 top-[80px]'>
      <ServiceIframe serviceUrl={service.url} serviceName={service.name} />
    </div>
  );
}

