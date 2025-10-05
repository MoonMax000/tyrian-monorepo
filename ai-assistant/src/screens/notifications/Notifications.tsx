'use client';
import FavouriteProductsCard from '@/components/NotigicationsCard/FavouriteProductsCard';
import FollowingAuthorsCard from '@/components/NotigicationsCard/FollowingAuthorsCard';
import FollowingIdeasCard from '@/components/NotigicationsCard/FollowingIdeasCard';
import IdeasCard from '@/components/NotigicationsCard/IdeasCard';
import NotificationsCard from '@/components/NotigicationsCard/NotificationsCard';
import OpinionsCard from '@/components/NotigicationsCard/OpinionsCard';
import ProfileCard from '@/components/NotigicationsCard/ProfileCard';
import Button from '@/components/ui/Button/Button';
import { FC } from 'react';

const NotificationsScreen: FC = () => {
    return (
        <>
        <div className='flex flex-col gap-[4px] mt-[4px]'>
            <NotificationsCard />
            <ProfileCard />
            <IdeasCard />
            <FollowingAuthorsCard />
            <FollowingIdeasCard />
            <FavouriteProductsCard />
            <OpinionsCard />
        </div>
        <div className='flex justify-end gap-[16px] mt-[24px]'>
            <Button ghost={true} className='backdrop-blur-[100px] py-[12px] px-[16px] text-white'>Unsubscribe from all</Button>
            <Button className='w-[180px] h-[44px] p-[10px]'>Save changes</Button>
        </div>
        </>
    );
};

export default NotificationsScreen;
