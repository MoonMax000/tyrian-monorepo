'use client';
import { FC, useLayoutEffect } from 'react';
import { Selector } from './components/Selector';
import Signal from './Forms/Signal';
import TechnicalIndicator from './Forms/TechnicalIndicator';
import Robot from './Forms/Robot';
import Algorithm from './Forms/Algorithm';
import InvestmentConsultant from './Forms/InvestmentConsultant';
import AnalystTrader from './Forms/AnalystTrader';
import Script from './Forms/Script';
import Course from './Forms/Course';
import CreateProductLayout from './Layout';
import { CreateProductOptions } from './components/Selector/Selector';
import Other from './Forms/Other';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const CreateProduct: FC = () => {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  const currentTab = searchParams.get('product') || 'Course';

  const handleSelectProduct = (product: CreateProductOptions) => {
    const params = new URLSearchParams();
    params.set('product', product);
    replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const renderForm = () => {
    switch (currentTab) {
      case 'Course':
        return <Course />;
      case 'Signal':
        return <Signal />;
      case 'Algorithm':
        return <Algorithm />;
      case 'Analyst/Trader':
        return <AnalystTrader />;
      case 'Investment consultant':
        return <InvestmentConsultant />;
      case 'Other':
        return <Other />;
      case 'Robot':
        return <Robot />;
      case 'Script':
        return <Script />;
      case 'Technical Indicator':
        return <TechnicalIndicator />;
      default:
        return <Course />;
    }
  };

  useLayoutEffect(() => {
    if (!searchParams.has('product')) {
      const params = new URLSearchParams();
      params.set('product', 'Course');
      replace(`create-product?${params}`);
    }
  }, [replace, searchParams]);

  return (
    <section className='mt-16'>
      <CreateProductLayout>
        <Selector onSelect={handleSelectProduct} defaultValue={currentTab} className='mb-6' />
        {renderForm()}
      </CreateProductLayout>
    </section>
  );
};

export default CreateProduct;
