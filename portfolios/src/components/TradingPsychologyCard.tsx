import { FC } from "react";
import { ArrowRight } from "lucide-react";

export const TradingPsychologyCard: FC = () => {
  return (
    <div className="flex w-full lg:w-[312px] p-4 flex-col items-start rounded-xl border border-[#181B22] bg-[rgba(11,14,17,0.50)] backdrop-blur-[50px]">
      <div className="flex pb-2 justify-between items-center self-stretch">
        <h3 className="text-white font-nunito text-[19px] font-bold leading-normal">
          Trading Psychology
        </h3>
        <ArrowRight
          className="w-6 h-6 rotate-90 text-[#B0B0B0]"
          strokeWidth={1.5}
        />
      </div>
      <div className="flex p-4 pl-0 items-center gap-2.5 self-stretch">
        <p className="flex-1 text-[#B0B0B0] font-nunito text-[15px] font-normal leading-normal">
          You can trade if all factors of your strategy are met, you are
          confident in the trade, ready to accept a loss, without emotions, and
          fully concentrated.
        </p>
      </div>
    </div>
  );
};
