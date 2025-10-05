import { FC, useMemo } from 'react';

import StackedAreaChart, { IMarketCapPoint } from '@/components/Diagrams/StackedAreaChart';
import { TimeRange, timeRangeParams } from '@/components/Diagrams/types';
import { useGetDetailsCapQuery } from '@/store/api/cryptoApi';
import { calculateChange, getLastTwoValues } from '@/utils/helpers/marketData';
import { formatShortCurrency } from '@/utils/helpers/formatShortCurrency';

const DetailsContent: FC<{ timeRange: TimeRange }> = ({ timeRange }) => {
    const { range } = timeRangeParams[timeRange];
    const { data, isLoading } = useGetDetailsCapQuery({ range });

    const transformedData: IMarketCapPoint[] = useMemo(() => {
        if (!data?.points) return [];

        return data.points.reduce<IMarketCapPoint[]>((acc, entry) => {
            if (!entry.timestamp) return acc;
            const dateObj = new Date(Number(entry.timestamp) * 1000);
            acc.push({
                date: dateObj.toISOString().split('T')[0],
                time: dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
                btcValue: entry.btcValue,
                ethValue: entry.ethValue,
                stableValue: entry.stableValue,
                otherValue: entry.otherValue,
            });
            return acc;
        }, []);
    }, [data?.points]);

    const { last: lastBtcValue, prev: prevBtcValue } = getLastTwoValues(transformedData, "btcValue");
    const { last: lastEthValue, prev: prevEthValue } = getLastTwoValues(transformedData, "ethValue");
    const { last: lastStableValue, prev: prevStableValue } = getLastTwoValues(transformedData, "stableValue");
    const { last: lastOtherValue, prev: prevOtherValue } = getLastTwoValues(transformedData, "otherValue");

    const btcValueChange = calculateChange(lastBtcValue, prevBtcValue);
    const ethValueChange = calculateChange(lastEthValue, prevEthValue);
    const stableValueChange = calculateChange(lastStableValue, prevStableValue);
    const otherValueChange = calculateChange(lastOtherValue, prevOtherValue);

    return (
        <>
            <div className="flex flex-col h-full">
                <div className="flex gap-6">
                    <div className="flex flex-col items-baseline gap-2">
                        <div className="flex items-center gap-1.5">
                            <div
                                className="w-2 h-2 rounded-full bg-[#FFA800]"
                            />
                            <p className="text-[12px] text-[#87888b] font-semibold uppercase">BTC</p>
                        </div>
                        <h6 className="text-xl font-bold">{formatShortCurrency(lastBtcValue)}</h6>
                        <div className={`font-bold p-1 rounded bg-opacity-10 flex justify-center items-center 
                            ${btcValueChange && parseFloat(btcValueChange) >= 0
                                ? "text-[#2ebd85] bg-[#2ebd85]"
                                : "text-[#ef454a] bg-[#ef454a]"
                            }`}>
                            {btcValueChange ? `${parseFloat(btcValueChange) > 0 ? "+" : ""}${btcValueChange}%` : "—"}
                        </div>
                    </div>
                    <div className="flex flex-col items-baseline gap-2">
                        <div className="flex items-center gap-1.5">
                            <div
                                className="w-2 h-2 rounded-full bg-[#6AA5FF]"
                            />
                            <p className="text-[12px] text-[#87888b] font-semibold uppercase">ETH</p>
                        </div>
                        <h6 className="text-xl font-bold">{formatShortCurrency(lastEthValue)}</h6>
                        <div className={`font-bold p-1 rounded bg-opacity-10 flex justify-center items-center 
                            ${ethValueChange && parseFloat(ethValueChange) >= 0
                                ? "text-[#2ebd85] bg-[#2ebd85]"
                                : "text-[#ef454a] bg-[#ef454a]"
                            }`}>
                            {ethValueChange ? `${parseFloat(ethValueChange) > 0 ? "+" : ""}${ethValueChange}%` : "—"}
                        </div>
                    </div>
                    <div className="flex flex-col items-baseline gap-2">
                        <div className="flex items-center gap-1.5">
                            <div
                                className="w-2 h-2 rounded-full bg-[#2EBD85]"
                            />
                            <p className="text-[12px] text-[#87888b] font-semibold uppercase">Stablecoins</p>
                        </div>
                        <h6 className="text-xl font-bold">{formatShortCurrency(lastStableValue)}</h6>
                        <div className={`font-bold p-1 rounded bg-opacity-10 flex justify-center items-center 
                            ${stableValueChange && parseFloat(stableValueChange) >= 0
                                ? "text-[#2ebd85] bg-[#2ebd85]"
                                : "text-[#ef454a] bg-[#ef454a]"
                            }`}>
                            {stableValueChange ? `${parseFloat(stableValueChange) > 0 ? "+" : ""}${stableValueChange}%` : "—"}
                        </div>
                    </div>
                    <div className="flex flex-col items-baseline gap-2">
                        <div className="flex items-center gap-1.5">
                            <div
                                className="w-2 h-2 rounded-full bg-[#DBDBDB]"
                            />
                            <p className="text-[12px] text-[#87888b] font-semibold uppercase">Other</p>
                        </div>
                        <h6 className="text-xl font-bold">{formatShortCurrency(lastOtherValue)}</h6>
                        <div className={`font-bold p-1 rounded bg-opacity-10 flex justify-center items-center 
                            ${otherValueChange && parseFloat(otherValueChange) >= 0
                                ? "text-[#2ebd85] bg-[#2ebd85]"
                                : "text-[#ef454a] bg-[#ef454a]"
                            }`}>
                            {otherValueChange ? `${parseFloat(otherValueChange) > 0 ? "+" : ""}${otherValueChange}%` : "—"}
                        </div>
                    </div>
                </div>

                <div className="flex-grow">
                    {isLoading ? "" : <StackedAreaChart data={transformedData} selectedTimeRange={timeRange} />}
                </div>
            </div>
        </>
    );
};

export default DetailsContent;