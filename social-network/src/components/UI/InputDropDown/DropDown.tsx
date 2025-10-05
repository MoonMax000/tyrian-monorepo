import IconArrow from '@/assets/icons/icon-arrow.svg';

interface DropDownItem {
  name: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  isDanger?: boolean;
}

interface DropDownGroup {
  title?: string;
  items: DropDownItem[];
}

interface DropDownProps {
  groups: DropDownGroup[];
  withArrow?: boolean;
}

const DropDown: React.FC<DropDownProps> = ({ groups, withArrow }) => {
  return (
    <ul className='absolute left-[-96px] top-2 w-[140px] bg-blackedGray rounded-[12px] z-50 border border-moonlessNight'>
      {groups.map((group, groupIndex) => {
        const isLastGroup = groupIndex === groups.length - 1;

        return (
          <div key={groupIndex}>
            {group.title && (
              <div className='px-4 py-2 text-[12px] text-webGray uppercase tracking-wide border-t border-moonlessNight flex items-center gap-2'>
                {withArrow && (
                  <span className='w-3 h-3'>
                    <IconArrow />
                  </span>
                )}
                <span className='text-webGray font-bold uppercase'>{group.title}</span>
              </div>
            )}
            {group.items.map((item, index) => (
              <li
                key={index}
                onClick={() => {
                  item.onClick?.();
                }}
                className={`flex items-center gap-[10px] px-3 py-3 hover:opacity-50 uppercase cursor-pointer ${
                  isLastGroup ? 'text-red border-t border-moonlessNight' : 'text-white'
                }`}
              >
                <span className='w-4 h-4'>{item.icon}</span>
                <span className='text-[12px] uppercase'>{item.name}</span>
              </li>
            ))}
          </div>
        );
      })}
    </ul>
  );
};

export default DropDown;
