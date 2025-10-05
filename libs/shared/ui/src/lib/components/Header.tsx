'use client';

import React, { useState, useEffect } from "react";
import { Search, Bell, Menu, ChevronDown, X } from "lucide-react";

interface HeaderProps {
  onMenuClick?: () => void;
  onLogoClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, onLogoClick }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
    // Check if user is authenticated (checking cookies)
    const checkAuth = () => {
      if (typeof document === 'undefined') return;
      const cookies = document.cookie.split(';');
      const hasSessionId = cookies.some(cookie => cookie.trim().startsWith('sessionid='));
      setIsAuthenticated(hasSessionId);
    };
    checkAuth();
  }, []);

  const handleSignUpClick = () => {
    window.location.href = 'http://localhost:8001/api/accounts/google/';
  };

  const handleLoginClick = () => {
    window.location.href = 'http://localhost:8001/api/accounts/google/';
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-black/80 backdrop-blur-xl border-b border-gray-800/50 shadow-lg shadow-purple-900/10">
      <div className="flex items-center justify-between h-full px-3 sm:px-4 lg:px-6">
        {/* Logo */}
        <div 
          className="flex items-center gap-2 sm:gap-3 cursor-pointer"
          onClick={onLogoClick}
        >
          <div className="w-5 h-6 sm:w-6 sm:h-7 lg:w-6 lg:h-7 relative flex-shrink-0">
            <svg viewBox="0 0 18 23" fill="none" className="w-full h-full">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0 11.4935L0.000836009 11.5607C1.99496 11.1253 3.99971 10.6706 6.00816 10.215L6.01186 21.0231L12.7689 22.5C12.7689 20.1266 12.7479 13.4405 12.77 11.0677L8.04193 10.0343L7.41266 9.89685C10.9481 9.0969 14.49 8.30751 18 7.62785L17.9988 0.5C12.0625 1.79714 5.95525 3.33041 0 4.43313L0 11.4935Z"
                fill="url(#paint0_linear)"
              />
              <defs>
                <linearGradient
                  id="paint0_linear"
                  x1="4.37143"
                  y1="24.15"
                  x2="13.044"
                  y2="2.25457"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#181A20" />
                  <stop offset="1" stopColor="#A06AFF" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h1 className="text-base sm:text-lg lg:text-xl font-bold text-white truncate">
            Tyrian Trade
          </h1>
        </div>

        {/* Desktop Center - Search and AI Assistant */}
        <div className="hidden lg:flex items-center gap-4">
          {/* Search Bar */}
          <div className="flex items-center gap-2 px-4 py-2 bg-black/20 border border-purple-600/60 rounded-3xl backdrop-blur-md w-64 hover:border-purple-500/80 hover:bg-black/30 transition-all">
            <Search className="w-6 h-6 text-gray-400" />
            <span className="text-gray-400 font-bold text-sm">
              Search (Ctrl + K)
            </span>
          </div>

          {/* AI Assistant Badge */}
          <div className="flex items-center gap-2 hover:bg-purple-900/30 rounded-lg px-2 py-1 transition-all cursor-pointer">
            <div className="flex items-center justify-center w-7 h-7 border border-gray-700 rounded-md backdrop-blur-md bg-black/30">
              <span className="text-white font-bold text-sm">AI</span>
            </div>
            <span className="text-white font-bold text-sm">Assistant</span>
          </div>
        </div>

        {/* Right Side - Always visible */}
        <div className="flex items-center gap-1 sm:gap-2 lg:gap-4">
          {/* Mobile Search Button */}
          <button className="lg:hidden p-2 min-w-[40px] min-h-[40px] flex items-center justify-center hover:bg-purple-900/30 rounded-lg transition-all">
            <Search className="w-5 h-5 text-white" />
          </button>

          {/* Notifications */}
          <div className="relative cursor-pointer p-1 min-w-[40px] min-h-[40px] flex items-center justify-center hover:scale-110 transition-transform">
            <Bell className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" />
            <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-4 h-4 lg:w-5 lg:h-5 bg-red-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">4</span>
            </div>
          </div>

          {/* Divider - Hidden on mobile */}
          <div className="hidden lg:block w-px h-11 bg-gradient-to-b from-transparent via-purple-600 to-transparent"></div>

          {/* Authentication Section */}
          {isMounted && isAuthenticated ? (
            /* User Avatar when authenticated */
            <div className="flex items-center gap-2 min-w-[40px] min-h-[40px]">
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/1af7e6c95c67ec6b205f0822b22053c228ee93d6?width=80"
                alt="User Avatar"
                className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-full flex-shrink-0 cursor-pointer hover:ring-2 hover:ring-purple-600 transition-all"
              />
            </div>
          ) : isMounted ? (
            /* Login & Register Buttons when not authenticated */
            <div className="flex items-center gap-2">
              <button
                className="px-3 sm:px-4 py-2 bg-transparent border border-purple-600 rounded-lg text-white font-bold text-sm hover:bg-purple-600/10 hover:border-purple-500 transition-all"
                onClick={handleSignUpClick}
              >
                Sign Up
              </button>
              <button
                className="px-3 sm:px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-900 rounded-lg text-white font-bold text-sm hover:scale-105 transition-transform shadow-lg shadow-purple-600/20"
                onClick={handleLoginClick}
              >
                Login
              </button>
            </div>
          ) : null}

          {/* Menu Button - Opens Right Sidebar */}
          <button
            onClick={onMenuClick}
            className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 bg-gradient-to-br from-purple-600 to-purple-900 rounded-lg hover:scale-110 transition-transform min-w-[40px] min-h-[40px] shadow-lg shadow-purple-600/30"
          >
            <Menu className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 bg-purple-900/30 backdrop-blur-md rounded-lg hover:bg-purple-900/50 transition-all min-w-[40px] min-h-[40px]"
          >
            {isMobileMenuOpen ? (
              <X className="w-4 h-4 text-white" />
            ) : (
              <ChevronDown className="w-4 h-4 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-16 left-0 right-0 bg-black/90 backdrop-blur-xl border-b border-gray-800/50 z-40 shadow-lg shadow-purple-900/20">
          <div className="p-3 sm:p-4 space-y-3 sm:space-y-4 max-h-[calc(100vh-64px)] overflow-y-auto">
            {/* Mobile Search */}
            <div className="flex items-center gap-2 px-3 sm:px-4 py-3 bg-black/30 border border-purple-600/40 backdrop-blur-md rounded-lg hover:bg-black/40 transition-all min-h-[48px]">
              <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <span className="text-gray-400 font-bold text-sm">
                Search (Ctrl + K)
              </span>
            </div>

            {/* Mobile AI Assistant */}
            <div className="flex items-center gap-2 px-3 sm:px-4 py-3 hover:bg-purple-900/30 rounded-lg transition-all min-h-[48px]">
              <div className="flex items-center justify-center w-7 h-7 border border-gray-700 rounded-md backdrop-blur-md bg-black/30 flex-shrink-0">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <span className="text-white font-bold text-sm">Assistant</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

