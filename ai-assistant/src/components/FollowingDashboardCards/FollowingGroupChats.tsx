import Paper from '../ui/Paper/Paper';
import { FC } from 'react';
import Button from '../ui/Button/Button';
import Image from 'next/image';
import ChatsIcon from '@/assets/Navbar/SocialNetwork.svg';
import ApprovalPic from '@/assets/mock-avatars/ActivityChatsApproval.jpg';
import AskJanePic from '@/assets/mock-avatars/ActivityChatsAskJane.jpg';
import CryptoBasicsPic from '@/assets/mock-avatars/ActivityChatsCryptoBasics.jpg';
import FedPolicyPic from '@/assets/mock-avatars/ActivityChatsFedPolicy.jpg';
import MacroOutlook from '@/assets/mock-avatars/ActivityChatsMacroOutlook.jpg';

const chatsList = [
    { id: 1, img: CryptoBasicsPic, title: "Crypto Basics - Live Q&A", subscribers: "72 subscribers" },
    { id: 2, img: MacroOutlook, title: "Macro Outlook 2025", subscribers: "2,369 subscribers" },
    { id: 3, img: AskJanePic, title: "Ask Jane: Portfolio Diversification", subscribers: "86 subscribers" },
    { id: 4, img: FedPolicyPic, title: "Fed Policy & Inflation", subscribers: "823 subscribers" },
    { id: 5, img: ApprovalPic, title: "ETH ETF Approval: What’s Next?", subscribers: "72 subscribers" },
]

const FollowingGroupChatsCard: FC = () => {
    return (
        <Paper className={'p-4 rounded-[24px]'}>
            <div className='flex flex-col'>
                <div className='flex flex-col justify-start overflow-hidden'>
                    <div className='text-white font-bold text-[24px]'>Following Group Chats</div>
                    <div className='border-t border-regaliaPurple opacity-40 my-2'></div>
                </div>
                <div className='flex flex-col gap-[16px] my-[12px]'>
                    {chatsList.map(({ id, img, title, subscribers }) => {
                        return (
                            <div key={id} className='flex items-center justify-start'>
                                <Image src={img} alt='Chat Photo' className='w-[44px] h-[44px] rounded-[50px] object-cover mr-2' priority />
                                <div className='flex flex-col'>
                                    <span className='text-lightPurple text-[15px] font-bold'>{title}</span>
                                    <span className='text-lighterAluminum text-[12px] font-bold'>{subscribers}</span>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <Button className='text-white text-[15px] font-bold gap-[4px] px-[16px] py-[10px] mt-[16px]'> <ChatsIcon className='w-[20px] h-[20px]' /> View Purchases</Button>
            </div>
        </Paper>
    );
};

export default FollowingGroupChatsCard;