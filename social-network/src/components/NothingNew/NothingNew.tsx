import IconNoContent from '@/assets/icons/icon-no-content.svg';

const NothingNew = () => {
  return (
    <div className='flex flex-col m-auto gap-2 my-6 items-center opacity-50 w-full'>
      <IconNoContent className='w-10 h-10' />
      <span>Nothing new yet...</span>
    </div>
  );
};

export default NothingNew;
