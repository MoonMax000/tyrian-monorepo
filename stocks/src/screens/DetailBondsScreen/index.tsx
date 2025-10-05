'use client';
import AttributeCard from '@/components/UI/AttributeCard';
import { BondsCardInfo } from './components/BondsCardinfo';
import {
  aboutAttributes,
  CashFlowData,
  cashFlowData,
  keyTermsAttributes,
  keyTermsAttributesGovt,
} from './constants';
import CashFlow from '../HomeScreen/components/Tabs/Review/components/CashFlow';
import { useQuery } from '@tanstack/react-query';
import { StocksService } from '@/services/StocksService';

export const DetailBondsScreen = ({ shortName }: { shortName: string }) => {
  const { data } = useQuery({
    queryKey: ['cash-flow'],
    queryFn: () => StocksService.cashFlow('NVIDIA'),
  });

  return shortName === 'US01MY' ? ( // временное решение для моков
    <section className='mt-12'>
      <BondsCardInfo shortName={shortName} title='US 1M yield' />
      <AttributeCard items={keyTermsAttributesGovt} title='Key terms' className='mt-6 p-4' />
      <CashFlow
        data={data?.data as Record<string, CashFlowData[]> | undefined}
        className='mt-6 !bg-transparent backdrop-blur-[100px] border border-regaliaPurple'
        title='Yield curve'
      />
    </section>
  ) : (
    <section className='mt-12 backdrop-blur-[100px] '>
      <BondsCardInfo shortName={shortName} title='Crane NXT, Co. 4.2% 15-MAR-2048' />
      <AttributeCard items={keyTermsAttributes} title='Key terms' className='mt-6 p-4' />
      <AttributeCard
        items={aboutAttributes}
        title='About Crane NXT, Co. 4.2% 15-MAR-2048'
        bottomContent={
          <p className='text-grayLight text-[15px] font-medium max-w-[720px]'>
            Crane NXT Co. is an industrial technology company, which provides trusted technology
            solutions to secure, detect, and authenticate to its customers. It operates through the
            following segments: Crane Payment Innovations (CPI), Security and Authentication
            Technologies (SAT), and Corporate. The CPI segment offers electronic equipment and
            associated software leveraging extensive and proprietary core capabilities with various
            detection and sensing technologies for applications including verification and
            authentication of payment transactions. The SAT segment focuses on advanced security
            solutions based on proprietary technology for securing physical products, including
            banknotes, consumer goods, and industrial products. The company was founded in 2023 and
            is headquartered in Waltham, MA.
          </p>
        }
        className='mt-6 p-4'
      />
    </section>
  );
};
