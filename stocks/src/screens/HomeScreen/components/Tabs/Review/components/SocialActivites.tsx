import { ViewAll } from '@/components/UI/ViewAll';
import { SocialNetworkCard } from '@/components/SocialNetworkCard';

export const SocialActivites = () => (
  <section className='mt-10 lg:mt-[160px]'>
    <div className='flex items-center justify-between gap-x-4 mb-6'>
      <h1 className='text-[31px] font-bold text-white'>Social Activites</h1>
      <ViewAll>Show all</ViewAll>
    </div>
    <div className='grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6'>
      {Array.from([0, 1, 2, 3], (item) => (
        <SocialNetworkCard key={item} />
      ))}
    </div>
  </section>
);
