import Image from 'next/image';
import ProcentLabel from '@/components/UI/ProcentLabel';

interface MostVisitedTableProps {
    data: {
        name: string;
        price: number;
        change_24h: number;
        icon?: string;
    }[];
}

const MostVisitedTable: React.FC<MostVisitedTableProps> = ({ data }) => {
    return (
        <div className="flex flex-col w-full">
            <div className="grid grid-cols-[1.5fr,1fr,auto] gap-4 px-4 py-3 bg-[#2A2C32] text-[#87888C] text-xs font-semibold">
                <p>МОНЕТА</p>
                <p>ЦЕНА</p>
                <p className='text-right'>ЗА 24 ЧАСА</p>
            </div>

            <div className="flex flex-col">
                {data.map((coin, index) => (
                    <div
                        key={coin.name}
                        className="grid grid-cols-[1.5fr,1fr,1fr] gap-4 px-4 py-4 hover:bg-[#272A32] last:border-b-0 border-b-2 border-[#FFFFFF14] items-center"
                    >
                        <div className="flex items-center gap-2">
                            {coin.icon ? (
                                <Image
                                    src={coin.icon}
                                    alt={coin.name}
                                    width={32}
                                    height={32}
                                    className="rounded-full"
                                />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-[#D9D9D9]" />
                            )}
                            <span className="font-semibold uppercase text-[12px]">{coin.name}</span>
                        </div>
                        <div className="font-semibold text-[15px] whitespace-nowrap">
                            {coin.price} ₽
                        </div>
                        <div className="w-[100px] flex justify-end">
                            <ProcentLabel value={coin.change_24h} symbolAfter="%" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MostVisitedTable;