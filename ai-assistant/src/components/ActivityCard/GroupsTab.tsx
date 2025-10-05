import { FC } from 'react';
import ApprovalPic from '@/assets/mock-avatars/ActivityChatsApproval.jpg';
import AskJanePic from '@/assets/mock-avatars/ActivityChatsAskJane.jpg';
import CryptoBasicsPic from '@/assets/mock-avatars/ActivityChatsCryptoBasics.jpg';
import FedPolicyPic from '@/assets/mock-avatars/ActivityChatsFedPolicy.jpg';
import MacroOutlook from '@/assets/mock-avatars/ActivityChatsMacroOutlook.jpg';
import Image from 'next/image';


const groupsList = [
    { id: 1, img: MacroOutlook, title: "Macro Outlook 2025", message: "Jane: Start with blue chips, then explore" },
    { id: 2, img: CryptoBasicsPic, title: "Crypto Basics - Live Q&A", message: "Jane: Start with blue chips, then explore" },
    { id: 3, img: FedPolicyPic, title: "Fed Policy & Inflation", message: "Jane: Don’t underestimate a lag effect" },
    { id: 4, img: AskJanePic, title: "Ask Jane: Portfolio Diversification", message: "How many assets should I hold at once?" },
    { id: 5, img: ApprovalPic, title: "ETH ETF Approval: What’s Next?", message: "Jane: Expect a short-term rally, then corr..." },
]

export const GroupsTab: FC = () => {
    return (
        <div className='flex flex-col gap-[20px] mt-2'>
            {groupsList.map((group) => {
                return (
                    <div key={group.id} className='flex items-center justify-start'>
                        <Image src={group.img} alt='Chat Photo' className='w-[44px] h-[44px] rounded-[50px] mr-2' priority />
                        <div className='flex flex-col'>
                            <span className='text-white text-[15px] font-bold'>Macro Outlook 2025</span>
                            <span className='text-lighterAluminum text-[12px] font-bold'>“{group.message}”</span>
                        </div>
                    </div>
                )
            })}
        </div>
    );
}