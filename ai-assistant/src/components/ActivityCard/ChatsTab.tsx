import { FC } from 'react';
import ApprovalPic from '@/assets/mock-avatars/ActivityChatsApproval.jpg';
import AskJanePic from '@/assets/mock-avatars/ActivityChatsAskJane.jpg';
import CryptoBasicsPic from '@/assets/mock-avatars/ActivityChatsCryptoBasics.jpg';
import FedPolicyPic from '@/assets/mock-avatars/ActivityChatsFedPolicy.jpg';
import MacroOutlook from '@/assets/mock-avatars/ActivityChatsMacroOutlook.jpg';
import Image from 'next/image';

const chatsList = [
    { id: 1, img: MacroOutlook, title: "Macro Outlook 2025", subscribers: "823 subscribers" },
    { id: 2, img: CryptoBasicsPic, title: "Crypto Basics - Live Q&A", subscribers: "823 subscribers" },
    { id: 3, img: FedPolicyPic, title: "Fed Policy & Inflation", subscribers: "823 subscribers" },
    { id: 4, img: AskJanePic, title: "Ask Jane: Portfolio Diversification", subscribers: "823 subscribers" },
    { id: 5, img: ApprovalPic, title: "ETH ETF Approval: What’s Next?", subscribers: "823 subscribers" },
]

export const ChatsTab: FC = () => {
    return (
        <div className='flex flex-col gap-[20px] mt-2'>
            {chatsList.map((chat) => {
                return (
                    <div key={chat.id} className='flex items-center justify-start'>
                        <Image src={chat.img} alt='Chat Photo' className='w-[44px] h-[44px] rounded-[50px] mr-2' priority />
                        <div className='flex flex-col'>
                            <span className='text-white text-[15px] font-bold'>{chat.title}</span>
                            <span className='text-lighterAluminum text-[12px] font-bold'>{chat.subscribers}</span>
                        </div>
                    </div>
                )
            })}
        </div>
    );
}