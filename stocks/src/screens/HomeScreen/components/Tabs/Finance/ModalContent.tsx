import { CheckBox } from '@/components/UI/Checkbox';
import Select from '@/components/UI/Select';
import Toggle from '@/components/UI/Toggle';
import React from 'react';
import { modalParams } from './constants';
import Button from '@/components/UI/Button';

export const ModalContent = () => {
  return (
    <div className='flex flex-col gap-6'>
      <div className='flex flex-col gap-4'>
        <h1 className='font-bold text-[24px]'>Export Financial Statement</h1>
        <p className='font-medium text-15px text-[#B0B0B0]'>
          Select a year and the financial statement you’d like to export. You can select multiple
          reports at once.
        </p>
      </div>
      <Select
        variant='gray'
        options={[
          { label: '2025', value: '2025' },
          { label: '2024', value: '2024' },
          { label: '2023', value: '2023' },
          { label: '2022', value: '2022' },
          { label: '2021', value: '2021' },
          { label: '2020', value: '2020' },
        ]}
        className='rounded-xl max-w-[460px]'
        wrapperClassName=' mb-4 text-[#FFFFFF7A] border border-regaliaPurple rounded-xl max-w-[460px]'
        selectIconClasses='!text-white opacity-[48%] '
        fieldClassname='h-10 !justify-start rounded-2xl bg-[#0B0E1180]'
        labelClassname='mb-[6px] opacity-[48%]'
        placeholder='Select year'
        classNameOptions='bg-[#0B0E1180] border border-regaliaPurple backdrop-blur-[100px] overflow-scroll'
        classNameOption='text-white hover:bg-purple'
      />
      <div className='flex flex-col gap-4'>
        {modalParams.map((item) => (
          <div className='flex justify-between w-full font-bold text-[15px]'>
            <span>{item.name}</span>

            <div className='flex w-fit gap-4'>
              {item.isToggle && (
                <span className='flex gap-2 items-center'>
                  ANNUAL
                  {
                    <Toggle
                      isActive={true}
                      onChange={() => {}}
                      className='!bg-transparent border-[2px] border-regaliaPurple p-1'
                      classNamePoint='bg-gradient-to-r from-[#A06AFF] to-[#482090] !w-5 !h-5'
                    />
                  }
                </span>
              )}
              <span className='flex gap-2 items-center'>
                {item.isToggle && 'QUARTER'}
                <CheckBox checked />
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className='flex gap-4 w-full justify-center'>
        <Button className='w-[180px] bg-transparent border border-regaliaPurple'>Cancel</Button>
        <Button className='w-[180px] bg-gradient-to-r from-[#A06AFF] to-[#482090]'>Download</Button>
      </div>
    </div>
  );
};
