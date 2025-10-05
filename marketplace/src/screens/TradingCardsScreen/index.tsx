import Paper from '@/components/UI/Paper';
import Button from '@/components/UI/Button/Button';
import React from 'react';
import StarIcon from '@/assets/icons/star-icon.svg';
import DescriptionCard from '@/components/UI/DescriptionCard';
import IconQuestion from '@/assets/icons/icon-question.svg';
import MockChart from '@/assets/mock/mock-chart-algirithm-screen.svg';
import MockAvatarBig from '@/assets/icons/algorithm/mock-avatar-big.svg';
import MockAvatar0 from '@/assets/icons/algorithm/mock-avatar0.svg';
import MockAvatar1 from '@/assets/icons/algorithm/mock-avatar1.svg';
import MockAvatar2 from '@/assets/icons/algorithm/mock-avatar2.svg';
import MockAvatar3 from '@/assets/icons/algorithm/mock-avatar3.svg';
import MockAvatar4 from '@/assets/icons/algorithm/mock-avatar4.svg';
import MockAvatar5 from '@/assets/icons/algorithm/mock-avatar5.svg';
import MockAvatar6 from '@/assets/icons/algorithm/mock-avatar6.svg';
import MockAvatar7 from '@/assets/icons/algorithm/mock-avatar7.svg';
import MockAvatar8 from '@/assets/icons/algorithm/mock-avatar8.svg';
import ProcentLabel from '@/components/UI/ProcentLabel';
import Pagination from '@/components/UI/Pagination';
import InfoPopover from '@/components/UI/InfoPopover';
import { useRouter } from 'next/navigation';
import { TabValues } from '../MainScreen/types';

function TradingCardsScreen() {
  const { push } = useRouter();
  return (
    <div className='mb-[60px]'>
      <div className='mb-8'>
        <span
          className='text-webGray hover:text-purple cursor-pointer'
          onClick={() => push(`/${TabValues.Robots}`)}
        >
          Trading robots and Algorithms
        </span>
        <span className='text-[#808283]'> / </span>
        <span>Robot_name</span>
      </div>
      <Paper className='p-4 flex items-center justify-between mb-6'>
        <span className='text-bold-24'>BTC/USDT Grid-Bot HODL</span>
        <Button variant='danger' className='!border-none !bg-[#23252D] h-11'>
          <StarIcon />
        </Button>
      </Paper>
      <div className='grid grid-cols-[1fr_auto] gap-6'>
        <div className='flex flex-col gap-6'>
          <DescriptionCard title='Grid-Bot HODL'>
            <p className='text-body-15 px-4 pt-4'>
              Automates swaps between Ethereum (ETH) and Bitcoin (BTC) based on price divergence.
              When ETH outperforms BTC the bot sells a slice of ETH for BTC; when BTC regains
              strength the cycle reverse. No manual action required.
            </p>
          </DescriptionCard>
          <DescriptionCard title='Details'>
            <div className='grid grid-cols-2 p-4'>
              <div className='flex item-center gap-2'>
                <MockAvatar0 />
                <div className='flex flex-col justify-center gap-1 text-body-15'>
                  <span className='font-bold'>John Smith</span>
                  <span className='text-webGray uppercase'>Individual Analyst</span>
                </div>
              </div>
              <div className='flex flex-col item-center justify-center gap-1 text-body-12 uppercase'>
                <span className='text-webGray'>Running time</span>
                <span className='text-purple'>114d 7h 13m</span>
              </div>
            </div>
            <div className='grid grid-cols-4 py-4 px-4 pt-4'>
              <div className='flex flex-col gap-2'>
                <span className='text-body-12 text-webGray uppercase'>ROI Apy for 30 days</span>
                <span className='text-body-15 text-green'>+120.83%</span>
              </div>
              <div className='flex flex-col gap-2'>
                <span className='text-body-12 text-webGray uppercase'>aum (Usdt)</span>
                <span className='text-body-15'>216,632.59</span>
              </div>
              <div className='flex flex-col gap-2'>
                <span className='text-body-12 text-webGray uppercase'>Platform</span>
                <span className='text-body-15'>Windows/Mac</span>
              </div>
              <div className='flex flex-col gap-2'>
                <span className='text-body-12 text-webGray uppercase'>CATEGORY</span>
                <span className='text-body-15'>Other</span>
              </div>
            </div>
            <div className='grid grid-cols-4 py-4 px-4 pt-4'>
              <div className='flex flex-col gap-2'>
                <span className='text-body-12 text-webGray uppercase'>Roi Apy for 1 year</span>
                <span className='text-body-15 text-green'>+520.00%</span>
              </div>
              <div className='flex flex-col gap-2'>
                <span className='text-body-12 text-webGray uppercase'>Subscribers</span>
                <span className='text-body-15'>4 071</span>
              </div>
              <div className='flex flex-col gap-2'>
                <span className='text-body-12 text-webGray uppercase'>TYPE</span>
                <span className='text-body-15'>Script</span>
              </div>
              <div className='flex flex-col gap-2'>
                <span className='text-body-12 text-webGray uppercase'>INDUSTRY</span>
                <span className='text-body-15'>Automation</span>
              </div>
            </div>
          </DescriptionCard>
          <DescriptionCard title='Description'>
            <p className='text-body-15 px-4 pt-4'>
              The HODL grid bot automates trading between Ethereum (ETH) and Bitcoin (BTC) based on
              price differences. Here’s how it works: the bot swaps a stronger token (one that’s
              rising in value) for a weaker token (one that’s losing value). For example, if ETH
              rises more than BTC, the bot will sell some ETH and buy BTC. When the weaker token
              (BTC) regains strength and rises in value, the process repeats - this time swapping
              BTC back for ETH.
            </p>
          </DescriptionCard>
          <DescriptionCard title='Bot Parameters'>
            <MockChart />
          </DescriptionCard>
          <DescriptionCard
            title='Bot Subscribers Raiting'
            icon={<IconQuestion />}
            hoverContent={
              <InfoPopover text='Shows the trader’s rank and APR relative to the total investment in USDT.' />
            }
          >
            <div className='flex flex-1 items-center justify-between p-4'>
              <span className='text-body-12 text-webGray'>
                Trader 180***2022 deposited 24.00 USDT
              </span>
              <span className='text-body-12 text-webGray'>38 minutes ago</span>
            </div>
            <div className='grid grid-cols-2 gap-6 p-4 bg-moonlessNight'>
              <div className='flex items-center justify-between'>
                <span className='text-body-15 text-webGray'>1</span>
                <div className='flex item-center gap-2'>
                  <MockAvatar1 />
                  <div className='flex flex-col justify-center gap-1 text-body-12 uppercase'>
                    <span>Atlas Quinn</span>
                    <span className='text-webGray'>Subscribed for 9 days</span>
                  </div>
                </div>
                <div className='flex flex-col items-end justify-center gap-1 text-body-12 uppercase'>
                  <ProcentLabel border={true} value={120.83} />
                  <span className='text-webGray'>466.00</span>
                </div>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-body-15 text-webGray'>5</span>
                <div className='flex item-center gap-2'>
                  <MockAvatar5 />
                  <div className='flex flex-col justify-center gap-1 text-body-12 uppercase'>
                    <span>Silas Trent</span>
                    <span className='text-webGray'>Subscribed for 9 days</span>
                  </div>
                </div>
                <div className='flex flex-col items-end justify-center gap-1 text-body-12 uppercase'>
                  <ProcentLabel border={true} value={120.83} />
                  <span className='text-webGray'>466.00</span>
                </div>
              </div>
            </div>
            <div className='grid grid-cols-2 gap-6 p-4'>
              <div className='flex items-center justify-between'>
                <span className='text-body-15 text-webGray'>2</span>
                <div className='flex item-center gap-2'>
                  <MockAvatar2 />
                  <div className='flex flex-col justify-center gap-1 text-body-12 uppercase'>
                    <span>Mira Sterling</span>
                    <span className='text-webGray'>Subscribed for 9 days</span>
                  </div>
                </div>
                <div className='flex flex-col items-end justify-center gap-1 text-body-12 uppercase'>
                  <ProcentLabel border={true} value={120.83} />
                  <span className='text-webGray'>466.00</span>
                </div>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-body-15 text-webGray'>6</span>
                <div className='flex item-center gap-2'>
                  <MockAvatar6 />
                  <div className='flex flex-col justify-center gap-1 text-body-12 uppercase'>
                    <span>Noa Vance</span>
                    <span className='text-webGray'>Subscribed for 9 days</span>
                  </div>
                </div>
                <div className='flex flex-col items-end justify-center gap-1 text-body-12 uppercase'>
                  <ProcentLabel border={true} value={120.83} />
                  <span className='text-webGray'>466.00</span>
                </div>
              </div>
            </div>
            <div className='grid grid-cols-2 gap-6 p-4 bg-moonlessNight'>
              <div className='flex items-center justify-between'>
                <span className='text-body-15 text-webGray'>3</span>
                <div className='flex item-center gap-2'>
                  <MockAvatar3 />
                  <div className='flex flex-col justify-center gap-1 text-body-12 uppercase'>
                    <span>Drake Lawson</span>
                    <span className='text-webGray'>Subscribed for 9 days</span>
                  </div>
                </div>
                <div className='flex flex-col items-end justify-center gap-1 text-body-12 uppercase'>
                  <ProcentLabel border={true} value={120.83} />
                  <span className='text-webGray'>466.00</span>
                </div>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-body-15 text-webGray'>7</span>
                <div className='flex item-center gap-2'>
                  <MockAvatar7 />
                  <div className='flex flex-col justify-center gap-1 text-body-12 uppercase'>
                    <span>Jaxon Wolfe</span>
                    <span className='text-webGray'>Subscribed for 9 days</span>
                  </div>
                </div>
                <div className='flex flex-col items-end justify-center gap-1 text-body-12 uppercase'>
                  <ProcentLabel border={true} value={120.83} />
                  <span className='text-webGray'>466.00</span>
                </div>
              </div>
            </div>
            <div className='grid grid-cols-2 gap-6 p-4'>
              <div className='flex items-center justify-between'>
                <span className='text-body-15 text-webGray'>4</span>
                <div className='flex item-center gap-2'>
                  <MockAvatar4 />
                  <div className='flex flex-col justify-center gap-1 text-body-12 uppercase'>
                    <span>Eva Ryker</span>
                    <span className='text-webGray'>Subscribed for 9 days</span>
                  </div>
                </div>
                <div className='flex flex-col items-end justify-center gap-1 text-body-12 uppercase'>
                  <ProcentLabel border={true} value={120.83} />
                  <span className='text-webGray'>466.00</span>
                </div>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-body-15 text-webGray'>8</span>
                <div className='flex item-center gap-2'>
                  <MockAvatar8 />
                  <div className='flex flex-col justify-center gap-1 text-body-12 uppercase'>
                    <span>Elara Knox</span>
                    <span className='text-webGray'>Subscribed for 9 days</span>
                  </div>
                </div>
                <div className='flex flex-col items-end justify-center gap-1 text-body-12 uppercase'>
                  <ProcentLabel border={true} value={120.83} />
                  <span className='text-webGray'>466.00</span>
                </div>
              </div>
            </div>
            <div className='flex flex-1 justify-center'>
              <Pagination totalPages={10} currentPage={1} onChange={(val) => console.log(val)} />
            </div>
          </DescriptionCard>
        </div>
        <div className='w-[344px] flex flex-col gap-6'>
          <DescriptionCard title={'Price'}>
            <div className='flex flex-col gap-2 p-4 pt-5'>
              <span className='text-h4'>$10 / month</span>
              <span className='text-body-15 text-webGray'>7-day free trial</span>
            </div>
            <div className='flex flex-col gap-4 p-4 pb-0'>
              <Button className='w-[180px] h-11'>Subscribe</Button>
              <span className='text-body-15 text-webGray'>
                20% of profits automatically deducted
              </span>
            </div>
          </DescriptionCard>
          <Paper>
            <div className='flex item-center gap-2 p-4'>
              <MockAvatarBig />
              <div className='flex flex-col justify-center gap-1 text-body-12 uppercase'>
                <span>John Smith</span>
                <Button className='h-[32px] w-full' variant='secondary'>
                  Follow
                </Button>
              </div>
            </div>
            <div className='text-body-15 text-purple p-4 underline'>Private Channel</div>
          </Paper>
          <Paper className='p-4'>
            <p className='text-body-15 text-webGray'>
              Past performance does not guarantee future results. Trading cryptocurrencies involves
              significant risk and can result in loss of your invested capital. You should ensure
              that you fully understand the risk involved and take into consideration your level of
              experience, investment objectives and seek independent financial advice if necessary.
            </p>
          </Paper>
        </div>
      </div>
    </div>
  );
}

export default TradingCardsScreen;
