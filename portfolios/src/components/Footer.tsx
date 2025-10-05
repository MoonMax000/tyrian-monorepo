import React from 'react';
import { 
  Database, 
  TrendingUp, 
  MessageCircle, 
  Video, 
  ShoppingBag, 
  Briefcase, 
  Sparkles, 
  BarChart 
} from 'lucide-react';

const Footer: React.FC = () => {
  const productLinks = [
    { label: 'Cryptocurrency', icon: Database },
    { label: 'Trading Terminal', icon: TrendingUp },
    { label: 'Social Network', icon: MessageCircle },
    { label: 'Live Streaming', icon: Video },
    { label: 'Marketplace', icon: ShoppingBag },
    { label: 'Portfolios', icon: Briefcase },
    { label: 'AI Assistant', icon: Sparkles },
    { label: 'Stock Market', icon: BarChart },
  ];

  const resourceLinks = [
    { label: 'AI' }
  ];

  const socialLinks = [
    { label: 'X/Twitter' },
    { label: 'LinkedIn' },
    { label: 'Instagram' },
    { label: 'Youtube' },
    { label: 'Facebook' }
  ];

  const legalLinks = [
    { label: 'House Rules' },
    { label: 'Terms and Conditions' },
    { label: 'Privacy Policy' },
    { label: 'Risk Warning' }
  ];

  return (
    <footer className="bg-tyrian-background-card backdrop-blur-32 border-t-2 border-tyrian-gray-darker border-r-2 border-l-2 rounded-t-[24px] lg:rounded-t-[48px] mt-auto">
      <div className="max-w-[1844px] mx-auto px-6 lg:px-12 py-8 lg:py-12">
        {/* Logo and Brand */}
        <div className="flex items-center gap-2 mb-8 lg:mb-12">
          <div className="w-6 h-7 lg:w-7 lg:h-8 relative">
            <svg viewBox="0 0 28 33" fill="none" className="w-full h-full">
              <g clipPath="url(#clip0_footer)">
                <path 
                  fillRule="evenodd" 
                  clipRule="evenodd" 
                  d="M0 16.4905L0.0012947 16.5883C3.08953 15.955 6.19422 15.2936 9.30464 14.6309L9.31038 30.3517L19.7747 32.5C19.7747 29.0478 19.7423 19.3225 19.7765 15.8712L12.4543 14.3681L11.4797 14.1682C16.955 13.0046 22.4401 11.8564 27.876 10.8678L27.8742 0.5C18.6809 2.38675 9.22271 4.61696 0 6.22091L0 16.4905Z" 
                  fill="url(#paint0_linear_footer)"
                />
              </g>
              <defs>
                <linearGradient id="paint0_linear_footer" x1="6.76989" y1="34.9" x2="18.8103" y2="2.53481" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#181A20"/>
                  <stop offset="1" stopColor="#A06AFF"/>
                </linearGradient>
                <clipPath id="clip0_footer">
                  <rect width="27.876" height="32" fill="white" transform="translate(0 0.5)"/>
                </clipPath>
              </defs>
            </svg>
          </div>
          <h2 className="text-white text-xl lg:text-2xl font-bold">Tyrian Trade</h2>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 mb-8 lg:mb-10">
          {/* Products Column */}
          <div className="flex-1">
            <h3 className="text-tyrian-purple-primary text-lg font-bold mb-4 lg:mb-5">Products</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
              {productLinks.map((link, index) => (
                <div key={index} className="flex items-center gap-3 cursor-pointer hover:text-tyrian-purple-primary transition-colors">
                  <link.icon className="w-5 h-5 lg:w-6 lg:h-6 text-white flex-shrink-0" />
                  <span className="text-white font-bold text-sm">{link.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Resources and Social Container */}
          <div className="flex flex-col sm:flex-row gap-8 lg:gap-12">
            {/* Resources Column */}
            <div className="min-w-[120px]">
              <h3 className="text-tyrian-purple-primary text-lg font-bold mb-4 lg:mb-5">Resources</h3>
              <div className="space-y-2">
                {resourceLinks.map((link, index) => (
                  <div key={index} className="cursor-pointer hover:text-tyrian-purple-primary transition-colors hover-lift">
                    <span className="text-white font-bold text-sm">{link.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Column */}
            <div className="min-w-[120px]">
              <h3 className="text-tyrian-purple-primary text-lg font-bold mb-4 lg:mb-5">Social</h3>
              <div className="space-y-2">
                {socialLinks.map((link, index) => (
                  <div key={index} className="cursor-pointer hover:text-tyrian-purple-primary transition-colors hover-lift">
                    <span className="text-white font-bold text-sm">{link.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mb-8 lg:mb-10">
          <p className="text-tyrian-gray-medium text-xs lg:text-sm font-normal leading-relaxed">
            Trading cryptocurrencies and financial instruments involves high risk and may result in losses exceeding your initial investment. All content on this website is for informational and educational purposes only and does not constitute financial advice. Prices and data may be inaccurate or delayed. TTYRIAN TRADE and its partners are not liable for any losses from using this website. Always do your own research and consult a professional if needed. Past performance is not a guarantee of future results. Trading on margin increases risk. Use of site content is prohibited without prior written consent. TTYRIAN TRADE may receive compensation from advertisers.
          </p>
        </div>

        {/* Divider */}
        <div className="h-px bg-tyrian-gray-darker mb-4 lg:mb-6"></div>

        {/* Bottom Section */}
        <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center">
          <div className="text-tyrian-gray-medium text-xs lg:text-sm font-bold order-2 lg:order-1">
            © 2025 - TTYRIAN TRADE - FZCO. All Rights Reserved.
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 order-1 lg:order-2">
            {legalLinks.map((link, index) => (
              <React.Fragment key={index}>
                <span className="text-tyrian-gray-medium text-xs lg:text-sm font-bold cursor-pointer hover:text-white transition-colors">
                  {link.label}
                </span>
                {index < legalLinks.length - 1 && (
                  <div className="hidden sm:block w-px h-5 bg-tyrian-gray-dark"></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
