'Use client';
import React from 'react';
import Image from 'next/image';
import banner from '@/assets/mock-avatars/background-image.png';
import Avatar from '../ui/Avatar/Avatar';
import GearIcon from '@/assets/system-icons/gear.svg';
import Purple4 from '@/assets/statuses/Purple4.svg';
import Check from '@/assets/system-icons/check.svg';
import SendIcon from '@/assets/system-icons/sendIcon.svg';
import DonateIcon from '@/assets/system-icons/donateIcon.svg';
import MessageIcon from '@/assets/system-icons/messageIcon.svg';
import ButtonWrapper from '../ui/ButtonWrapper/ButtonWrapper';
import StarButton from '../SubscribeButton/StarButton';
import SubscribeButton from '../ui/SubscribeButton/SubscribeButton';
import CirculeCheck from '@/assets/checks/circle_check.svg';
import { cn } from '@/utilts/cn';
import { LayoutVariant } from '../ui/AppBackground/AppBackGround';
import { IndicatorTag } from '../ui/IndicatorTag/IndicatorTag';
import Logo from '@/assets/logo.svg';
import Button from '../ui/Button/Button';
import Pensil from '@/assets/system-icons/pencil.svg';
import Plus from '@/assets/system-icons/plus.svg';
import { StartStreamBtn } from '../StartStreamBtn';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AuthService } from '@/services/AuthService';
import { getMediaUrl } from '@/utilts/helpers/getMediaUrl';
import { UserService } from '@/services/UserService';
import { RecomendationService } from '@/services/RecomendationService';

interface UserHeaderProps {
  isOwn?: boolean;
  className?: string;
  variant?: LayoutVariant;
}

const UserHeader: React.FC<UserHeaderProps> = ({
  isOwn = false,
  className = '',
  variant = 'primal',
}) => {
  const queryClient = useQueryClient();
  const { data: profileData } = useQuery({
    queryKey: ['authProfile'],
    queryFn: () => AuthService.getProfile(),
    initialData: () => queryClient.getQueryData(['authProfile']),
  });

  const { data: subscribers } = useQuery({
    queryKey: ['subscribers'],
    queryFn: () =>
      RecomendationService.getSubscribers({
        page: 1,
        page_size: 10,
        sort_by: 'username',
        sort_dir: 'asc',
      }),
  });

  const { data: subscriptions } = useQuery({
    queryKey: ['subscriptions'],
    queryFn: () => RecomendationService.getSgetSubscriptionsID(),
  });

  const profileStats = [
    { label: 'FOLLOWERS', value: subscribers?.data?.length ?? 0 },
    { label: 'FOLLOWING', value: subscriptions?.data?.data?.length ?? 0 },
    { label: 'POSTS', value: 23 },
    { label: 'PRODUCTS', value: 4 },
    { label: 'ORDERS', value: 5 },
    { label: 'CONSULTATIONS', value: 3 },
  ];

  return (
    <div
      className={cn(
        'relative z-[1] h-48 w-full rounded-[24px] border border-regaliaPurple overflow-hidden flex items-start justify-between ',
        className,
      )}
    >
      <div className='absolute w-full h-full z-[-1]'>
        <Image
          fill
          src={
            profileData?.background_image
              ? getMediaUrl(profileData.background_image)
              : banner.src
          }
          alt='cover_img'
          sizes='100%'
          className='absolute w-full h-full z-[-1] '
        />
        <div className='absolute w-full h-full z-[-1] bg-gradient-to-t from-[rgba(0,0,0,0.64)] to-[rgba(102,102,102,0)] blur-sm'></div>
      </div>

      <div className='py-4 px-6 w-full'>
        {variant === 'primal' && (
          <>
            <div className='flex items-start space-x-4 z-10'>
              <Avatar
                src={
                  profileData?.avatar
                    ? getMediaUrl(profileData.avatar)
                    : '/mock-avatars/avatar-mock.jpg'
                }
                fallback='AB'
                size='large'
              />
              <div className='ml-4 flex flex-col gap-2'>
                <div className='flex items-center space-x-2'>
                  <span className='font-bold text-[24px] leading-[24px] text-white tracking-normal'>
                    {profileData?.name}
                  </span>
                  <Check />
                </div>
                <div className='font-medium text-[15px] leading-[15px] text-white'>
                  @{profileData?.username ?? profileData?.email}
                </div>
                <div className='inline-flex items-center rounded-full px-2 py-0.5 w-auto flex-shrink-0 flex-grow-0'>
                  <span className='font-bold text-[12px] leading-[12px] text-white mr-1'>
                    TIER
                  </span>
                  <span>
                    <Purple4 width={18} height={20} />
                  </span>
                </div>
                {!isOwn && (
                  <div className='flex items-start gap-[16px] py-[16px]'>
                    <ButtonWrapper className='gap-[8px] px-[16px] py-[10px]'>
                      <MessageIcon
                        width={20}
                        height={20}
                        className={
                          'text-lighterAluminum group-hover:text-white'
                        }
                      />
                      <div className='text-[15px] font-bold'>Message</div>
                    </ButtonWrapper>
                    <ButtonWrapper className='gap-[8px] px-[16px] py-[10px]'>
                      <DonateIcon
                        width={20}
                        height={20}
                        className={
                          'text-lighterAluminum group-hover:text-white'
                        }
                      />
                      <div className='text-[15px] font-bold'>Donate</div>
                    </ButtonWrapper>
                  </div>
                )}
              </div>
            </div>
            <div className='flex items-start px-4 py-4 '>
              {isOwn && (
                <ButtonWrapper>
                  <GearIcon
                    width={20}
                    height={20}
                    className={'text-lighterAluminum hover:text-white'}
                  />
                </ButtonWrapper>
              )}
              {!isOwn && (
                <div className='flex items-start gap-[12px]'>
                  <SubscribeButton type='iconWithText' />
                  <StarButton />
                  <ButtonWrapper>
                    <SendIcon
                      width={20}
                      height={20}
                      className={'text-lighterAluminum hover:text-white'}
                    />
                  </ButtonWrapper>
                </div>
              )}
            </div>
          </>
        )}
        {variant === 'secondary' && (
          <div className='flex items-center justify-between w-full gap-24'>
            <div className='flex gap-4'>
              <Avatar
                src={
                  profileData?.avatar
                    ? getMediaUrl(profileData.avatar)
                    : '/mock-avatars/avatar-mock.jpg'
                }
                fallback='AB'
                size='large'
              />
              <div className='flex flex-col justify-between'>
                <div className='flex items-center'>
                  <p className='font-[700] text-[24px] leading-[15px] text-white mr-[6.5]'>
                    @{profileData?.username ?? profileData?.email}
                  </p>
                  <Check className='mr-[10px]' />
                  <IndicatorTag
                    type='darckGreen'
                    className='flex items-center text-[12px] font-bold gap-[5px]'
                  >
                    <CirculeCheck width={15} height={15} />
                    KYC Verified
                  </IndicatorTag>
                </div>
                <div className='flex flex-col items-center gap-3 container-card p-4 rounded-[8px]'>
                  <div className='flex gap-3 rounded-[8px]'>
                    {profileStats.map(({ label, value }) => {
                      return (
                        <div
                          key={label}
                          className='flex flex-col gap-1 pr-3 border-r-[1px] border-regaliaPurple last:border-r-0 last:pr-0'
                        >
                          <p className='uppercase text-sm font-bold'>{label}</p>
                          <p className='text-[15px] font-bold'>{value}</p>
                        </div>
                      );
                    })}
                  </div>
                  <div className='rounded-[4px] w-full h-1 bg-[linear-gradient(270deg,#FAD1FF_0%,#482090_100%)]'></div>
                </div>
                <div className='flex items-center gap-[10px]'>
                  <Logo width={18} height={20} />
                  <p className='text-[15px] font-bold'>
                    since{' '}
                    {profileData?.date_joined
                      ? new Date(profileData.date_joined).toLocaleDateString(
                          'en-US',
                          {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          },
                        )
                      : ''}
                  </p>
                </div>
              </div>
            </div>
            <div className='flex justify-end items-center'>
              <div className='grid grid-cols-2 grid-rows-2 gap-4 w-[376px]'>
                <Button
                  variant='secondary'
                  className='w-full py-2 flex gap-2 items-center'
                >
                  <Pensil width={20} height={20} /> New Post
                </Button>{' '}
                <Button
                  variant='secondary'
                  className='w-full py-2 flex gap-2 items-center'
                >
                  <Plus width={20} height={20} />
                  Add Trade
                </Button>{' '}
                <StartStreamBtn />
                <Button
                  variant='secondary'
                  className='w-full py-2 flex gap-2 items-center'
                >
                  <Plus width={20} height={20} /> Add Product
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserHeader;
