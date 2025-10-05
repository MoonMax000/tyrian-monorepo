import Paper from '../ui/Paper/Paper';
import { FC } from 'react';
import Button from '../ui/Button/Button';
import PortfoliosIcon from '@/assets/Navbar/Portfolios.svg';
import ArrowButton from '@/assets/Navbar/ArrowButton.svg';

const portfolioList = [
    { id: 1, title: 'Crypto Expert', comment: 'High-risk BTC Strategy with sharp swings', growth: '+12.3%' },
    { id: 2, title: 'Crypto Expert', comment: 'High-risk BTC Strategy with sharp swings', growth: '+12.3%' },
    { id: 3, title: 'Crypto Expert', comment: 'High-risk BTC Strategy with sharp swings', growth: '+12.3%' },
]
const FollowingPortfoliosCard: FC = () => {
    return (
        <Paper className={'p-4 rounded-[24px]'}>
            <div className='flex flex-col'>
                <div className='flex flex-col justify-start overflow-hidden'>
                    <div className='text-white font-bold text-[24px]'>Following Portfolios</div>
                    <div className='border-t border-regaliaPurple opacity-40 my-2'></div>
                </div>
                <div className='flex flex-col mt-[6px] gap-[10px]'>
                    {portfolioList.map(({ id, title, comment, growth }) => {
                        return (
                            <Paper key={id} className='flex flex-col justify-start rounded-[16px] border border-gunpowder px-[16px] py-[8px]'>
                                <div className='flex flex-col justify-start gap-[4px]'>
                                    <div className='text-[19px] font-bold'>{title}</div>
                                    <div className='flex flex-inline justify-between'>
                                        <div className='text-[15px] font-[500]'>{comment}</div>
                                        <ArrowButton className='w-[20px] h-[20px] rotate-[270deg] text-lightPurple' />
                                    </div>
                                    <div className='flex flex-inline justify-start gap-[4px]'>
                                        <div className='text-[12px] font-bold text-lighterAluminum'>Growth:</div>
                                        <div className='text-[12px] font-bold text-green'>{growth}</div>
                                    </div>
                                </div>
                            </Paper>
                        )
                    })}
                </div>
                <Button className='text-white text-[15px] font-bold gap-[4px] px-[16px] mt-[12px]'> <PortfoliosIcon className='w-[20px] h-[20px]' /> View Portfolios</Button>
            </div>
        </Paper>
    );
};

export default FollowingPortfoliosCard;