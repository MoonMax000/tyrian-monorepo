import { LiveStreamingScreen } from '@/screens/live-sreaming/LiveStreaming';
import { Suspense } from 'react';

export default function LiveStreaming() {
  return (
    <Suspense>
      <LiveStreamingScreen />
    </Suspense>
  );
}
