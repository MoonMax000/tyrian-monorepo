import ContentWrapper from '@/components/UI/ContentWrapper';
import React from 'react';

const list = [
  "The Board of Directors of BEAC recommends dividends for the reporting period based on the company's dividend policy.",
  "Next, the company's board of Directors sets a cut-off date for participation in the general meeting of shareholders and the date of the Sberbank shareholders' meeting.",
  "Recommends the closing date of the register for receiving dividends from the Savings Bank. At the same time, the cut-off date for dividends should be no earlier than 10 days and no later than 20 days after the shareholders' meeting.",
  `
    The shareholders then approve the dividends and the cut-off date for the dividends at the meeting. You can view the upcoming dividends for other companies in the <a style="text-decoration:underline">dividend calendar</a>.
    `,
  'After the Sber dividend cutoff, dividends are credited to the accounts of up to 10 days to nominee shareholders and trust managers and up to 25 days to other shareholders.',
];

const ProcedureForPaymentDividends = () => {
  return (
    <ContentWrapper className='!p-6 bg-transparent backdrop-blur-xl'>
      <h4 className='text-[24px] font-bold text-white'>Dividend Payment Procedure</h4>

      <ul className='mt-6 flex flex-col gap-4 list-disc px-5'>
        {list.map((item, index) => (
          <li
            key={index}
            className='text-[15px] font-bold text-white'
            dangerouslySetInnerHTML={{ __html: item }}
          />
        ))}
      </ul>
    </ContentWrapper>
  );
};

export default ProcedureForPaymentDividends;
