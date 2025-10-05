'use client';

import Button from '@/components/ui/Button/Button';
import Paper from '@/components/ui/Paper/Paper';
import { Toggle } from '@/components/ui/Toogle/Toogle';
import { patchUserDataType, UserService } from '@/services/UserService';
import { useMutation } from '@tanstack/react-query';
import { FC, useEffect, useState } from 'react';

interface StreamingDescriptionProps {
  initialDescription?: string;
}
const initialState = {
  userDescription: '',
  extensions: false,
};
export const StreamingDescription: FC<StreamingDescriptionProps> = ({
  initialDescription,
}) => {
  const [formState, setFormState] = useState(initialState);

  const { mutateAsync: patchUserData } = useMutation({
    mutationFn: (userData: patchUserDataType) =>
      UserService.patchProfile(userData),
  });

  const handleDescriptionBlur = () => {
    if (formState.userDescription) {
      patchUserData({ description: formState.userDescription });
    }
  };

  const handleReset = () => {
    setFormState(initialState);
  };

  useEffect(() => {
    if (!initialDescription) return;
    setFormState((prev) => ({
      ...prev,
      userDescription: initialDescription,
    }));
  }, [initialDescription]);

  return (
    <Paper className='flex flex-col gap-5 p-4'>
      <div className='flex flex-col gap-2'>
        <p className='text-2xl font-semibold'>Channel description</p>
        <textarea
          placeholder='Add description'
          className='custom-bg-blur rounded-lg p-4 outline-none max-h-[115px] resize-none border-[1px] border-regaliaPurple'
          value={formState.userDescription}
          onChange={(event) =>
            setFormState((prev) => ({
              ...prev,
              userDescription: event.target.value,
            }))
          }
          onBlur={handleDescriptionBlur}
        />

        <p className='text-[15px] leading-5 font-medium text-lighterAluminum'>
          Your channel description must be more than 300 characters long
        </p>
      </div>

      <div className='flex gap-2'>
        <Toggle
          state={formState.extensions}
          onChange={(isActive) =>
            setFormState((prev) => ({ ...prev, extensions: isActive }))
          }
        />
        <p className='text-[15px] font-semibold'>Enable Extensions</p>
      </div>

      <div className='flex flex-col gap-1'>
        <p className='text-[15px] leading-5 font-medium'>
          Engage your community with interactive stream extensions
        </p>
        <p className='text-[15px] leading-5 font-medium text-lighterAluminum'>
          To keep your audience engaged and attract new subscribers, you should
          constantly explore new ways to interact. On your channel, you can use
          extensions — mini-apps built for live streams — to let your community
          interact with you, with each other, or with what’s happening on screen
        </p>
      </div>

      <div className='flex items-center justify-end gap-6'>
        <Button
          ghost
          className='w-[180px] text-foreground'
          onClick={handleReset}
        >
          Reset
        </Button>
        <Button className='w-[180px]' disabled={!formState.userDescription}>
          Save Changes
        </Button>
      </div>
    </Paper>
  );
};
