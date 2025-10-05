'use client';
import { FC, useRef, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/UI/Button';
import { useSubscribeToPostMutation } from '@/store/postsApi';

const PaymentScreen: FC = () => {
  const params = useParams();
  const router = useRouter();
  const postId = params.postid as string;
  const [subscribeToPost, { isLoading, error }] = useSubscribeToPostMutation();
  const hasSubscribed = useRef(false);

  const handleSubscription = async () => {
    if (!postId || hasSubscribed.current) {
      console.log('Skipping subscription', { postId, hasSubscribed: hasSubscribed.current });
      return;
    }
    hasSubscribed.current = true;
    console.log('Calling subscribeToPost for postId:', postId);
    try {
      const response = await subscribeToPost(postId).unwrap();
      console.log('Subscription successful:', response.message);
    } catch (err) {
      console.log('Subscription failed:', err);
    }
  };

  useEffect(() => {
    handleSubscription();
  }, [postId]);

  const handleReturnPost = () => {
    router.push(`/post/${postId}`);
  };

  const handleReturnStore = () => {
    router.back();
  };

  return (
    <div className='flex flex-col h-screen gap-10 items-center justify-center'>
      <h1 className='text-6xl'>
        {isLoading ? 'Subscribing...' : error ? 'Subscription failed' : 'Payment was successful'}
      </h1>
      {!error && (
        <Button onClick={handleReturnPost} disabled={isLoading} variant='gradient'>
          Return to the post
        </Button>
      )}
      {error && (
        <Button onClick={handleReturnStore} disabled={isLoading} variant='gradient'>
          Return to the store
        </Button>
      )}
    </div>
  );
};

export default PaymentScreen;
