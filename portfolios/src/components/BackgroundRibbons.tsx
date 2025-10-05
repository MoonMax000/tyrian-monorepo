import React from 'react';

/**
 * Shared background ribbons used across pages to keep a consistent look
 * Matches the first (Index) page background.
 */
const BackgroundRibbons: React.FC = () => (
  <div className="absolute -left-[229px] -top-[519px] w-[2485px] h-[2491px] pointer-events-none select-none">
    <img 
      src="https://api.builder.io/api/v1/image/assets/TEMP/b707cef9c458edc903ac5a5cdd54b81ed05c6b7e?width=4077"
      alt=""
      className="absolute left-[243px] top-[1217px] w-[2038px] h-[1274px]"
    />
    <img 
      src="https://api.builder.io/api/v1/image/assets/TEMP/037262a8a278416fa87254bfdcf45c8dc49c9862?width=4220"
      alt=""
      className="absolute left-0 top-0 w-[2110px] h-[1319px] opacity-80 rotate-[-35.094deg]"
    />
  </div>
);

export default BackgroundRibbons;
