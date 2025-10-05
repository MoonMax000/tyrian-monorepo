import IconProfile from '@/assets/icons/navMenu/profile.svg';
import IconLogout from '@/assets/icons/navMenu/case.svg';

interface DropDownNavProps {
  onClick: (action: 'profile' | 'logout') => void;
}

const DropDownNav: React.FC<DropDownNavProps> = ({ onClick }) => {
  return (
    <div className='absolute right-0 mt-2 w-56 bg-[#0C1014]/95 backdrop-blur-[100px] rounded-[16px] border border-[#523A83]/50 shadow-2xl z-[1000] overflow-hidden animate-fadeIn'>
      <div className='p-2'>
        <div className='px-3 py-2 mb-2 border-b border-[#523A83]/30'>
          <p className='text-[#B0B0B0] text-xs font-semibold'>Account</p>
        </div>
        
        <button
          onClick={() => onClick('profile')}
          className='w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gradient-to-r hover:from-[#A06AFF]/10 hover:to-[#482090]/10 transition-all duration-200 hover-lift cursor-pointer group'
        >
          <IconProfile className='w-5 h-5 text-[#A06AFF] group-hover:text-white transition-colors' />
          <span className='text-white font-medium text-sm'>My Profile</span>
        </button>
        
        <button
          onClick={() => onClick('logout')}
          className='w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gradient-to-r hover:from-[#EF454A]/10 hover:to-[#EF454A]/5 transition-all duration-200 hover-lift cursor-pointer group'
        >
          <IconLogout className='w-5 h-5 text-[#EF454A] group-hover:text-white transition-colors' />
          <span className='text-white font-medium text-sm'>Log Out</span>
        </button>
      </div>
    </div>
  );
};

export default DropDownNav;
