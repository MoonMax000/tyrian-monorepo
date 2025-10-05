import React, { FC, useState } from 'react';
import IconArrow from '@/assets/icons/arrow.svg';
import IconFlag from '@/assets/icons/icon-flag.svg';
import IconFlagFull from '@/assets/icons/favorite.svg';
import RedactorNoteModal from '@/components/Layout/RedactorNoteModal';
import { NoteCalendarItemProps, NotesMockData } from '../constatnts';
import CreateNoteModal from '@/components/Layout/CreateNoteModal';
import Image from 'next/image';
import { Tooltip } from 'react-tooltip';
import IconCalendar from '@/assets/icons/navbar/icon-calendar.svg';
import { getMonthData } from './helpers';
import Button from '@/components/UI/Button';
import clsx from 'clsx';
import PlusIcon from '@/assets/plus.svg';
import WhitePlusIcon from '@/assets/white-plus.svg';

// для моков закидываем заметки в рандомные дни
const getNotesForDay = (day: number | null): NoteCalendarItemProps[] => {
  if (!day) return [];
  if (day === 1) return [NotesMockData[11], NotesMockData[13]];
  if (day === 3) return [NotesMockData[5], NotesMockData[9], NotesMockData[18]];
  if (day === 5) return [NotesMockData[22], NotesMockData[0], NotesMockData[12]];
  if (day === 6) return [NotesMockData[7], NotesMockData[1]];
  if (day === 7) return [NotesMockData[20], NotesMockData[4]];
  if (day === 8) return [NotesMockData[22], NotesMockData[0], NotesMockData[12]];
  if (day === 9) return [NotesMockData[7], NotesMockData[1]];
  if (day === 12) return [NotesMockData[20], NotesMockData[4]];
  if (day === 10) return [NotesMockData[21], NotesMockData[2], NotesMockData[15]];
  if (day === 11) return [NotesMockData[3], NotesMockData[10], NotesMockData[17]];
  if (day === 14)
    return [
      NotesMockData[3],
      NotesMockData[10],
      NotesMockData[17],
      NotesMockData[4],
      NotesMockData[5],
    ];
  if (day === 13) return [NotesMockData[19]];
  if (day === 19) return [NotesMockData[16], NotesMockData[6]];
  if (day === 20) return [NotesMockData[8], NotesMockData[14]];
  if (day === 21) return [NotesMockData[3], NotesMockData[10], NotesMockData[17]];
  if (day === 22) return [NotesMockData[2], NotesMockData[11], NotesMockData[6]];
  if (day === 23) return [NotesMockData[3], NotesMockData[10], NotesMockData[17]];
  if (day === 28) return [NotesMockData[8], NotesMockData[14]];
  return [];
};

const NoteCalendarItem: FC<NoteCalendarItemProps> = ({
  title,
  stocksList,
  color,
  img,
  day,
  desc,
  classNameImage,
}) => {
  const [clickedIcons, setClickedIcons] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className='w-full flex justify-between relative'>
      {/* <span className={`h-full w-1 bg-${color} rounded flex-shrink-0`}></span> */}
      <div className='flex flex-col gap-2 flex-wrap max-w-[100px]'>
        <div
          className='relative group cursor-pointer inline-block'
          data-tooltip-id={title}
          data-tooltip-content={''}
        >
          <Image
            src={img}
            alt='note'
            className={clsx(
              'w-[125px] h-[132px] max-w-[150px] rounded-lg object-cover',
              classNameImage,
            )}
            width={68}
            height={68}
          />

          <div className='w-full absolute inset-0 hover:bg-gradient-to-l from-[#482090]/70 to-[#A06AFF]/70 rounded-lg hover:backdrop-blur-sm  '></div>
        </div>
        <Tooltip
          className='border border-[#523A83] !rounded-2xl max-w-[412px] !backdrop-blur-[100px] !bg-[#0C101480] !opacity-100'
          id={title}
          clickable
        >
          <div className='flex flex-col gap-2'>
            <span className='font-bold text-[24px]'>{title}</span>
            <span className='text-[#B0B0B0] text-[15px] font-medium'>
              {desc ??
                'The issues that will be raised at the meeting will contribute to lowering the price,so it is necessary to have time to sell most of the shares...'}
            </span>
            <div className='flex justify-between'>
              <span className='flex items-center justify-center gap-2'>
                <IconCalendar />
                {day} {new Date().toLocaleString('en-EN', { month: 'long', year: 'numeric' })}
              </span>
              <Button className='bg-gradient-to-l from-[#482090]/70 to-[#A06AFF]/70 py-[10px] font-bold text-[15px]'>
                Add my calendar
              </Button>
            </div>
          </div>
        </Tooltip>
      </div>
      <div
        className='justify-self-end cursor-pointer absolute right-5 top-0 z-1'
        onClick={() => {
          setClickedIcons((e) => (e = !e));
          setIsModalOpen(true);
        }}
      >
        {clickedIcons ? (
          <IconFlagFull />
        ) : (
          <IconFlag className='text-[#FFFFFF28] hover:text-purple opacity-100 cursor-pointer' />
        )}
      </div>
      <RedactorNoteModal
        isOpen={isModalOpen}
        onClose={() => {
          setClickedIcons((e) => (e = !e));
          setIsModalOpen(false);
        }}
      />
    </div>
  );
};

interface CalendarItemProps {
  day: number | null;
  isToday: boolean;
  index: number;
  notes: NoteCalendarItemProps[];
}

const CalendarItem: React.FC<CalendarItemProps> = ({ day, isToday, index, notes }) => {
  const [isCreateModalOpen, setCreateIsModalOpen] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [isHover, setIsHover] = useState(false);

  const handleMouseLeave = () => {
    setIsHover(false);
    setIsAdded(false);
  };

  return (
    <td
      className={`h-[180px] border-2 border-regaliaPurple p-[2px] text-left ${
        isToday ? '' : ''
      } ${index === 0 ? 'border-l-0' : ''} ${index === 6 ? 'border-r-0' : ''}`}
    >
      <div
        className={`pl-2 pr-2 pt-2 pb-6 full flex flex-col size-full items-center gap-[6px] ${isToday ? 'bg-gray rounded-[12px]' : ''} `}
      >
        {day && (
          <div className='my-2 flex w-full items-center justify-between text-h3table'>
            <span className='text-body-12 opacity-50'>{day}</span>
            <div
              className='size-6 flex items-center justify-center text-[36px] opacity-50 text-purple hover:opacity-100 cursor-pointer transition-colors'
              onClick={() => {
                setCreateIsModalOpen(true);
              }}
            >
              +
            </div>
          </div>
        )}
        {!notes.length && day && (
          <div
            className={clsx(
              'border border-purple w-full h-12 flex justify-center items-center rounded-lg cursor-pointer',
              isAdded && 'border-none bg-[#7B4CCD] [box-shadow:4px_4px_3px_0px_#0000007A_inset]',
              isHover && 'border-none bg-[#7B4CCD] [box-shadow: 4px_4px_3px_0px_#0000007A_inset]',
            )}
            onMouseDown={() => setIsAdded(true)}
            onMouseLeave={handleMouseLeave}
            onMouseEnter={() => setIsHover(true)}
          >
            {isAdded || isHover ? <WhitePlusIcon /> : <PlusIcon />}
          </div>
        )}

        {notes.map((note, idx) => (
          <NoteCalendarItem
            day={day}
            classNameImage={notes.length > 2 ? 'h-[66px]' : 'h-[132px]'}
            key={idx}
            {...note}
          />
        ))}
      </div>
      <CreateNoteModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setCreateIsModalOpen(false);
        }}
      />
    </td>
  );
};

const CalendarTable = () => {
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date());

  const { shift, daysInMonth } = getMonthData(currentDate);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const generateCalendar = () => {
    const calendar = [];
    let day = 1;

    for (let week = 0; week < 5; week++) {
      const row = [];

      for (let col = 0; col < 7; col++) {
        if (week === 0 && col < shift) {
          row.push({ day: null, notes: [] });
        } else if (day > daysInMonth) {
          row.push({ day: null, notes: [] });
        } else {
          row.push({ day, notes: getNotesForDay(day) });
          day++;
        }
      }

      calendar.push(row);
    }

    return calendar;
  };

  const calendarData = generateCalendar();

  return (
    <div className='max-w-[1080px] mx-auto '>
      <div className='flex items-center gap-6 pt-7 pb-7 px-6'>
        <div className='flex items-center gap-2 '>
          <div
            onClick={handlePrevMonth}
            className='p-1 rounded bg-purple bg-opacity-20 hover:cursor-pointer bg-gradient-to-l from-[#482090] to-[#A06AFF]'
          >
            <IconArrow />
          </div>
          <div
            onClick={handleNextMonth}
            className='p-1 rounded bg-purple bg-opacity-20 hover:cursor-pointer bg-gradient-to-l from-[#482090] to-[#A06AFF]'
            style={{ transform: 'rotate(180deg)' }}
          >
            <div className='text-[#FFFFFF28] hover:text-purple opacity-100 cursor-pointer '>
              <IconArrow />
            </div>
          </div>
        </div>
        <h2 className='text-body-15'>
          {currentDate.toLocaleString('en-EN', { month: 'long', year: 'numeric' })}
        </h2>
      </div>

      <div className='border border-blackedGray rounded-lg overflow-hidden'>
        <table className='w-full table-fixed border-collapse'>
          <thead className='bg-[#2E2744]'>
            <tr className='h-10'>
              {daysOfWeek.map((day, index) => (
                <th
                  key={day}
                  className={`
                    py-3 px-2
                    text-h3table opacity-50
                    ${index !== 0 && 'border-l-2 border-regaliaPurple'}
                  `}
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>

          <thead className='h-2 bg-transparent'>
            <tr className='h-10'>
              {daysOfWeek.map((day, index) => (
                <th
                  key={day}
                  className={`
                    ${index === 0 ? 'border-0' : 'border-l-2 border-regaliaPurple'}
                    p-0
                  `}
                >
                  <div className='h-full w-full flex justify-center'>
                    <span className='h-full w-1 bg-gray opacity-50' />
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {calendarData.map((week, weekIndex) => (
              <tr key={weekIndex}>
                {week.map(({ day, notes }, dayIndex) => (
                  <CalendarItem
                    key={dayIndex}
                    day={day}
                    isToday={
                      day === today.getDate() &&
                      currentDate.getMonth() === today.getMonth() &&
                      currentDate.getFullYear() === today.getFullYear()
                    }
                    index={dayIndex}
                    notes={notes}
                  />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CalendarTable;
