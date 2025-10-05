import React from 'react';
import { ChevronDown, MoreHorizontal } from 'lucide-react';

interface AccrualsCardProps {
  title: string;
  values: Array<{
    amount: string;
    label: string;
    badge?: { text: string; type: 'forecast' | 'received' };
  }>;
}

const AccrualsCard: React.FC<AccrualsCardProps> = ({ title, values }) => (
  <div className="flex p-4 flex-col justify-between items-start flex-1 self-stretch rounded-xl border border-tyrian-gray-darker bg-tyrian-black/50 backdrop-blur-[50px]">
    <div className="self-stretch text-tyrian-gray-medium text-xs font-bold font-nunito uppercase">
      {title}
    </div>
    <div className="flex flex-col items-start gap-2 self-stretch">
      {values.map((value, index) => (
        <div key={index} className="flex items-center gap-2 self-stretch">
          <div className={`text-xs font-bold font-nunito uppercase ${
            value.badge?.type === 'received' ? 'text-tyrian-green' : 'text-white'
          }`}>
            {value.amount}
          </div>
          {value.badge && (
            <div className={`flex px-1 py-0.5 justify-center items-center rounded ${
              value.badge.type === 'forecast' 
                ? 'bg-tyrian-purple-background' 
                : 'bg-tyrian-green-background'
            }`}>
              <div className={`text-xs font-bold font-nunito ${
                value.badge.type === 'forecast' ? 'text-tyrian-purple-primary' : 'text-tyrian-green'
              }`}>
                {value.badge.text}
              </div>
            </div>
          )}
          <div className="text-tyrian-gray-medium text-xs font-bold font-nunito uppercase">
            {value.label}
          </div>
        </div>
      ))}
    </div>
  </div>
);

interface DataTableProps {
  title: string;
  columns: string[];
  data?: Array<{
    asset: string;
    amount: string;
    currency: string;
    paymentType: string;
    date: string;
  }>;
  emptyMessage?: string;
}

const DataTable: React.FC<DataTableProps> = ({ title, columns, data, emptyMessage = "No payments" }) => (
  <div className="flex w-full flex-col items-start rounded-xl border border-tyrian-gray-darker bg-tyrian-black/50 backdrop-blur-[50px]">
    {/* Header */}
    <div className="flex p-4 items-center gap-4 self-stretch border-b border-tyrian-gray-darker">
      <div className="text-white text-2xl font-bold font-nunito">{title}</div>
    </div>
    
    {data && data.length > 0 ? (
      <>
        {/* Table Header */}
        <div className="flex px-4 py-3 items-center gap-4 self-stretch border-b border-tyrian-gray-darker">
          <div className="flex w-[444px] items-start">
            <div className="text-tyrian-gray-medium text-xs font-bold font-nunito uppercase">
              {columns[0]}
            </div>
            <ChevronDown className="w-4 h-4 text-tyrian-gray-medium ml-2" />
          </div>
          <div className="flex flex-col justify-center items-end flex-1">
            <div className="text-tyrian-gray-medium text-xs font-bold font-nunito uppercase">
              {columns[1]}
            </div>
            <ChevronDown className="w-4 h-4 text-tyrian-gray-medium ml-2" />
          </div>
          <div className="flex flex-col justify-center items-center flex-1">
            <div className="text-tyrian-gray-medium text-xs font-bold font-nunito uppercase">
              {columns[2]}
            </div>
            <ChevronDown className="w-4 h-4 text-tyrian-gray-medium ml-2" />
          </div>
          <div className="flex flex-col items-start flex-1">
            <div className="text-tyrian-gray-medium text-xs font-bold font-nunito uppercase">
              {columns[3]}
            </div>
            <ChevronDown className="w-4 h-4 text-tyrian-gray-medium ml-2" />
          </div>
          <div className="flex flex-col justify-center items-end flex-1">
            <div className="text-tyrian-gray-medium text-xs font-bold font-nunito uppercase">
              {columns[4]}
            </div>
            <ChevronDown className="w-4 h-4 text-tyrian-gray-medium ml-2" />
          </div>
          <div className="w-[47px] flex flex-col justify-center items-end"></div>
        </div>

        {/* Table Rows */}
        {data.map((row, index) => (
          <div key={index}>
            <div className="flex h-14 px-4 items-center gap-4 self-stretch">
              <div className="flex w-[444px] items-center gap-1">
                <div className="text-white text-[15px] font-bold font-nunito">{row.asset}</div>
              </div>
              <div className="flex flex-col justify-center items-end flex-1">
                <div className="text-white text-[15px] font-bold font-nunito">{row.amount}</div>
              </div>
              <div className="flex flex-col items-center flex-1">
                <div className="text-white text-[15px] font-bold font-nunito">{row.currency}</div>
              </div>
              <div className="flex flex-col items-start flex-1">
                <div className="text-white text-[15px] font-bold font-nunito">{row.paymentType}</div>
              </div>
              <div className="flex flex-col justify-center items-end flex-1">
                <div className="text-white text-[15px] font-bold font-nunito">{row.date}</div>
              </div>
              <div className="w-[47px] flex flex-col justify-center items-end">
                <MoreHorizontal className="w-6 h-6 text-tyrian-gray-medium rotate-90" />
              </div>
            </div>
            {index < data.length - 1 && (
              <div className="h-px self-stretch bg-tyrian-gray-darker"></div>
            )}
          </div>
        ))}
      </>
    ) : (
      <div className="flex justify-center items-center gap-2.5 flex-1 self-stretch">
        <div className="text-white text-[15px] font-bold font-nunito">{emptyMessage}</div>
      </div>
    )}
  </div>
);

interface EmptyChartCardProps {
  title: string;
}

const EmptyChartCard: React.FC<EmptyChartCardProps> = ({ title }) => (
  <div className="flex h-[390px] flex-col items-start flex-1 rounded-xl border border-tyrian-gray-darker bg-tyrian-black/50 backdrop-blur-[50px]">
    <div className="flex p-4 items-center gap-4 self-stretch border-b border-tyrian-gray-darker">
      <div className="text-white text-2xl font-bold font-nunito">{title}</div>
    </div>
    <div className="flex justify-center items-center gap-2.5 flex-1 self-stretch">
      <div className="text-white text-[15px] font-bold font-nunito">No data</div>
    </div>
  </div>
);

const AnalyticsView: React.FC = () => {
  const futurePaymentsData = [
    {
      asset: "All Assets",
      amount: "1,000,000.00",
      currency: "$",
      paymentType: "Payment",
      date: "30.07.25"
    },
    {
      asset: "MetaMask - main portfolio",
      amount: "1,000,000.00",
      currency: "$",
      paymentType: "Payment",
      date: "30.07.25"
    },
    {
      asset: "Metamask - Polygon 2",
      amount: "1,000,000.00",
      currency: "$",
      paymentType: "Payment",
      date: "30.07.25"
    },
    {
      asset: "Metamask - Polygon",
      amount: "1,000,000.00",
      currency: "$",
      paymentType: "Payment",
      date: "30.07.25"
    },
    {
      asset: "Metamask - Ethereum",
      amount: "1,000,000.00",
      currency: "$",
      paymentType: "Payment",
      date: "30.07.25"
    }
  ];

  return (
    <div className="flex w-full items-start gap-6">
      {/* Left Sidebar */}
      <div className="flex w-60 flex-col items-start gap-6 flex-shrink-0">
        <AccrualsCard
          title="Accruals"
          values={[
            { amount: "$0.00", label: "ALL TIME" },
            { amount: "$0.00", label: "PER YEAR", badge: { text: "Forecast", type: "forecast" } },
            { amount: "$0.00", label: "PER MONTH", badge: { text: "Forecast", type: "forecast" } },
            { amount: "$0.00", label: "RECEIVED", badge: { text: "+0.00%", type: "received" } }
          ]}
        />
        
        <AccrualsCard
          title="Accrual yield"
          values={[
            { amount: "0.00%", label: "FOR 12 MONTHS" },
            { amount: "0.00%", label: "ALL TIME" },
            { amount: "0.00%", label: "GROWTH" }
          ]}
        />

        <div className="flex w-60 h-[804px] p-4 flex-col items-start gap-6 flex-shrink-0 rounded-xl border border-tyrian-gray-darker bg-tyrian-black/50 backdrop-blur-[50px]">
          <div className="self-stretch text-tyrian-gray-medium text-xs font-bold font-nunito uppercase">
            Future events
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-start gap-6 flex-1">
        {/* Future Payments */}
        <DataTable
          title="Future payments"
          columns={["ASSET", "AMOUNT", "CURRENCY", "PAYMENT TYPE", "DATE"]}
          data={futurePaymentsData}
        />

        {/* Actual Payments */}
        <DataTable
          title="Actual payments"
          columns={["ASSET", "AMOUNT", "CURRENCY", "PAYMENT TYPE", "DATE"]}
          emptyMessage="No payments"
        />

        {/* Accruals on Papers */}
        <DataTable
          title="Accruals on papers"
          columns={["ASSET", "AMOUNT", "CURRENCY", "PAYMENT TYPE", "DATE"]}
          emptyMessage="No payments"
        />

        {/* Bottom Charts Row */}
        <div className="flex w-full items-center gap-6">
          <EmptyChartCard title="Diversification of accruals by assets" />
          <EmptyChartCard title="Diversification of accruals by asset types" />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;
