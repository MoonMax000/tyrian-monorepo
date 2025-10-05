'use client';
import React from 'react';

// import { useCreateBlockNote } from "@blocknote/react";
// import { BlockNoteView } from "@blocknote/mantine";
// import '@blocknote/mantine/style.css';
// import '@blocknote/core/fonts/inter.css';
// import { en } from "@blocknote/core/locales";
import PlusSvg from './plus.svg';
import EditSvg from './edit.svg';

// function Editor() {
//   const editor = useCreateBlockNote({
//     dictionary: {
//       ...en,
//       placeholders: {
//         ...en.placeholders,
//         default: 'Enter text...',
//         heading: 'Enter your title here',
//         emptyDocument: 'Enter text...',
//       },
//     },
//   });

//   return (
//     <BlockNoteView
//       editor={editor}
//       theme={{
//         colors: {
//           editor: {
//             background: 'transparent',
//             text: '#FFFFFF',
//           },
//         },
//       }}
//     />
//   );
// }

export default function Editor() {
  return (
    <div className='flex gap-6 flex-col'>
      <div className='flex gap-4 w-full'>
        <EditSvg />
        <input
          placeholder='Enter text...'
          className='bg-transparent text-lighterAluminum font-medium h-[20px] text-[15px]'
        />
      </div>
      <PlusSvg />
    </div>
  );
}
