import { FC } from "react";
import { Button } from "../UI/Button";
import DeleteChatIcon from '@/assets/icons/chat/deleteChat.svg';

interface DeleteChatModalProps {
    type: 'chat' | 'channel';
    onClick: () => void;
}

export const DeleteChatModal: FC<DeleteChatModalProps> = ({ type, onClick }) => {
    return (
        <div>
            <div className='flex flex-col w-[468px] rounded-[8px] bg-blackedGray py-1'>
                <div className="flex flex-col px-[24px] pt-[32px] pb-[24px] text-[24px] items-center border-b border-onyxGrey">
                    <div className="mb-[24px] w-[96px] h-[96px] border border-onyxGrey rounded-full flex items-center justify-center"><DeleteChatIcon /></div>
                    <div className="text-center px-[24px] leading-[120%]">Are you sure you want to {type === 'chat' ? 'delete this chat' : 'leave this group'}?</div>
                </div>
                <div className='px-[24px] py-[16px] flex gap-[8px]'>
                    <Button onClick={onClick} className='w-full bg-onyxGrey text-white font-semibold px-6 py-2 rounded-md'>
                        Cancel
                    </Button>
                    <Button onClick={onClick} className='w-full bg-purple text-white font-semibold px-6 py-2 rounded-md'>
                        {type === 'chat' ? 'Delete' : 'Leave'}
                    </Button>
                </div>
            </div>
        </div>
    )
}