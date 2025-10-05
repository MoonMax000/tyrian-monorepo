'use client';
import { FC } from 'react';
import Paper from '@/components/ui/Paper/Paper';
import CopyIcon from '@/assets/system-icons/CopyIcon.svg';
import Button from '@/components/ui/Button/Button';
import Brown1 from '@/assets/statuses/Brown1.svg';
import Green2 from '@/assets/statuses/Green2.svg';
import Gold3 from '@/assets/statuses/Gold3.svg';
import NothingFoundIcon from '@/assets/system-icons/NothingFoundIcon.svg';

const ReferralsScreen: FC = () => {
    return (
        <Paper className='flex flex-col p-4 gap-[32px] mt-[24px]'>
            <div className='flex flex-col gap-[16px]'>
                <div className='flex flex-col gap-[8px]'>
                    <div className='text-[24px] font-bold'>Refer & Earn Big!</div>
                    <div>
                        Share your unique referral link with friends and earn rewards for each successful referral. Both you and your friend will receive bonuses when they join our platform.
                    </div>
                </div>
                <div className='flex justify-between gap-[16px]'>
                    <Paper className='flex flex-1 flex-col gap-[16px] p-4 border border-gunpowder'>
                        <div className='uppercase text-[12px] font-bold text-lighterAluminum'>Invites <br /> Sent</div>
                        <div className='text-[24px] font-bold'>0</div>
                    </Paper>
                    <Paper className='flex flex-1 flex-col gap-[16px] p-4 border border-gunpowder'>
                        <div className='uppercase text-[12px] font-bold text-lighterAluminum'>successful <br /> referrals</div>
                        <div className='text-[24px] font-bold'>0</div>
                    </Paper>
                    <Paper className='flex flex-1 flex-col gap-[16px] p-4 border border-gunpowder'>
                        <div className='uppercase text-[12px] font-bold text-lighterAluminum'>Total <br /> earnings</div>
                        <div className='text-[24px] font-bold'>$0</div>
                    </Paper>
                </div>
            </div>
            <div className='flex flex-col gap-[16px]'>
                <div className='text-[19px] font-bold'>Your unique referral link</div>
                <div className='flex justify-between gap-[24px]'>
                    <input type='text'
                        value='https://trading.example.com/ref/beautydoe'
                        readOnly
                        className='flex-1 h-[40px] px-4 rounded-[8px] bg-[#0C1014]/50 border border-regaliaPurple text-[15px] font-bold backdrop-blur-[100px] outline-none focus:border-[#A189FC] transition'
                    />
                    <Button className='w-[180px] h-[44px] text-[15px] font-bold gap-[4px] py-[10px] px-[16px]'><CopyIcon className='w-[20px] h-[20px]' /> Copy</Button>
                </div>
                <div className='text-[15px] font-bold'>Your friends have until 11:00 AM on June 30 to:</div>
                <div className='flex justify-between gap-[16px]'>
                    <Paper className='flex flex-1 flex-col gap-[5px] p-4 rounded-[16px] border border-gunpowder'>
                        <div className='text-[19px] font-bold'>Create an Account</div>
                        <div className='text-[15px] font-[500] text-lighterAluminum'>Users must use your referral link</div>
                    </Paper>
                    <Paper className='flex flex-1 flex-col gap-[5px] p-4 rounded-[16px] border border-gunpowder'>
                        <div className='text-[19px] font-bold'>Verify Identity</div>
                        <div className='text-[15px] font-[500] text-lighterAluminum'>Users must complete identity verification for you to receive the reward</div>
                    </Paper>
                    <Paper className='flex flex-1 flex-col gap-[5px] p-4 rounded-[16px] border border-gunpowder'>
                        <div className='text-[19px] font-bold'>Buy a Subscription</div>
                        <div className='text-[15px] font-[500] text-lighterAluminum'>Users must deposit at least 50 USDT</div>
                    </Paper>
                </div>
                <div className='text-[15px] font-bold text-green'>Done! You will recieve BTC worth 10 USDT</div>
            </div>
            <div className='flex flex-col gap-[16px]'>
                <div className='text-[19px] font-bold'>Reward Tiers</div>
                <div className='flex justify-between gap-[16px]'>
                    <Paper className='flex flex-1 flex-col gap-[24px] p-4 rounded-[16px] border border-gunpowder'>
                        <div className='flex justify-start gap-[8px]'>
                            <Brown1 className='w-[18px] h-[20px]' />
                            <div className='text-[15px] font-[700] text-lighterAluminum'>TIER 1</div>
                        </div>
                        <div className='flex flex-col gap-[8px]'>
                            <div className='text-[19px] font-bold'>1-5 Referrals</div>
                            <div className='flex items-center gap-2'>
                                <span className='w-1 h-1 rounded-full bg-lightPurple' />
                                <span className='text-[15px] font-[500] text-lightPurple'>$10 credit each</span>
                            </div>
                        </div>
                    </Paper>
                    <Paper className='flex flex-1 flex-col gap-[24px] p-4 rounded-[16px] border border-gunpowder'>
                        <div className='flex justify-start gap-[8px]'>
                            <Green2 className='w-[18px] h-[20px]' />
                            <div className='text-[15px] font-[700] text-lighterAluminum'>TIER 2</div>
                        </div>
                        <div className='flex flex-col gap-[8px]'>
                            <div className='text-[19px] font-bold'>6-10 Referrals</div>
                            <div className='flex flex-col gap-[2px]'>
                                <div className='flex items-center gap-2'>
                                    <span className='w-1 h-1 rounded-full bg-lightPurple' />
                                    <span className='text-[15px] font-[500] text-lightPurple'>$15 credit each</span>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <span className='w-1 h-1 rounded-full bg-lightPurple' />
                                    <span className='text-[15px] font-[500] text-lightPurple'>1-month free Essential plan</span>
                                </div>
                            </div>
                        </div>
                    </Paper>
                    <Paper className='flex flex-1 flex-col gap-[24px] p-4 rounded-[16px] border border-gunpowder'>
                        <div className='flex justify-start gap-[8px]'>
                            <Gold3 className='w-[18px] h-[20px]' />
                            <div className='text-[15px] font-[700] text-lighterAluminum'>TIER 3</div>
                        </div>
                        <div className='flex flex-col gap-[8px]'>
                            <div className='text-[19px] font-bold'>11+ Referrals</div>
                            <div className='flex flex-col gap-[2px]'>
                                <div className='flex items-center gap-2'>
                                    <span className='w-1 h-1 rounded-full bg-lightPurple' />
                                    <span className='text-[15px] font-[500] text-lightPurple'>$20 credit each</span>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <span className='w-1 h-1 rounded-full bg-lightPurple' />
                                    <span className='text-[15px] font-[500] text-lightPurple'>Exclusive badge</span>
                                </div>
                            </div>
                        </div>
                    </Paper>
                </div>
            </div>
            <Paper className='flex-1 flex-col gap-[16px] p-4 border border-gunpowder'>
                <div className='flex justify-between'>
                    <div className='text-[19px] font-bold'>Your Invitations</div>
                    <div className='text-[19px] font-bold text-lightPurple'>0 USDT</div>
                </div>
                <div className='flex'>
                    <button className='text-[19px] font-bold text-lightPurple border-b-2 border-lightPurple pb-2 px-3 transition'>
                        Active
                    </button>
                    <button className='text-[19px] font-bold text-lighterAluminum border-b-2 border-transparent pb-2 px-3 ml-2 transition'>
                        inactive
                    </button>
                </div>

                <div className='h-px bg-regaliaPurple w-full mt-[-2px] mb-8' />

                <div className='flex flex-col flex-1 items-center justify-center gap-[8px]'>
                    <NothingFoundIcon className={'w-[48px] h-[48px] text-lighterAluminum'} />
                    <div className='text-[19px] font-bold mb-1'>Nothing Found</div>
                    <div className='text-lighterAluminum text-[15px] font-[500] text-center'>
                        You haven&apos;t invited anyone yet.<br />Invite friends and earn rewards.
                    </div>
                </div>
            </Paper>
            <div className='flex flex-col gap-[16px]'>
                <div className='text-[19px] font-bold'>Terms & Conditions</div>
                <div className='text-[15px] font-[500]'>
                    Referred friends must sign up using your unique link and subscribe to a paid plan for you to receive the reward. 
                    Rewards are credited to your account within 14 days after your friend&apos;s subscription is confirmed. The referral program is subject to change at any time.
                </div>
            </div>
        </Paper>
    );
};

export default ReferralsScreen;
