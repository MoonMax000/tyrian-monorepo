'use client';

import { useClickOutside } from '@/hooks/useClickOutside';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useRef, useState } from 'react';

interface CountryModel {
  name: string;
  shortName: string;
}

const countriesList = [
  { name: 'Russia', shortName: 'ru' },
  { name: 'USA', shortName: 'usa' },
  { name: 'Canada', shortName: 'ca' },
  { name: 'United Kingdom', shortName: 'gb' },
  { name: 'Germany', shortName: 'de' },
  { name: 'India', shortName: 'in' },
  { name: 'Japan', shortName: 'jp' },
  { name: 'China', shortName: 'cn' },
  { name: 'Hong Kong', shortName: 'hk' },
  { name: 'Saudi Arabia', shortName: 'sa' },
  { name: 'Australia', shortName: 'au' },
];

const CountriesSelect = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState<CountryModel>(countriesList[1]);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useClickOutside(wrapperRef, () => setIsOpen(false));

  return (
    <div className='relative mx-auto max-w-max' ref={wrapperRef}>
      <div
        className=' py-2 px-6 cursor-pointer flex items-center gap-2 rounded-2xl bg-blackedGray'
        role='button'
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <Image
          src={`/countries/${value.shortName}.png`}
          alt={value.name}
          width={40}
          height={40}
          className='py-2'
        />

        <p className='text-h3'>{value.name}</p>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='w-max border border-onyxGrey rounded-lg py-3 bg-blackedGray z-50 absolute left-[85%] top-[36px]'
          >
            {countriesList.map((country) => (
              <li
                key={country.shortName}
                className='pt-[6px] pb-[10px] px-6 flex items-center gap-3 transition-colors hover:bg-moonlessNight'
                role='button'
                onClick={() => setValue(country)}
              >
                <Image
                  src={`/countries/${country.shortName}.png`}
                  alt={country.name}
                  width={32}
                  height={32}
                />

                <p className='text-body-15'>{country.name}</p>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CountriesSelect;
