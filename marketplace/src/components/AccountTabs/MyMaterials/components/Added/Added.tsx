import { FC, ReactNode } from 'react';
import CopyIcon from '@/assets/icons/actions/copy.svg';
import TrashIcon from '@/assets/icons/actions/trash.svg';
import PenIcon from '@/assets/icons/profile/pen.svg';
import Button from '@/components/UI/Button/Button';
import HorizontalGradient from '@/components/UI/gradients/HorizontalGradient';
import MaterialAddEl from './AddedEl';
import Pagination from '@/components/UI/Pagination';
import { MaterialAdd, TMaterialActionsAdd } from './type';

const actions: Record<TMaterialActionsAdd, ReactNode> = {
  copy: (
    <Button variant='gray'>
      <CopyIcon width={20} height={20} />
    </Button>
  ),
  del: (
    <Button variant='danger'>
      <TrashIcon width={20} height={20} />
    </Button>
  ),
  edit: (
    <Button variant='gray'>
      <PenIcon width={20} height={20} />
    </Button>
  ),
};

const materials: MaterialAdd[] = [
  {
    type: 'signals',
    name: 'Momentum Breakout: Signals with 65% accuracy',
    publishStatus: 'Published',
    publishDate: '14 May 2025',
    views: '1,000',
    actions: ['copy', 'del'],
  },
  {
    type: 'Script',
    name: 'RiskMaster - Trading risk calculation script',
    publishStatus: 'Published',
    publishDate: '14 May 2025',
    views: '0',
    actions: ['edit', 'del'],
  },
  {
    type: 'Script',
    name: 'RiskMaster - Trading risk calculation script',
    publishStatus: 'Draft',
    publishDate: '14 May 2025',
    views: '1,000,000',
    actions: ['edit', 'del'],
  },
  {
    type: 'signals',
    name: 'Momentum Breakout: Signals with 65% accuracy',
    publishStatus: 'Published',
    publishDate: '14 May 2025',
    views: '1,000',
    actions: ['copy', 'del'],
  },
  {
    type: 'Script',
    name: 'RiskMaster - Trading risk calculation script',
    publishStatus: 'Published',
    publishDate: '14 May 2025',
    views: '0',
    actions: ['edit', 'del'],
  },
  {
    type: 'Script',
    name: 'RiskMaster - Trading risk calculation script',
    publishStatus: 'Draft',
    publishDate: '14 May 2025',
    views: '1,000,000',
    actions: ['edit', 'del'],
  },
  {
    type: 'signals',
    name: 'Momentum Breakout: Signals with 65% accuracy',
    publishStatus: 'Published',
    publishDate: '14 May 2025',
    views: '1,000',
    actions: ['copy', 'del'],
  },
  {
    type: 'Script',
    name: 'RiskMaster - Trading risk calculation script',
    publishStatus: 'Published',
    publishDate: '14 May 2025',
    views: '0',
    actions: ['edit', 'del'],
  },
  {
    type: 'Script',
    name: 'RiskMaster - Trading risk calculation script',
    publishStatus: 'Draft',
    publishDate: '14 May 2025',
    views: '1,000,000',
    actions: ['edit', 'del'],
  },
  {
    type: 'signals',
    name: 'Momentum Breakout: Signals with 65% accuracy',
    publishStatus: 'Published',
    publishDate: '14 May 2025',
    views: '1,000',
    actions: ['copy', 'del'],
  },
  {
    type: 'Script',
    name: 'RiskMaster - Trading risk calculation script',
    publishStatus: 'Published',
    publishDate: '14 May 2025',
    views: '0',
    actions: ['edit', 'del'],
  },
  {
    type: 'Script',
    name: 'RiskMaster - Trading risk calculation script',
    publishStatus: 'Draft',
    publishDate: '14 May 2025',
    views: '1,000,000',
    actions: ['edit', 'del'],
  },
  {
    type: 'signals',
    name: 'Momentum Breakout: Signals with 65% accuracy',
    publishStatus: 'Published',
    publishDate: '14 May 2025',
    views: '1,000',
    actions: ['copy', 'del'],
  },
  {
    type: 'Script',
    name: 'RiskMaster - Trading risk calculation script',
    publishStatus: 'Published',
    publishDate: '14 May 2025',
    views: '0',
    actions: ['edit', 'del'],
  },
  {
    type: 'Script',
    name: 'RiskMaster - Trading risk calculation script',
    publishStatus: 'Draft',
    publishDate: '14 May 2025',
    views: '1,000,000',
    actions: ['edit', 'del'],
  },
];

const MyMaterialsAdd: FC = () => {
  return (
    <div>
      <div className='flex flex-col gap-4'>
        {materials.map((el, index) => (
          <HorizontalGradient key={index}>
            <MaterialAddEl material={el} actions={actions} />
          </HorizontalGradient>
        ))}
      </div>
      <div className='flex justify-center items-center mt-12 mb-[80px]'>
        <Pagination totalPages={4} currentPage={1} onChange={() => {}} />
      </div>
    </div>
  );
};

export default MyMaterialsAdd;
