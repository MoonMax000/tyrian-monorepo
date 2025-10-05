import Paper from '../ui/Paper/Paper';
import { FC, useState } from 'react';
import { IndicatorTag } from '../ui/IndicatorTag/IndicatorTag';
import { PurchasesTab } from './PurchasesTab';
import { WithdrawsTab } from './WithdrawsTab';
import Tabs from '../ui/TabsSwitcher/TabsSwitcher';

const tabNames = ['Withdraws', 'Purchases'];

const WithdrawsPurchasesCard: FC = () => {
    const [activeTab, setActiveTab] = useState(tabNames[1]);

    const renderTabContent = () => {
        switch (activeTab) {
            case 'Withdraws':
                return <WithdrawsTab />;
            case 'Purchases':
                return <PurchasesTab />;
            default:
                return null;
        }
    };
    return (
        <Paper className={'p-4 rounded-[24px] gap-[16px]'}>
            <div className='flex flex-col h-full'>
                <div className='flex-1 flex flex-col justify-start overflow-hidden'>
                    <div className='flex justify-between'>
                        <div className='text-white font-bold text-[24px]'>My Withdraws & Purchases</div>
                        <IndicatorTag type='darckGreen' className='flex items-center text-[12px] font-bold py-[2px] px-[4px]'>Live</IndicatorTag>
                    </div>
                    <div className='border-t border-regaliaPurple opacity-40 my-2'></div>
                </div>
                <div className='flex justify-between items-center mb-[16px]'>
                    <Tabs
                        tabs={tabNames}
                        onChange={setActiveTab}
                        defaultIndex={1}
                        className='w-[96px] text-white'
                    />
                    <div className='text-[15px] font-bold text-lightPurple underline'>View all</div>
                </div>
                {renderTabContent()}

            </div>
        </Paper>
    );
};

export default WithdrawsPurchasesCard;