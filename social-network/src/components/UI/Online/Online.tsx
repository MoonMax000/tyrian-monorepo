const Online = ({ isOnline = false }: { isOnline?: boolean }) => {
    return (
      <div className={`text-[12px] flex items-center gap-2 ${isOnline ? 'opacity-100' : 'opacity-40'}`}>
        <span className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green' : 'bg-white'}`} />
        <p className={isOnline ? 'text-green' : 'text-white'}>
          {isOnline ? 'Online' : 'Offline'}
        </p>
      </div>
    );
  };
  
  export default Online;
  