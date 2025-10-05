import BaseSelector from './Base';

interface InteractiveDropdownProps {
  className?: string;
  defaultValue: string;
  onSelect?: (arg: CreateProductOptions) => void;
}

export type CreateProductOptions =
  | 'Signal'
  | 'Technical Indicator'
  | 'Investment consultant'
  | 'Analyst/Trader'
  | 'Script'
  | 'Course'
  | 'Robot'
  | 'Algorithm'
  | 'Other';

const workflowOptions = [
  'Signal',
  'Technical Indicator',
  'Investment consultant',
  'Analyst/Trader',
  'Script',
  'Course',
  'Robot',
  'Algorithm',
  'Other',
];

const InteractiveDropdown = ({ className, defaultValue, onSelect }: InteractiveDropdownProps) => {
  return (
    <div
      className={`z-[1000] custom-bg-blur relative px-4 py-4 border border-regaliaPurple rounded-[24px] ${className}`}
    >
      <div className='mb-4'>
        <span className='font-semibold text-[24px] text-white'>Creating new product</span>
      </div>

      <div className='mb-2'>
        <span className='text-lighterAluminum text-body-12 font-semibold tracking-wide uppercase'>
          Choose Product
        </span>
      </div>

      <BaseSelector onSelect={onSelect} options={workflowOptions} defaultValue={defaultValue} />
    </div>
  );
};

export default InteractiveDropdown;
