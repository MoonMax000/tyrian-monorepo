import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  TrendingUp,
  Database,
  MessageCircle,
  ShoppingBag,
  Video,
  Sparkles,
  Briefcase,
  Calendar,
  LineChart,
  ChevronRight,
  ChevronDown,
  Package,
  ShoppingCart,
  ChevronsLeft,
  X,
} from "lucide-react";

interface SidebarProps {
  isCollapsed?: boolean;
  isMobile?: boolean;
  isOpen?: boolean;
  onToggleCollapse?: () => void;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed = false,
  isMobile = false,
  isOpen = true,
  onToggleCollapse,
  onClose,
}) => {
  const navigate = useNavigate();
  const [expandedItems, setExpandedItems] = useState<string[]>(["marketplace"]);
  const [activeItem, setActiveItem] = useState<string>("marketplace");

  const toggleExpanded = (item: string) => {
    setExpandedItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item],
    );
  };

  const handleMenuClick = (item: any) => {
    setActiveItem(item.id);
    if (item.href) {
      navigate(item.href);
      if (isMobile) onClose?.();
    } else if (item.hasSubmenu) {
      toggleExpanded(item.id);
    }
  };

  const menuItems = [
    { id: "home", label: "Home", icon: Home, href: "/" },
    {
      id: "stock-market",
      label: "Stock Market",
      icon: TrendingUp,
      hasSubmenu: true,
    },
    {
      id: "cryptocurrency",
      label: "Cryptocurrency",
      icon: Database,
      hasSubmenu: true,
    },
    {
      id: "social-network",
      label: "Social Network",
      icon: MessageCircle,
      hasSubmenu: true,
    },
    {
      id: "marketplace",
      label: "Marketplace",
      icon: ShoppingBag,
      hasSubmenu: true,
      isActive: true,
      submenu: [
        { id: "my-products", label: "My Products", icon: Package },
        { id: "cart", label: "Cart", icon: ShoppingCart, isActive: true },
      ],
    },
    {
      id: "live-streaming",
      label: "Live Streaming",
      icon: Video,
      hasSubmenu: true,
    },
    {
      id: "ai-assistant",
      label: "AI Assistant",
      icon: Sparkles,
      hasSubmenu: true,
    },
    { id: "portfolios", label: "Portfolios", icon: Briefcase, href: "/" },
    { id: "calendar", label: "Calendar", icon: Calendar, href: "/calendar" },
    { id: "quotes", label: "Quotes", icon: LineChart, href: "/quotes" },
  ];

  // Mobile sidebar
  if (isMobile) {
    return (
      <aside
        className={`fixed left-0 top-20 bottom-4 w-60 z-40 h-[calc(100vh-5rem)] transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="relative h-full px-4 pt-4 container-card rounded-[12px]">
          {/* Mobile close button */}
          <div className="flex justify-end mb-2">
            <button
              onClick={onClose}
              className="p-2 hover:bg-tyrian-gray-darker rounded-lg"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          <nav className="flex-1 space-y-4 overflow-y-auto custom-scrollbar pb-2">
            {/* Home */}
            <div className="pl-3">
              <div
                className="flex items-center gap-2 text-tyrian-gray-medium hover:text-white cursor-pointer py-2"
                onClick={() => {
                  setActiveItem("home");
                  navigate("/");
                  onClose?.();
                }}
              >
                <Home className="w-5 h-5" />
                <span className="font-bold text-sm">Home</span>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-tyrian-purple-background to-transparent"></div>

            {/* Navigation Items */}
            <div className="space-y-4">
              {menuItems.slice(1).map((item) => (
                <div key={item.id} className="space-y-2">
                  <div className="flex items-start gap-2">
                    {/* Active indicator */}
                    <div
                      className={`w-0.5 h-5 rounded-full ${item.id === activeItem ? "bg-tyrian-purple-primary" : "bg-transparent"} group-hover:bg-tyrian-purple-primary`}
                    ></div>

                    <div className="flex-1">
                      <div
                        className={`flex items-center justify-between cursor-pointer group py-1 ${
                          item.id === activeItem
                            ? "text-white"
                            : "text-tyrian-gray-medium hover:text-white"
                        }`}
                        onClick={() => handleMenuClick(item)}
                      >
                        <div className="flex items-center gap-2">
                          <item.icon className="w-5 h-5" />
                          <span className="font-bold text-sm">
                            {item.label}
                          </span>
                        </div>
                        {item.hasSubmenu &&
                          (expandedItems.includes(item.id) ? (
                            <ChevronDown className="w-5 h-5 p-1" />
                          ) : (
                            <ChevronRight className="w-5 h-5 p-1 rotate-90" />
                          ))}
                      </div>

                      {/* Submenu */}
                      {item.submenu && expandedItems.includes(item.id) && (
                        <div className="mt-2 pl-5 space-y-2">
                          {item.submenu.map((subItem) => (
                            <div
                              key={subItem.id}
                              className={`flex items-center gap-2 cursor-pointer py-1 ${
                                subItem.id === activeItem
                                  ? "text-white"
                                  : "text-tyrian-gray-medium hover:text-white"
                              }`}
                              onClick={() => {
                                setActiveItem(subItem.id);
                                onClose?.();
                              }}
                            >
                              <subItem.icon className="w-5 h-5" />
                              <span className="font-bold text-sm">
                                {subItem.label}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </nav>
        </div>
      </aside>
    );
  }

  // Desktop collapsed sidebar
  if (isCollapsed) {
    return (
      <aside className="fixed left-0 top-20 bottom-4 w-16 z-40 h-[calc(100vh-5rem)]">
        <div className="relative h-full px-2 pt-4 container-card rounded-[12px] flex flex-col items-center gap-4">
          {/* Toggle button aligned with top, moves outward to the left/right */}
          <button
            onClick={onToggleCollapse}
            className="absolute top-3 right-[-18px] z-50 p-2 container-card rounded-[8px] flex items-center justify-center text-[#B0B0B0] hover:bg-[#181B20]"
            aria-label="Expand sidebar"
          >
            <ChevronRight className="w-4 h-4 text-white" />
          </button>
          <div className="mt-8 flex flex-col items-center gap-3 overflow-y-auto custom-scrollbar pb-2 w-full">
            {menuItems.map((item) => (
              <div
                key={item.id}
                onClick={() => handleMenuClick(item)}
                className={`flex items-center justify-center w-10 h-10 rounded-lg cursor-pointer transition-colors ${
                  item.id === activeItem
                    ? "bg-tyrian-gradient text-white"
                    : "text-tyrian-gray-medium hover:text-white"
                }`}
              >
                <item.icon className="w-5 h-5" />
              </div>
            ))}
          </div>
        </div>
      </aside>
    );
  }

  // Desktop expanded sidebar
  return (
    <aside className="fixed left-0 top-20 bottom-4 w-[244px] z-40 h-[calc(100vh-5rem)]">
      <div className="relative h-full px-4 pt-4 container-card rounded-[12px]">
        {/* Gradient border overlay */}
        <div
          className="absolute inset-0 rounded-[12px] pointer-events-none"
          style={{
            padding: "1px",
            background:
              "linear-gradient(75deg, rgba(82,58,131,0) 0%, #523A83 50%, rgba(82,58,131,0) 100%)",
            WebkitMask:
              "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
          }}
        />

        {/* Top collapse button */}
        <button
          onClick={onToggleCollapse}
          className="absolute top-3 right-[-18px] z-50 p-2 container-card rounded-[8px] flex items-center justify-center text-[#B0B0B0] hover:bg-[#181B20]"
          aria-label="Collapse sidebar"
        >
          <ChevronsLeft className="w-4 h-4 text-white" />
        </button>

        <nav className="flex-1 space-y-5 overflow-y-auto custom-scrollbar pb-4">
          {/* Home */}
          <div className="px-2">
            <div
              className="flex items-center gap-2 text-tyrian-gray-medium hover:text-white cursor-pointer px-2 py-2"
              onClick={() => {
                setActiveItem("home");
                navigate("/");
              }}
            >
              <Home className="w-5 h-5" />
              <span className="font-bold text-sm">Home</span>
            </div>
          </div>

          <div
            className="w-full h-[2px] rounded-full"
            style={{
              background:
                "linear-gradient(90deg, rgba(82,58,131,0) 0%, #523A83 50%, rgba(82,58,131,0) 100%)",
            }}
          />

          {/* Navigation Items */}
          <div className="space-y-5">
            {menuItems.slice(1).map((item) => (
              <div key={item.id} className="space-y-3">
                <div className="flex items-start gap-2">
                  {/* Active indicator */}
                  <div
                    className={`w-0.5 h-5 rounded-full ${item.id === activeItem ? "bg-tyrian-purple-primary" : "bg-transparent"} group-hover:bg-tyrian-purple-primary`}
                  ></div>

                  <div className="flex-1">
                    <div
                      className={`flex items-center justify-between cursor-pointer group ${item.id === activeItem ? "text-white" : "text-tyrian-gray-medium hover:text-white"} px-2 py-2`}
                      onClick={() => handleMenuClick(item)}
                    >
                      <div className="flex items-center gap-2">
                        <item.icon className="w-5 h-5" />
                        <span className="font-bold text-sm">{item.label}</span>
                      </div>
                      {item.hasSubmenu &&
                        (expandedItems.includes(item.id) ? (
                          <ChevronDown className="w-5 h-5" />
                        ) : (
                          <ChevronRight className="w-5 h-5 rotate-90" />
                        ))}
                    </div>

                    {/* Submenu */}
                    {item.submenu && expandedItems.includes(item.id) && (
                      <div className="mt-3 pl-5 space-y-3 relative before:absolute before:left-[8px] before:top-0 before:bottom-0 before:w-px before:bg-[#523A83]/50 ml-2">
                        {item.submenu.map((subItem) => (
                          <div
                            key={subItem.id}
                            onClick={() => setActiveItem(subItem.id)}
                            className={`flex items-center gap-2 cursor-pointer relative z-10 ${subItem.id === activeItem ? "text-white" : "text-tyrian-gray-medium hover:text-white"} px-2 py-1`}
                          >
                            <subItem.icon className="w-5 h-5" />
                            <span className="font-bold text-sm">
                              {subItem.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
