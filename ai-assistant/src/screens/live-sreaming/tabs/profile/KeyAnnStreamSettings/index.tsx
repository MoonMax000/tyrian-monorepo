'use client';

import { FC, useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import copy from 'copy-to-clipboard';
import { Toggle } from '@/components/ui/Toogle/Toogle';
import { UserService } from '@/services/UserService';
import Button from '@/components/ui/Button/Button';
import Paper from '@/components/ui/Paper/Paper';
import { StartStreamBtn } from '@/components/StartStreamBtn';

const KeyAnnStreamSettings: FC = () => {
  const [streamKey, setStreamKey] = useState('');
  const [formState, setFormState] = useState<{
    duration: 'low' | 'default';
    protectionOfDisconnection: boolean;
  }>({
    duration: 'default',
    protectionOfDisconnection: true,
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedKey = localStorage.getItem('userKey');
      if (savedKey) setStreamKey(savedKey);
    }
  }, []);

  const { mutate, isPending } = useMutation({
    mutationFn: UserService.getKey,
    onSuccess: (key) => {
      setStreamKey(key.data.key);
      if (typeof window !== 'undefined') {
        localStorage.setItem('userKey', key.data.key);
      }
    },
  });

  return (
    <Paper className='px-4'>
      <div className='flex items-center gap-4 border-b border-regaliaPurple py-4'>
        <p className='text-[15px] leading-5 font-medium min-w-[115px]'>
          Primary Stream Key
        </p>
        <input
          value={streamKey}
          readOnly
          type='password'
          className='bg-moonlessNight w-full px-4 py-[14px] rounded-lg h-11 text-webGray'
        />
        <Button
          ghost
          className='w-[180px] min-w-[180px] h-11'
          onClick={() => copy(streamKey)}
          disabled={!streamKey}
        >
          Copy
        </Button>
        <Button
          className='w-[180px] min-w-[180px] h-11'
          onClick={() => {
            mutate();
          }}
          disabled={isPending}
        >
          Generate New Key
        </Button>
      </div>

      <div className='flex items-center gap-2 border-b border-regaliaPurple py-4 justify-between'>
        <div className='max-w-[70%]'>
          <p className='text-[15px] leading-5 font-medium mb-3'>
            Connection for Windows:
          </p>
          <div className='flex gap-[31px] mb-4'>
            <div className='flex gap-3'>
              <p className='text-[15px] leading-5 font-bold'>Server:</p>
              <p className='text-[15px] leading-5 font-medium text-webGray'>
                http://media.k8s.tyriantrade.com/whip
              </p>
            </div>
          </div>
          <p className='text-[15px] leading-5 font-medium mb-3'>
            Connection for MacOS:
          </p>
          <div className='flex gap-[31px] mb-4'>
            <div className='flex gap-3'>
              <p className='text-[15px] leading-5 font-bold'>Server:</p>
              <p className='text-[15px] leading-5 font-medium text-webGray'>
                https://media.k8s.tyriantrade.com/whip
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className='flex items-center gap-2 py-4 justify-between border-b-[1px] border-regaliaPurple'>
        <div className='max-w-[90%]'>
          <p className='text-[15px] leading-5 font-bold'>
            Disconnect Protection
          </p>
          <p className='text-[15px] leading-5 font-medium text-lighterAluminum'>
            Improve viewer experience during connection issues. If your main
            stream gets interrupted, a placeholder image will be shown for up to
            90 seconds while you fix the issue and reconnect. Note: A reliable
            encoder is required for this feature to work.
          </p>
        </div>

        <Toggle
          state={formState.protectionOfDisconnection}
          onChange={(isActive) =>
            setFormState((prev) => ({
              ...prev,
              protectionOfDisconnection: isActive,
            }))
          }
        />
      </div>
      <div className='flex items-center justify-end py-4 '>
        <div className='w-[180px]'>
          <StartStreamBtn />
        </div>
      </div>
    </Paper>
  );
};

export default KeyAnnStreamSettings;
