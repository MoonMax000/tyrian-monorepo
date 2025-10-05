import { tools } from '@/screens/MainContent/mockData';

export const ProvidedTools = () => {
  return (
    <div className='w-[1300px] p-4 flex flex-col gap-4 rounded-3xl backdrop-blur-[100px] border border-regaliaPurple mt-4'>
      <span className='text-[24px] font-bold'>What tools are provided for partners?</span>
      <p className='text-[15px] font-bold text-textGray'>
        We provide a comprehensive set of tools to help you effectively attract clients and grow
        your earnings. After registering for the affiliate program, you'll gain access to your
        personal dashboard where you can:
      </p>
      <ul>
        {tools.map((item) => (
          <li key={item} className='text-[15px] font-bold text-textGray '>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};
