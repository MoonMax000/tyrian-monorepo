import { messages, users } from '@/app/data';
import useChatStore from '@/utilts/hooks/useChatStore';

export function ForwardedMessage({ id }: { id: number }) {
  const message = messages.find((m) => m.id === id);
  if (!message) return null;

  const user = users.find((u) => u.id === message.user_id);
  if (!user) return null;

  const currentUserId = useChatStore((state) => state.userId);
  const isCurrentUser = user.id === currentUserId;

  let displayName = user.name;
  if (isCurrentUser && !displayName.includes('(Me)')) {
    displayName = `${displayName} (Me)`;
  }

  const getPhotoLayoutClasses = () => {
    const photoCount = message.attachments?.photos?.length || 0;
    if (photoCount === 3) {
      return 'flex flex-row gap-1 mb-2 overflow-scroll';
    }
    return 'grid grid-cols-3 gap-2 mb-2';
  };

  const getPhotoItemClasses = () => {
    const photoCount = message.attachments?.photos?.length || 0;
    if (photoCount === 3) {
      return 'w-[164px] h-[164px] flex-shrink-0 rounded object-cover border border-primary/20';
    }
    return 'rounded object-cover w-full h-auto border border-primary/20';
  };

  return (
    <div className='border-l-2 border-primary pl-3 mt-2 mb-3 relative'>
      <div className='flex items-center gap-2 mb-1 mt-2'>
        <span className='font-bold text-primary'>{displayName}</span>
        {message.timestamp && (
          <span className='text-xs text-secondary font-extrabold'>{message.timestamp}</span>
        )}
      </div>
      <div className='mb-2 text-white/90 text-sm'>{message.text}</div>
      {message.attachments?.photos && (
        <div className={getPhotoLayoutClasses()}>
          {message.attachments.photos.map((src, idx) => (
            <img key={idx} src={src} className={getPhotoItemClasses()} />
          ))}
        </div>
      )}
    </div>
  );
}
