import Paper from '@/components/UI/Paper';
import ProcentLabel from '@/components/UI/ProcentLabel';
import IconInfoCirle from '@/assets/icons/info-circle.svg';

import MockIcon from '@/assets/tracker/mock-icon.svg';

const ReviewTable = () => {
  const mockCoinsData = Array(15).fill(
    {
      ticket: 'IBIT',
      coin: 'BTC',
      fond_name: 'iShares Bitcoin Trust',
      price: '$0,00000',
      value: '$0,00000',
      APU: '00.00.0000',
      capitalisation: 'Аpproved',
      prize: '+15.22',
      commission: '20%',
      type: 'Spot',
    },
  );

  return (
    <div style={{ "--grid-cols": "12% 14% 10% 10% 10% 10% 10% 14% 10%" } as React.CSSProperties}>
      <div className="grid items-center grid-cols-[var(--grid-cols)] px-6 py-4 mt-3 rounded-t-xl uppercase bg-[#2A2C32]">
        <p className="opacity-40 text-titletable text-left">Ticker</p>
        <p className="opacity-40 text-titletable text-left">Fund name</p>
        <p className="opacity-40 text-titletable text-right">Price</p>
        <p className="opacity-40 text-titletable text-right">Volume</p>
        <div className="flex items-center justify-end gap-[6px]">
          <p className="opacity-40 text-titletable text-right">APU</p>
          <IconInfoCirle className="size-4 opacity-[48%]" />
        </div>
        <p className="opacity-40 text-titletable text-right">Ryn. cap.</p>
        <div className="flex items-center justify-end gap-[6px]">
          <p className="opacity-40 text-titletable text-right">Prize</p>
          <IconInfoCirle className="size-4 opacity-[48%]" />
        </div>
        <div className="flex items-center justify-end gap-[6px]">
          <p className="opacity-40 text-titletable text-right">Ch. commission</p>
          <IconInfoCirle className="size-4 opacity-[48%]" />
        </div>
        <p className="opacity-40 text-titletable text-right">type</p>
      </div>

      <ul>
        {mockCoinsData.map((item, index) => (
          <li
            key={`${item.ticket}-${index}`}
            className="grid items-center grid-cols-[var(--grid-cols)] py-6 px-6 border-b-2 bg-[#181A20] border-[#FFFFFF14]"
          >
            <div className="flex gap-3 items-center">
              <MockIcon />
              <div className="flex items-start flex-col gap-0.5">
                <p className="text-[15px] leading-5 font-bold">{item.ticket || '—'}</p>
                <p className="text-[12px] leading-5 font-bold opacity-40">{item.coin || '—'}</p>
              </div>
            </div>
            <p className="text-[15px] leading-5 font-bold text-left">{item.fond_name || '—'}</p>
            <span className="text-right">{item.price || '—'}</span>
            <span className="text-right">{item.value || '—'}</span>
            <span className="text-right">{item.APU || '—'}</span>
            <p className="text-[15px] leading-5 font-bold text-right">{item.capitalisation || '—'}</p>
            <div className="flex justify-end">
              <ProcentLabel symbolAfter='%' value={parseFloat(item.prize) || 0} className="text-right" />
            </div>
            <div className="flex flex-col gap-3">
              <div className="relative text-[15px] leading-5 font-bold text-right">
                {item.commission || '—'}
              </div>
            </div>
            <span className="text-right">{item.type}</span>
          </li>
        ))}
      </ul>
    </div>
  );


};

export default ReviewTable;
