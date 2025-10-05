'use client';
import { FC } from 'react';
import RevenueCard from '@/components/RevenueCard/RevenueCard';
import LiveStreamingCard from '@/components/LiveStreamingCard/LiveStreamingCard';
import AIAssistantCard from '@/components/AIAssistantCard/AIAssistantCard';
import SocialNetworkCard from '@/components/SocialNetworkCard/SocialNetworkCard';
import SocialLifeCard from '@/components/SocialLifeCard/SocialLifeCard';
import MarketplaceCard from '@/components/MarketplaceCard/MarketplaceCard';
import WithdrawsPurchasesCard from '@/components/WithdrawsPurchases/WithdrawsPurchases';
import FollowingOnMarketplaceCard from '@/components/FollowingDashboardCards/FollowingOnMarketPlace';
import FollowingGroupChatsCard from '@/components/FollowingDashboardCards/FollowingGroupChats';
import FollowingPortfoliosCard from '@/components/FollowingDashboardCards/FollowingPortfolios';

const DashboardScreen: FC = () => {
    return (
        <div className='flex flex-col gap-[24px] ml-[46px] mr-[24px]'>
            <div className='grid grid-cols-4 gap-[20px]'>
                <RevenueCard />
                <LiveStreamingCard />
                <AIAssistantCard />
                <SocialNetworkCard />
            </div>
            <div className='grid grid-cols-3 gap-[20px]'>
                <WithdrawsPurchasesCard />
                <SocialLifeCard />
                <MarketplaceCard />
            </div>
            <div className='grid grid-cols-3 gap-[20px]'>
                <FollowingOnMarketplaceCard />
                <FollowingPortfoliosCard />
                <FollowingGroupChatsCard />
            </div>
        </div>
    );
};

export default DashboardScreen;
