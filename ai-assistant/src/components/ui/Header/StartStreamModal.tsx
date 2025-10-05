'use client';

import IconSearch from '@/assets/search.svg';
import { FC, FormEvent, useEffect, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { UserService } from '@/services/UserService';
import {
  ICategory,
  RecomendationService,
} from '@/services/RecomendationService';
import { Select } from '../Select';
import Button from '../Button/Button';
import Textarea from '../Textarea';
import { StreamService, IStartStream } from '@/services/StreamService';
import Paper from '../Paper/Paper';
import { Input } from '../Input';
import Checkbox from '../Checkbox/Checkbox';

interface IStartStreamFormState {
  name: string;
  notification: string;
  category?: string;
  tags: string[];
  saveStream: boolean;
}

const StartStreamModal: FC<{ closeModal: () => void }> = () => {
  const [formState, setFormState] = useState<IStartStreamFormState>({
    name: '',
    notification: '',
    category: '',
    tags: [],
    saveStream: false,
  });

  const { data: profileData } = useQuery({
    queryKey: ['fullProfile'],
    queryFn: () => UserService.getProfile(),
  });

  const { mutateAsync: startStream } = useMutation({
    mutationKey: ['startStreamModal'],
    mutationFn: (body: IStartStream) => StreamService.startStream(body),
  });

  const { mutateAsync: stopStream } = useMutation({
    mutationKey: ['stopStream'],
    mutationFn: () => StreamService.endStream(),
  });

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => RecomendationService.getCategories(),
  });

  const handleTagsChange = (text: string) => {
    const parts = text.split(' ');
    const tags = parts.slice(0, -1).filter((tag) => tag.trim() !== '');
    const draft = parts[parts.length - 1];

    setFormState((prev) => ({
      ...prev,
      tags: [...tags, draft],
    }));
  };

  useEffect(() => {
    stopStream();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const startStreamBody: IStartStream = {
      translation_category: formState.category || '',
      translation_name: formState.name,
      translation_notify_message: formState.notification,
      translation_tags: formState.tags,
      // save_stream: formState.saveStream,
    };

    const res = await startStream(startStreamBody);

    if (res && profileData?.id) {
      const baseUrl =
        process.env.NEXT_PUBLIC_STREAMING_URL ||
        'https://streaming.tyriantrade.com';

      window.location.href = `${baseUrl}/video/${profileData.id}`;
    }
  };

  return (
    <Paper className='rounded-[24px] p-[24px] gap-[24px] flex flex-col max-w-[512px] mx-auto'>
      <form onSubmit={handleSubmit}>
        <div className='flex flex-col gap-4 '>
          <div>
            <Textarea
              value={formState.name}
              label='Title'
              placeholder='Enter a name for your broadcast'
              onChange={(event) => {
                if (event.target.value.length < 140) {
                  setFormState((prev) => ({
                    ...prev,
                    name: event.target.value,
                  }));
                }
              }}
            />
            <span className='text-[14px] leading-5 font-semibold opacity-40 float-right'>
              {formState.name.length}/140
            </span>
          </div>

          <div>
            <Textarea
              value={formState.notification}
              label='Notification'
              placeholder='Enter the notification text that your followers will receive'
              onChange={(event) => {
                if (event.target.value.length < 140) {
                  setFormState((prev) => ({
                    ...prev,
                    notification: event.target.value,
                  }));
                }
              }}
            />
            <span className='text-[14px] leading-5 font-semibold opacity-40 float-right'>
              {formState.notification.length}/140
            </span>
          </div>

          <Select
            placeholder='Select category'
            options={(categoriesData || []).map((cat: ICategory) => ({
              label: cat.name,
              value: cat.name,
            }))}
            value={formState.category}
            onChange={(option) =>
              setFormState((prev) => ({
                ...prev,
                category: String(option.value),
              }))
            }
          />

          <div>
            <Input
              label='Tags'
              placeholder='Use space to separate tags'
              value={formState.tags.join(' ')}
              onChange={(e) => handleTagsChange(e.target.value)}
              leftIcon={<IconSearch className='w-6 h-6' />}
            />

            <p className='text-sm font-semibold opacity-40 mt-2'>
              Add up to 10 tags. Each tag can be up to 25 characters long and
              must not contain spaces or special characters
            </p>
          </div>

          <Checkbox
            checked={formState.saveStream}
            onChange={(checked) =>
              setFormState((prev) => ({
                ...prev,
                saveStream: checked,
              }))
            }
            label='Save stream after broadcast ends?'
          />
        </div>

        <Button
          type='submit'
          className='flex items-center mt-10 w-[240px] h-11 py-[15px] px-6 mx-auto'
        >
          <span>Start Broadcast</span>
        </Button>
      </form>
    </Paper>
  );
};

export default StartStreamModal;
