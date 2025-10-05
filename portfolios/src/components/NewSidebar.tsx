import { FC, useState } from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Home,
  TrendingUp,
  Bitcoin,
  Users,
  ShoppingBag,
  Video,
  Bot,
  Calendar,
  FolderKanban,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface NavElementProps {
  icon: React.ReactNode;
  title: string;
  route?: string;
  children?: NavElementProps[];
}

const navElements: NavElementProps[] = [
  { icon: <Home className="h-5 w-5" />, title: "Home", route: "/" },
  {
    icon: <TrendingUp className="h-5 w-5" />,
    title: "Stock Market",
    route: "/stock",
    children: [
      {
        icon: <TrendingUp className="h-4 w-4" />,
        title: "Screener",
        route: "/screener",
      },
      {
        icon: <Calendar className="h-4 w-4" />,
        title: "Events Calendar",
        route: "/events",
      },
    ],
  },
  {
    icon: <Bitcoin className="h-5 w-5" />,
    title: "Cryptocurrency",
    route: "/crypto",
    children: [
      {
        icon: <Bitcoin className="h-4 w-4" />,
        title: "Screener",
        route: "/quotes",
      },
    ],
  },
  {
    icon: <Users className="h-5 w-5" />,
    title: "Social Network",
    route: "/social",
    children: [
      { icon: <Users className="h-4 w-4" />, title: "Feed", route: "/feed" },
      {
        icon: <Users className="h-4 w-4" />,
        title: "My page",
        route: "/profile",
      },
    ],
  },
  {
    icon: <ShoppingBag className="h-5 w-5" />,
    title: "Marketplace",
    children: [
      {
        icon: <ShoppingBag className="h-4 w-4" />,
        title: "My Products",
        route: "/products",
      },
      {
        icon: <ShoppingBag className="h-4 w-4" />,
        title: "Cart",
        route: "/cart",
      },
    ],
  },
  {
    icon: <Video className="h-5 w-5" />,
    title: "Live Streaming",
    children: [
      {
        icon: <Video className="h-4 w-4" />,
        title: "Following",
        route: "/following",
      },
    ],
  },
  {
    icon: <Bot className="h-5 w-5" />,
    title: "AI Assistant",
    route: "/ai",
    children: [
      {
        icon: <Bot className="h-4 w-4" />,
        title: "Tech Analysis",
        route: "/analysis",
      },
    ],
  },
  {
    icon: <Calendar className="h-5 w-5" />,
    title: "Calendar",
    route: "/calendar",
  },
  {
    icon: <FolderKanban className="h-5 w-5" />,
    title: "My Portfolios",
    route: "/",
  },
];

export const NewSidebar: FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  const toggleGroup = (title: string) =>
    setOpenGroup(openGroup === title ? null : title);

  const renderElement = (el: NavElementProps) => {
    if (el.children && el.children.length > 0) {
      const isOpen = openGroup === el.title;
      return (
        <div key={el.title}>
          <button
            onClick={() => toggleGroup(el.title)}
            className={cn(
              "flex items-center justify-between w-full px-3 py-[14px] rounded-lg transition",
            )}
            aria-expanded={isOpen}
          >
            <div
              className={cn(
                "flex items-center gap-2 pl-2 hover:text-white hover:border-l-[2px] hover:border-purple overflow-hidden",
                {
                  "text-white border-l-[2px] border-purple": isOpen,
                  "text-[#B0B0B0]": !isOpen,
                  "ml-[5px]": isCollapsed,
                },
              )}
            >
              <div className="size-5 flex-shrink-0">{el.icon}</div>
              <span
                className={cn(
                  "text-[15px] font-semibold whitespace-nowrap transition-all duration-300",
                  {
                    "opacity-0 w-0": isCollapsed,
                    "opacity-100 w-auto": !isCollapsed,
                  },
                )}
              >
                {el.title}
              </span>
            </div>
            {!isCollapsed && (
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform flex-shrink-0",
                  isOpen && "rotate-180",
                )}
              />
            )}
          </button>
          {isOpen && !isCollapsed && (
            <div className="ml-6 flex flex-col gap-1">
              {el.children.map((child) => (
                <NavLink
                  key={child.title}
                  to={child.route ?? "#"}
                  className={cn("px-3")}
                >
                  {({ isActive }) => (
                    <div
                      className={cn(
                        "flex items-center gap-2 pl-2 py-2 hover:custom-bg-blur hover:text-white hover:border-l-[2px] hover:border-purple overflow-hidden",
                        isActive ? "text-white" : "text-[#B0B0B0]",
                      )}
                    >
                      <div className="size-5 flex-shrink-0">{child.icon}</div>
                      <span className="text-[15px] font-semibold whitespace-nowrap">
                        {child.title}
                      </span>
                    </div>
                  )}
                </NavLink>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (el.route) {
      return (
        <NavLink
          key={el.title}
          to={el.route}
          className={cn("px-3 py-[14px]", { "ml-[5px]": isCollapsed })}
        >
          {({ isActive }) => (
            <div
              className={cn(
                "flex items-center gap-2 pl-2 transition hover:text-white hover:border-l-[2px] hover:border-purple overflow-hidden",
                isActive ? "text-white" : "text-[#B0B0B0]",
              )}
            >
              <div className="size-5 flex-shrink-0">{el.icon}</div>
              <span
                className={cn(
                  "text-[15px] font-semibold whitespace-nowrap transition-all duration-300",
                  {
                    "opacity-0 w-0": isCollapsed,
                    "opacity-100 w-auto": !isCollapsed,
                  },
                )}
              >
                {el.title}
              </span>
            </div>
          )}
        </NavLink>
      );
    }

    return (
      <div
        key={el.title}
        className={cn("px-3 py-[14px]", { "ml-[5px]": isCollapsed })}
      >
        <div className="flex items-center gap-2 pl-2 text-[#B0B0B0] hover:text-white hover:border-l-[2px] hover:border-purple overflow-hidden">
          <div className="size-5 flex-shrink-0">{el.icon}</div>
          <span
            className={cn(
              "text-[15px] font-semibold whitespace-nowrap transition-all duration-300",
              {
                "opacity-0 w-0": isCollapsed,
                "opacity-100 w-auto": !isCollapsed,
              },
            )}
          >
            {el.title}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="relative mt-8 ml-8 hidden lg:block z-20">
      <div
        className={cn(
          "bg-transparent relative h-fit rounded-[12px] p-[1px] w-fit",
          "bg-transparent",
        )}
      >
        <div
          className={cn(
            "flex flex-col py-4 transition-all duration-300 custom-bg-blur rounded-[12px]",
            isCollapsed ? "w-[72px]" : "w-[222px]",
          )}
        >
          <div className="absolute right-[-12px] top-[14px]">
            <button
              className="w-[26px] h-[26px] rounded-[12px] border border-white/10 custom-bg-blur hover:bg-white/10 flex items-center justify-center transition-all duration-300 shadow-sm hover:shadow-md z-20"
              onClick={() => setIsCollapsed(!isCollapsed)}
              aria-label="Toggle compact menu"
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </button>
          </div>

          <div className="flex flex-col gap-1">
            {navElements.slice(0, 1).map((el) => renderElement(el))}
            <div
              className={cn(
                "my-[14px] bg-[linear-gradient(90deg,rgba(82,58,131,0)_0%,#523A83_50%,rgba(82,58,131,0)_100%)] mx-auto h-[2px] transition-all duration-300",
                {
                  "w-[190px]": !isCollapsed,
                  "w-[40px]": isCollapsed,
                },
              )}
            />
            {navElements.slice(1).map((el) => renderElement(el))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewSidebar;
