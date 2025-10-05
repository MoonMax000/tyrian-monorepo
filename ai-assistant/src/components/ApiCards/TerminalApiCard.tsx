'use client';
import Button from '@/components/ui/Button/Button';
import Paper from '@/components/ui/Paper/Paper';
import { FC } from 'react';
import PlusIcon from '@/assets/system-icons/plus.svg';

type ApiKeyRow = {
    name: string;
    purpose: string;
    apiKey: string;
    permissions: string;
    dateCreated: string;
};

const apiKeys: ApiKeyRow[] = [
    {
        name: 'BOT',
        purpose: 'API Trading',
        apiKey: 'c7bse*****',
        permissions: 'Read, Trade',
        dateCreated: '13.06.25 at 12:49:30',
    },
    {
        name: 'BOT2',
        purpose: 'API Trading',
        apiKey: '6676c*****',
        permissions: 'Read, Trade',
        dateCreated: '8.06.25 at 18:57:54',
    },
    {
        name: 'Finandy FastApiKey',
        purpose: 'Linking third-party app',
        apiKey: 'f8a2f*****',
        permissions: 'Read, Trade',
        dateCreated: '2.06.25 at 21:56:14',
    },
];

const TerminalApiCard: FC = () => {
    return (
        <Paper className='flex-1 flex-col gap-[24px] p-4'>
            <div className='relative flex-1 flex flex-col justify-start overflow-hidden'>
                <div className='flex justify-between items-center'>
                    <div className='flex flex-col gap-[8px]'>
                        <div className='font-bold text-[24px]'>Terminal API</div>
                        <div className='font-[500] text-[15px]'>Create API key ti suit your trading needs. For your seciruty, don’t share your API key with anyone.</div>
                    </div>
                    <Button className='w-[180px] h-[40px] p-[10px] rounded-[8px] gap-[4px]'><PlusIcon className='w-[20px] h-[20px]' /> Create API key</Button>
                </div>
                <div className='border-t border-regaliaPurple opacity-40 my-2'></div>
            </div>

            <div className='w-full overflow-x-auto'>
                <div className='grid grid-cols-[1.7fr_1.8fr_1.6fr_1.3fr_1.8fr_1.7fr] text-[12px] text-lighterAluminum font-bold uppercase mb-2'>
                    <div>API KEY NAME</div>
                    <div>PURPOSE</div>
                    <div>API KEY</div>
                    <div>PERMISSIONS</div>
                    <div>DATE CREATED</div>
                    <div className='text-right'>ACTION</div>
                </div>
                {apiKeys.map((row, idx) => (
                    <div
                        key={idx}
                        className='grid grid-cols-[1.7fr_1.8fr_1.6fr_1.3fr_1.8fr_1.2fr] items-center py-2 text-[15px]'
                    >
                        <div className='font-[500]'>{row.name}</div>
                        <div className='font-bold'>{row.purpose}</div>
                        <div className='font-[500]'>{row.apiKey}</div>
                        <div className='font-[500]'>{row.permissions}</div>
                        <div className='font-[500]'>{row.dateCreated}</div>
                        <div className="flex gap-4 justify-end items-center">
                            {row.purpose === "Linking third-party app" ? (
                                <>
                                    <button className="text-lightPurple font-bold opacity-0 select-none pointer-events-none">View</button>
                                    <div className="w-px h-4 bg-gunpowder opacity-0" />
                                    <button className="text-lightPurple font-bold opacity-0 select-none pointer-events-none">Edit</button>
                                    <div className="w-px h-4 bg-gunpowder opacity-0" />
                                    <button className="text-red font-bold hover:underline transition">Delete</button>
                                </>
                            ) : (
                                <>
                                    <button className="text-lightPurple font-bold hover:underline transition">View</button>
                                    <div className="w-px h-4 bg-gunpowder" />
                                    <button className="text-lightPurple font-bold hover:underline transition">Edit</button>
                                    <div className="w-px h-4 bg-gunpowder" />
                                    <button className="text-red font-bold hover:underline transition">Delete</button>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </Paper>
    );
};

export default TerminalApiCard;