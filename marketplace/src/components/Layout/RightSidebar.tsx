'use client';

import { FC } from 'react';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const WidgetCard: FC<{ title: string; children?: React.ReactNode }> = ({
  title,
  children,
}) => (
  <div className="border border-[#181B22] rounded-[24px] bg-[#0C101480] backdrop-blur-[100px] p-4">
    <h3 className="text-white font-semibold text-[15px] mb-3">{title}</h3>
    {children || (
      <div className="text-[#808283] text-sm">
        Widget content coming soon...
      </div>
    )}
  </div>
);

export const RightSidebar: FC<Props> = ({ isOpen }) => {
  return (
    <section
      className={cn(
        'flex-shrink-0 z-20 flex flex-col gap-6 overflow-y-auto overflow-x-visible transition-all duration-500 ease-in-out pt-6',
        {
          'w-0 opacity-0 pointer-events-none': !isOpen,
          'w-[330px] opacity-100': isOpen,
        },
      )}
    >
      {/* Trading Psychology Card */}
      <div className="flex w-[312px] mr-6 p-4 flex-col items-start rounded-xl border border-[#181B22] bg-[rgba(11,14,17,0.50)] backdrop-blur-[50px]">
        <div className="flex pb-2 justify-between items-center self-stretch">
          <h3 className="text-white font-nunito text-[19px] font-bold leading-normal">
            Trading Psychology
          </h3>
          <ArrowRight
            className="w-6 h-6 rotate-90 text-[#B0B0B0]"
            strokeWidth={1.5}
          />
        </div>
        <div className="flex px-0 pb-2 items-center gap-2.5 self-stretch">
          <p className="flex-1 text-[#B0B0B0] font-nunito text-[15px] font-normal leading-normal">
            You can trade if all factors of your strategy are met, you are
            confident in the trade, ready to accept a loss, without emotions,
            and fully concentrated.
          </p>
        </div>
      </div>

      <div className="mr-6">
        <WidgetCard title="Quick Search">
          <input
            className="w-full h-9 rounded-lg border border-[#181B22] bg-[#0C101480] px-3 text-white text-sm placeholder:text-[#808283] outline-none"
            placeholder="Search markets..."
          />
        </WidgetCard>
      </div>

      <div className="mr-6">
        <WidgetCard title="Trading Psychology">
          <div className="flex items-center justify-between">
            <span className="text-[#808283] text-sm">Fear & Greed Index</span>
            <span className="text-[#2ebd85] text-lg font-bold">72</span>
          </div>
          <div className="mt-2 h-2 bg-[#181B22] rounded-full overflow-hidden">
            <div className="h-full bg-[#2ebd85] w-[72%] transition-all" />
          </div>
        </WidgetCard>
      </div>

      <div className="mr-6">
        <WidgetCard title="Sector Movers">
          <div className="flex flex-col gap-2">
            {['Technology', 'Healthcare', 'Finance'].map((sector) => (
              <div
                key={sector}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-white">{sector}</span>
                <span className="text-[#2ebd85]">+2.4%</span>
              </div>
            ))}
          </div>
        </WidgetCard>
      </div>

      <div className="mr-6">
        <WidgetCard title="Portfolio" />
      </div>
      <div className="mr-6">
        <WidgetCard title="Watch List" />
      </div>
      <div className="mr-6">
        <WidgetCard title="Latest News" />
      </div>
      <div className="mr-6">
        <WidgetCard title="Calendar" />
      </div>
    </section>
  );
};

export default RightSidebar;

