import Paper from '../ui/Paper/Paper';
import { FC, useState } from 'react';
import { MarketplaceNewTab } from './MarketplaceNewTab';
import { IndicatorTag } from '../ui/IndicatorTag/IndicatorTag';
import Tabs from '../ui/TabsSwitcher/TabsSwitcher';

const tabNames = ['New', 'Top', 'All'];

const MarketplaceCard: FC = () => {
    const [selectedTab, setSelectedTab] = useState(tabNames[0]);

    const renderTabContent = () => {
        switch (selectedTab) {
            case 'New':
                return <MarketplaceNewTab />;
            case 'Top':
                return <MarketplaceNewTab />;
            case 'All':
                return <MarketplaceNewTab />;
            default:
                return <MarketplaceNewTab />;
        }
    };
    return (
        <Paper className={'p-4 rounded-[24px] gap-[16px]'}>
            <div className='flex flex-col h-full'>
                <div className='flex-1 flex flex-col justify-start overflow-hidden'>
                    <div className='flex justify-between'>
                        <div className='text-white font-bold text-[24px]'>My Marketplace</div>
                        <IndicatorTag type='darckGreen' className='flex items-center text-[12] font-800 py-[2px] px-[4px] text-[12px] font-bold'>3 new sales</IndicatorTag>
                    </div>
                    <div className='border-t border-regaliaPurple opacity-40 my-2'></div>
                </div>
                <div className='flex justify-between items-center mb-[16px]'>
                    <Tabs
                        tabs={tabNames}
                        onChange={setSelectedTab}
                        defaultIndex={0}
                        className='w-[80px]'
                    />
                    <div className='text-[15px] font-bold text-lightPurple underline'>View all</div>
                </div>
                {renderTabContent()}

            </div>
        </Paper>
    );
};

export default MarketplaceCard;