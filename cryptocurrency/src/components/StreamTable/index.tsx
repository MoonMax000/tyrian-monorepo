'use client';

import { useEffect, useState } from 'react';
import Paper from '@/components/UI/Paper';
import ProcentLabel from '../UI/ProcentLabel';

const StreamTable = () => {
  const coinNames = [
    'EZET',
    'BTCW',
    'ETHF',
    'BNBX',
    'SOLX',
    'ADAQ',
    'XRPZ',
    'DOTK',
    'LTCY',
    'DOGEW',
    'AVAXP',
    'MATICG',
    'TRXD',
    'LINKT',
    'XLMJ',
    'FILH',
    'VETN',
    'BCHM',
    'NEOR',
    'ATOMU',
    'XMRB',
    'EOSF',
    'THETAL',
    'XTZG',
  ];

  const [mockStreamData, setMockStreamData] = useState<{ time: string; values: string[] }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const newData = Array.from({ length: 25 }, (_, i) => ({
        time: `${(18 + i).toString().padStart(2, '0')}.02.25`,
        values: coinNames.map(() => {
          const randomValue =
            Math.random() > 0.2
              ? ((() => {
                const val = Math.random() * 200 - 100;
                return val < 0
                  ? '-$' + Math.abs(val).toFixed(2)
                  : '$' + val.toFixed(2);
              })())
              : '';
          return randomValue;
        }),
      }));

      setMockStreamData(newData);
      setLoading(false);
    }, 500);
  }, []);

  return (
    <Paper className='!p-0 w-full max-w-[1300px] min-h-[400px] overflow-x-auto custom-scroll flex items-center '>
      {loading ? (
        <div className='text-white text-2xl font-bold'>Loading...</div>
      ) : (
        <div style={{ minWidth: '2500px' }} className='flex flex-col'>
          <div className='grid grid-cols-[repeat(25,100px)] bg-[#2A2C32] px-4 py-3'>
            <p className='opacity-40 text-titletable text-left'>Time</p>
            {coinNames.map((coin, index) => (
              <p key={index} className='opacity-40 text-titletable text-center'>
                {coin}
              </p>
            ))}
          </div>

          <ul>
            {mockStreamData.map((row, rowIndex) => (
              <li
                key={rowIndex}
                className='grid grid-cols-[repeat(25,100px)] py-3 px-4 border-b-2 border-[#FFFFFF14]'
              >
                <p className='text-[12px] font-bold'>{row.time}</p>
                {row.values.map((value, colIndex) => {
                  const numericValue = parseFloat(value.replace('$', ''));

                  return (
                    <div key={colIndex} className='bg-[#1C3430] text-[#2EBD85] font-bold text-[12px] w-fit rounded-lg px-1 py-0.5'>
                      {value}
                    </div>
                  );
                })}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Paper>
  );
};

export default StreamTable;
