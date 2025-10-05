import Paper from '@/components/Paper';
import { IModdalProps, MODALS_LIST, PORTFOLIO_TABLE_DATA } from './constants';
import ListCloseIcon from '@/assets/icons/list-controlers/list-close.svg';
import { formatCurrency } from '@/helpers/formatCurrency';
import EditIcon from '@/assets/icons/edit.svg';
import PlusIcon from '@/assets/icons/plus-square.svg';
import ScheduleIcon from '@/assets/icons/schedule.svg';
import DotesIcon from '@/assets/icons/vertical-dotes.svg';
import { useState } from 'react';
import ModalWrapper from '@/components/UI/Modal';

const PortfolioTable = () => {
  const [isOpenModal, setOpenModal] = useState<boolean>(false);
  const [modalType, setModalType] = useState<IModdalProps>(MODALS_LIST['edit']);
  return (
    <Paper className='!p-0'>
      <div className='grid items-center gap-2 justify-between grid-cols-[13%,10%,10%,12%,12%,18%,10%,7%] px-6 pb-3 pt-3 mt-3 bg-[#2A2C32] rounded-tl-[12px] rounded-tr-[12px]'>
        <p className='opacity-40 text-body-12 font-bold uppercase '>Название компании</p>
        <p className='opacity-40 text-body-12 font-bold uppercase text-center'>Кол-во </p>
        <p className='opacity-40 text-body-12 font-bold uppercase text-center'>СУММА</p>
        <p className='opacity-40 text-body-12 font-bold uppercase text-center'>Цена на сегодня</p>
        <p className='opacity-40 text-body-12 font-bold uppercase text-center'>Ср. цена покурки</p>
        <p className='opacity-40 text-body-12 font-bold uppercase text-center'>
          за 24 часа/За весь период
        </p>
        <p className='opacity-40 text-body-12 font-bold uppercase'>Заметки</p>
        <p className='opacity-40 text-body-12 font-bold uppercase text-center'></p>
      </div>

      <ul>
        {PORTFOLIO_TABLE_DATA &&
          PORTFOLIO_TABLE_DATA.map((item, index) => (
            <li
              key={`${item.company_short_name}-${index}`}
              className='grid items-center gap-2 grid-cols-[13.5%,10.5%,10.5%,12.5%,12.5%,18.5%,10%,7%]  py-4 px-6 border-b-2 border-blackedGray last:border-none'
            >
              <div className='flex justify-start items-center gap-2'>
                <ListCloseIcon />
                {item.img}
                <div className='flex flex-col'>
                  <p className='text-body-15'>{item.company_name}</p>
                  <p className='text-body-12 opacity-48'>{item.company_short_name}</p>
                </div>
              </div>
              <p className='text-center text-body-15'>{item.count}</p>
              <p className='text-center text-body-15'>{formatCurrency(item.sum)}</p>
              <p className='text-center text-body-15'>
                {formatCurrency(item.sum_today)}
              </p>
              <p className='text-center text-body-15'>
                {formatCurrency(item.sum_average)}
              </p>
              <p className='text-center text-body-15'>
                {`${formatCurrency(item.sum_day)}/${formatCurrency(item.sum_period)}`}
              </p>
              <div className='flex gap-[6px] items-center'>
                <div className='text-center'>
                  <p className='text-body-15'>{item.note}</p>
                  <p className='text-body-12 opacity-48'>{item.note_date}</p>
                </div>
                <EditIcon
                  className='w-[19px] h-[19px]'
                  onClick={() => {
                    setModalType(MODALS_LIST['edit']);
                    setOpenModal(true);
                  }}
                />
              </div>
              <div className='flex gap-4'>
                <PlusIcon
                  className='w-[19px] h-[19px] text-purple'
                  onClick={() => {
                    setModalType(MODALS_LIST['addAsset']);
                    setOpenModal(true);
                  }}
                />
                <ScheduleIcon className='w-[19px] h-[19px]' />
                <DotesIcon
                  className='w-[19px] h-[19px]'
                  onClick={() => {
                    setModalType(MODALS_LIST['del']);
                    setOpenModal(true);
                  }}
                />
              </div>
            </li>
          ))}
      </ul>
      <ModalWrapper
        isOpen={isOpenModal}
        onClose={() => setOpenModal(false)}
        title={modalType.title}
        className='p-6 !px-0 !w-[470px]'
        titleClassName='text-white text-center'
        contentClassName='!pr-0'
      >
        {modalType.component}
      </ModalWrapper>
    </Paper>
  );
};

export default PortfolioTable;
