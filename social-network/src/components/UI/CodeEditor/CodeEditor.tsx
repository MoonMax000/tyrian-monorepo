'use client';

import { useState, useEffect } from 'react';
import IconCopy from '@/assets/icons/icon-copy.svg';

interface CodeEditorProps {
  textScript?: string;
  onChange?: (code: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ textScript, onChange }) => {
  const [code, setCode] = useState<string>(
    textScript ? textScript : Array(12).fill('console.log("Hello, world!");').join('\n'),
  );

  useEffect(() => {
    if (textScript !== undefined) {
      setCode(textScript);
    }
  }, [textScript]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      alert('Код скопирован!');
    } catch (err) {
      console.log('Ошибка копирования: ', err);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value;
    setCode(newCode);

    if (onChange) {
      onChange(newCode);
    }
  };

  return (
    <div className='w-full h-min-[300px]'>
      <div
        className='w-full flex items-center px-4 py-2 rounded-t-lg'
        style={{ height: '36px', backgroundColor: '#312645' }}
      >
        <div
          className='flex items-center gap-2 font-bold text-[15px] hover:cursor-pointer'
          onClick={handleCopy}
        >
          <IconCopy />
          Copy
        </div>
      </div>
      <div className='p-[20px_8px_20px_22px] bg-[#101418] rounded-b-lg border-l-2 border-[#312645]'>
        <textarea
          className='w-full h-40 bg-transparent text-primary p-2 rounded-md resize-none scrollbar'
          value={code}
          onChange={handleCodeChange}
          spellCheck={false}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
