import clsx from 'clsx';
import type { DetailedHTMLProps, FC, TextareaHTMLAttributes } from 'react';

interface TextareaProps
  extends DetailedHTMLProps<TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement> {
  label?: string;
  wrapperClassName?: string;
}

const Textarea: FC<TextareaProps> = ({ className, wrapperClassName, ...rest }) => {
  return (
    <div className={clsx('w-full', wrapperClassName)}>
      <textarea
        className={clsx(
          className,
          `w-full bg-background rounded-lg border-[1px] border-regaliaPurple min-h-[80px] p-4 resize-none 
          text-body-15
          placeholder:text-[15px] placeholder:leading-5 placeholder:font-bold placeholder:opacity-[48%] 
          placeholder:transition-opacity 
          focus:placeholder:opacity-0`,
        )}
        {...rest}
      />
    </div>
  );
};

export default Textarea;
