import Paper from '../ui/Paper/Paper';
import { FC, useState } from 'react';
import { SocialLifeGroupsTab } from './SocialLifeGroupsTab';
import { IndicatorTag } from '../ui/IndicatorTag/IndicatorTag';
import Tabs from '../ui/TabsSwitcher/TabsSwitcher';

const tabNames = ['Posts', 'Chats', 'Groups', 'Streams'];

const SocialLifeCard: FC = () => {
    const [activeTab, setActiveTab] = useState(tabNames[2]);

    const renderTabContent = () => {
        switch (activeTab) {
            case 'Posts':
                return <SocialLifeGroupsTab />;
            case 'Chats':
                return <SocialLifeGroupsTab />;
            case 'Groups':
                return <SocialLifeGroupsTab />;
            case 'Streams':
                return <SocialLifeGroupsTab />;
            default:
                return <SocialLifeGroupsTab />;
        }
    };
    return (
        <Paper className={'p-4 rounded-[24px] gap-[16px]'}>
            <div className='flex flex-col h-full'>
                <div className='flex-1 flex flex-col justify-start overflow-hidden'>
                    <div className='flex justify-between'>
                        <div className='text-white font-bold text-[24px]'>My Social Life</div>
                        <IndicatorTag type='purple' className='flex items-center text-[12px] font-bold py-[2px] px-[4px]'>19 new interactions</IndicatorTag>
                    </div>
                    <div className='border-t border-regaliaPurple opacity-40 my-2'></div>
                </div>
                <div className='flex justify-between items-center mb-[16px]'>
                    <Tabs
                        tabs={tabNames}
                        onChange={setActiveTab}
                        defaultIndex={2}
                        className='w-[80px]'
                    />
                    <div className='text-[15px] font-bold text-lightPurple underline'>View all</div>
                </div>
                {renderTabContent()}

            </div>
        </Paper>
    );
};

export default SocialLifeCard;