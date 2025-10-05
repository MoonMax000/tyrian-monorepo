'use client';

import React from 'react';
import { RecommendedItem } from './constatnts';
import Image from 'next/image';
import IconBell from '@/assets/icons/icon-bell.svg';

interface RecommendedListProps {
  RecommendedList: RecommendedItem[];
}

const RecommendedList: React.FC<RecommendedListProps> = ({ RecommendedList }) => {
  return (
    <div>
      <div className="flex flex-col rounded-[8px] py-2 bg-[#181A20] min-w-[344px]">
        <h3
          className="p-[8px_16px_8px_16px] font-bold text-[24px] leading-[32.74px] border-b border-onyxGrey">
          Recommended Authors
        </h3>
        {RecommendedList.length ? (
          RecommendedList.map((notification, index) => {
            return (
              <div key={index} className="p-[16px_16px_8px_16px] flex items-center">
                <div className="relative w-11 h-11 mr-2">
                  <Image
                    src={notification.photo}
                    alt="photo"
                    className="w-11 h-11 object-cover rounded-full"
                    width={44}
                    height={44}
                  />
                </div>
                <div className="flex flex-col flex-1">
                  <div className="flex gap-2 items-center text-[15px]">
                    <span className="text-white ">{notification.name}</span>
                  </div>
                  <span className="text-white opacity-50 text-[12px] font-extrabold">{notification.text} </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col m-auto gap-2 mt-6 items-center opacity-50  min-w-[344px]">
            <IconBell className="w-10 h-10" />
            <span>Список пуст</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommendedList;
