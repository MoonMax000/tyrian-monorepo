import { FC, FormEvent, useState } from 'react';

import { BecomeStreamerBody, UserService } from '@/services/UserService';
import { useMutation } from '@tanstack/react-query';

import Button from '@/components/ui/Button/Button';
import Textarea from '@/components/ui/Textarea';
import { Input } from '@/components/ui/Input';
import Paper from '@/components/ui/Paper/Paper';
import { REGULAR_EXPRESSIONS } from '@/constants/regular';

interface FormState {
  email: string;
  description: string;
}

interface Props {
  onClose: () => void;
}

const BecomeStreamer: FC<Props> = ({ onClose }) => {
  const [formState, setFormState] = useState<FormState>({
    email: '',
    description: '',
  });
  const [errors, setErrors] = useState<FormState>({
    email: '',
    description: '',
  });

  const { mutateAsync: becomeStreamerMutate, isPending } = useMutation({
    mutationFn: (body: BecomeStreamerBody) => UserService.becomeStreamer(body),
  });

  const validateEmail = (email: string): boolean => {
    return REGULAR_EXPRESSIONS.email.test(email);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    let errorsCount = 0;

    if (!formState.email) {
      errorsCount += 1;
      setErrors((prev) => ({
        ...prev,
        email: 'Required field',
      }));
    } else if (!validateEmail(formState.email)) {
      errorsCount += 1;
      setErrors((prev) => ({ ...prev, email: 'Invalid email' }));
    }

    if (!formState.description) {
      errorsCount += 1;
      setErrors((prev) => ({
        ...prev,
        description: 'Required field',
      }));
    }

    if (errorsCount > 0) {
      return;
    }

    try {
      const { data } = await becomeStreamerMutate({
        additional_text: formState.description,
        email: formState.email,
      });
      if (data) {
        onClose();
      }
    } catch {
      alert('Something went wrong');
    }
  };

  const handleChange = (value: string, key: keyof FormState) => {
    setErrors({} as FormState);
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Paper className='p-4 flex flex-col gap-[10px] w-[512px]  l'>
      <h2 className='text-2xl font-semibold'>Become a Streamer</h2>
      <form onSubmit={handleSubmit}>
        <Input
          label='Email'
          placeholder='Enter Your Email'
          className='mb-[10px]'
          onChange={(event) => handleChange(event.target.value, 'email')}
          value={formState.email}
          error={errors.email}
        />
        <Textarea
          value={formState.description}
          label='Additional Text'
          placeholder='A few words about yourself'
          onChange={(event) => {
            if (event.target.value.length <= 300) {
              handleChange(event.target.value, 'description');
            }
          }}
          labelClassName='max-tablet:hidden'
          error={errors.description}
        />

        <Button
          type='submit'
          className='h-[26px] w-full mt-10 mx-auto'
          disabled={
            !formState.email ||
            !formState.description ||
            Object.keys(errors).length > 0 ||
            isPending
          }
        >
          Submit
        </Button>
      </form>
    </Paper>
  );
};

export default BecomeStreamer;
