import SmallShortDiagram from '@/components/Diagrams/SmallShortDiagram';
import Paper from '@/components/UI/Paper';
import ProcentLabel from '@/components/UI/ProcentLabel';
import IconBTC from '@/assets/coins/icon-btc.png';
import IconETH from '@/assets/coins/icon-eth.png';
import IconSOL from '@/assets/coins/icon-sol.png';
import IconBNB from '@/assets/coins/icon-bnb.png';
import IconXRP from '@/assets/coins/icon-xrp.png';

const PopularCoinsTable = () => {
  const mockCoinsData = [
    {
      icon: IconBTC,
      coin: 'BTC',
      price: '$96,914.02',
      procent: '+1.08',
      capital: '$1,919,717,706,863',
    },
    {
      icon: IconETH,
      coin: 'ETH',
      price: '$3,212.86',
      procent: '+0.96',
      capital: '$386,989,233,157',
    },
    {
      icon: IconSOL,
      coin: 'SOL',
      price: '$187.71',
      procent: '+1.09',
      capital: '$90,831,650,660',
    },
    {
      icon: IconBNB,
      coin: 'BNB',
      price: '$694.63',
      procent: '+0.01',
      capital: '$100,018,191,968',
    },
    {
      icon: IconXRP,
      coin: 'XRP',
      price: '$2.86',
      procent: '+11.05',
      capital: '$164,182,862,862',
    },
  ];

  return (
    <Paper className='!px-0 py-6 !pb-0 w-[638px]'>
      <div className='flex items-center justify-between'>
        <h3 className='text-[24px] font-semibold leading-[32px] mx-6'>Популярные монеты</h3>
        <p className='text-smalltable text-purple mr-8'>Все &gt;</p>
      </div>
      <div className='grid items-center gap-2 justify-between grid-cols-[10%,22%,22%,21%] px-6 pb-3 pt-3 mt-3 bg-[#2A2C32] text-titletable'>
        <p className='opacity-40 '>Монета</p>
        <p className='opacity-40 text-right'>Цена</p>
        <p className='opacity-40 text-right'>за 24 часа</p>
        <p className='opacity-40 text-right'>Капитализация</p>
      </div>

      <ul className='flex flex-col gap-2 pt-2'>
        {mockCoinsData &&
          mockCoinsData.map((item, index) => (
            <li
              key={`${item.price}-${index}`}
              className='grid items-center grid-cols-[7%,14.5%,24%,14%,11.5%,auto] py-3 px-6 border-b-2 border-[#FFFFFF14] last:border-none text-smalltable'
            >
              <img src={item.icon.src} alt={`${item.coin} logo`} className='w-8 h-8 mr-2 ' />
              <p className='text-smalltable'>{item.coin}</p>
              <p className='text-smalltable text-right mr-[28px]'>{item.price}</p>
              <SmallShortDiagram />
              <ProcentLabel
                value={Number(item.procent)}
                symbolAfter='%'
                className='text-smalltable text-right min-w-[62px]'
              />

              <p className='text-smalltable text-right'>{item.capital}</p>
            </li>
          ))}
      </ul>
    </Paper>
  );
};

export default PopularCoinsTable;
