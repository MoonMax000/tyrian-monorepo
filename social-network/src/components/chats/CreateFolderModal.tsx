import { FC } from "react";
import { Button } from "../UI/Button";

interface CreateFolderModalProps {
    onClick: () => void;
}

export const CreateFolderModal: FC<CreateFolderModalProps> = ({ onClick }) => {
    return (
        <div>
            <div className='flex flex-col w-[468px] rounded-[8px] bg-blackedGray py-1'>
                <div className="flex justify-between px-[24px] pt-[24px] pb-[16px] text-[24px] font-bold border-b border-onyxGrey">
                    Create Folder
                </div>
                <div className="flex flex-col p-[24px] gap-[8px] border-b border-onyxGrey">
                    <p className="text-[12px] font-bold">Folder Name</p>
                    <input
                        placeholder="Example: Personal"
                        className="w-full px-[16px] py-[12px] h-11 bg-moonlessNight rounded-lg focus:outline-none text-[15px] text-webGray placeholder-webGray"
                    />
                    <p className="text-[12px] text-webGray font-bold">Maximum length - 16 symbols</p>
                </div>
                <div className='px-[24px] py-[16px]'>
                    <Button onClick={onClick} className='w-full bg-purple text-white font-semibold px-6 py-2 rounded-md'>
                        Create
                    </Button>
                </div>
            </div>
        </div>
    )
}