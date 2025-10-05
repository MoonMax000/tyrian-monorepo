import IconFacebook from '@/assets/icons/social-networks/facebook.svg';
import IconInstagram from '@/assets/icons/social-networks/instagram.svg';
import IconX from '@/assets/icons/social-networks/x.svg';
import IconLinkedIn from '@/assets/icons/social-networks/linked-in.svg';
import IconYouTube from '@/assets/icons/social-networks/you-tube.svg';
import background from '@/assets/icons/social-networks/background.png';
import SocLinks from '@/components/UI/SocLinks';

const socialNetworks = [
  { name: 'Facebook', link: 'https://google.com', icon: <IconFacebook /> },
  { name: 'Instagram', link: 'https://google.com', icon: <IconInstagram /> },
  { name: 'X', link: 'https://google.com', icon: <IconX /> },
  { name: 'LinkedIn', link: 'https://google.com', icon: <IconLinkedIn /> },
  { name: 'YouTube', link: 'https://google.com', icon: <IconYouTube /> },
];

const SocialNetworks = () => {
  return (
    <div
      style={{
        backgroundImage: `url(${background.src})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className='bg-[#FFFFFF05] py-[48px] flex justify-center'>
        <div className='flex flex-col items-center'>
          <h2 className='text-h3 mb-7 text-center'>Don’t follow the herd. Invest with clarity.<br />Join the ultimate trading communit</h2>
          <SocLinks networks={socialNetworks} />
        </div>
      </div>
    </div>
  );
};

export default SocialNetworks;
