import { FC, ReactNode } from 'react';
import { cn } from '@/utils/cn';
import { MaterialAdd, TMaterialActionsAdd } from './type';

interface Props {
  material: MaterialAdd;
  actions: Record<TMaterialActionsAdd, ReactNode>;
}

const MaterialAddEl: FC<Props> = ({ material, actions }) => {
  return (
    <div className='grid grid-cols-[60%,40%]'>
      <div className='flex flex-col gap-2'>
        <h3 className='text-xs font-bold text-purple uppercase'>{material.type}</h3>
        <p className='text-body-15'>{material.name}</p>
      </div>
      <div className='flex justify-between items-center'>
        <div className='flex gap-6'>
          <div className='flex flex-col gap-2'>
            <h3
              className={cn('font-semibold text-xs uppercase', {
                ['text-green']: material.publishStatus === 'Published',
                ['text-webGray']: material.publishStatus === 'Draft',
              })}
            >
              {material.publishStatus}
            </h3>
            <p>{material.publishDate}</p>
          </div>
          <div className='flex flex-col gap-2'>
            <h3 className='text-body-12 uppercase text-webGray'>views</h3>
            <p>{material.views}</p>
          </div>
        </div>
        <div className='flex gap-4'>
          {material.actions &&
            material.actions.map((action) => <div key={action}>{actions[action]}</div>)}
        </div>
      </div>
    </div>
  );
};

export default MaterialAddEl;
