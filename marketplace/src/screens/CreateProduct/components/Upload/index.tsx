
import React, { useRef, useState, ChangeEvent } from 'react';
import UploadSvg from '@/assets/icons/upload.svg';

interface UploadComponentProps {
  onFileSelect?: (file: File) => void;
  accept?: string;
  title?: string;
  multiple?: boolean;
}

const UploadComponent: React.FC<UploadComponentProps> = ({ 
  onFileSelect, 
  accept = 'image/*', 
  title = 'Upload cover image',
  multiple = false 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setSelectedFile(file);
      onFileSelect?.(file);
    }
  };

  return (
    <div className="w-full relative">
      <div 
        className="py-[58px] w-full h-[220px] bg-[length:100%_100%] bg-no-repeat bg-center bg-[url('/background/dashed.svg')] flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors"
        onClick={handleClick}
      >
        <div className="flex flex-col items-center mb-1">
          <UploadSvg width={48} height={48} />
        </div>
        
        <div className="text-white font-semibold text-[24px] leading-[32px] tracking-[0%] mb-1">
          {selectedFile ? selectedFile.name : title}
        </div>
        
        <div className="font-semibold text-[12px] leading-4 tracking-[0%] uppercase text-lighterAluminum">
          DRAG HERE OR <span className="font-semibold underline text-[12px] text-primary">SELECT</span>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  )
};

export default UploadComponent;