import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PersistentNav from "../components/PersistentNav";
import Breadcrumbs from "../components/Breadcrumbs";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Filter,
  Plus,
  Star,
  Check,
} from "lucide-react";

const Calendar: React.FC = () => {
  const [selectedFilters, setSelectedFilters] = useState<string[]>(["all"]);
  const [currentMonth, setCurrentMonth] = useState("October 2025");
  const [searchFocused, setSearchFocused] = useState(false);
  const navigate = useNavigate();

  const handleFilterToggle = (filterId: string) => {
    setSelectedFilters((prev) => {
      if (filterId === "all") return ["all"];
      const base = prev.includes("all") ? [] : [...prev];
      const next = base.includes(filterId)
        ? base.filter((id) => id !== filterId)
        : [...base, filterId];
      return next.length === 0 ? ["all"] : next;
    });
  };

  const handlePrevMonth = () => {
    // Add month navigation logic here
  };

  const handleNextMonth = () => {
    // Add month navigation logic here
  };

  const handleAddEvent = (date: string) => {
    console.log("Adding event for:", date);
    // Add event creation logic here
  };

  const filterCategories = [
    {
      id: "financial-results",
      label: "Financial Results",
      dotColor: "border-blue-400",
    },
    {
      id: "operating-results",
      label: "Operating Results",
      dotColor: "border-amber-400",
    },
    {
      id: "dividends",
      label: "Dividends",
      dotColor: "border-tyrian-purple-primary",
    },
    {
      id: "board-directors",
      label: "Board of Directors",
      dotColor: "border-green-500",
    },
    {
      id: "shareholder-meeting",
      label: "Shareholder Meeting",
      dotColor: "border-red-400",
    },
    { id: "other", label: "Other", dotColor: "border-gray-400" },
    { id: "all", label: "All", dotColor: "border-gray-400" },
  ];

  const weekDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  // Sample calendar data with events
  const calendarData = [
    { date: "27 SEP", isPrevMonth: true, events: [] },
    {
      date: "28 SEP",
      isPrevMonth: true,
      events: [{ type: "starred", title: "Q3 Results" }],
    },
    { date: "29 SEP", isPrevMonth: true, events: [] },
    { date: "30 SEP", isPrevMonth: true, events: [] },
    { date: "1 OCT", isPrevMonth: false, events: [] },
    { date: "2 OCT", isPrevMonth: false, events: [] },
    { date: "3 OCT", isPrevMonth: false, events: [] },

    {
      date: "4 OCT",
      isPrevMonth: false,
      events: [{ type: "financial", title: "Earnings Call" }],
    },
    { date: "5 OCT", isPrevMonth: false, events: [] },
    { date: "6 OCT", isPrevMonth: false, events: [] },
    {
      date: "7 OCT",
      isPrevMonth: false,
      events: [{ type: "multiple", count: 5 }],
    },
    { date: "8 OCT", isPrevMonth: false, events: [] },
    {
      date: "9 OCT",
      isPrevMonth: false,
      events: [{ type: "special", title: "Trump's Inauguration Stock Alert" }],
    },
    {
      date: "10 OCT",
      isPrevMonth: false,
      events: [{ type: "starred", title: "Dividend Payment" }],
    },

    { date: "11 OCT", isPrevMonth: false, events: [] },
    { date: "12 OCT", isPrevMonth: false, events: [] },
    {
      date: "13 OCT",
      isPrevMonth: false,
      events: [{ type: "meeting", title: "Board Meeting" }],
    },
    { date: "14 OCT", isPrevMonth: false, events: [] },
    { date: "15 OCT", isPrevMonth: false, events: [] },
    { date: "16 OCT", isPrevMonth: false, events: [] },
    { date: "17 OCT", isPrevMonth: false, events: [] },
  ];

  const EventCard = ({ event, date }: { event: any; date: string }) => {
    if (event.type === "starred") {
      return (
        <div className="relative group cursor-pointer">
          <div className="w-full h-20 bg-gradient-to-br from-tyrian-purple-primary to-tyrian-purple-dark rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden">
            <div className="absolute top-2 right-2 z-10">
              <div className="w-6 h-6 bg-gradient-to-br from-tyrian-purple-primary to-tyrian-purple-dark rounded-b-md flex items-center justify-center">
                <Star className="w-4 h-4 text-white fill-white" />
              </div>
            </div>
            <div className="p-3 h-full flex items-end">
              <span className="text-white text-xs font-bold">
                {event.title}
              </span>
            </div>
          </div>
        </div>
      );
    } else if (event.type === "financial") {
      return (
        <div className="w-full h-16 bg-blue-600/30 backdrop-blur-sm rounded-xl border border-blue-400/30 hover:bg-blue-600/40 hover:border-blue-400/50 hover:scale-105 transition-all duration-300 cursor-pointer p-2">
          <span className="text-white text-xs font-semibold">
            {event.title}
          </span>
        </div>
      );
    } else if (event.type === "special") {
      return (
        <div className="w-full h-20 bg-tyrian-black/80 backdrop-blur-sm rounded-xl border border-tyrian-purple-primary/50 hover:border-tyrian-purple-primary hover:scale-105 transition-all duration-300 cursor-pointer p-3 relative group">
          <span className="text-white text-xs font-bold leading-tight">
            {event.title}
          </span>
          <div className="absolute inset-0 bg-tyrian-purple-primary/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>
        </div>
      );
    } else if (event.type === "meeting") {
      return (
        <div className="w-full h-20 bg-green-600/30 backdrop-blur-sm rounded-xl border border-green-400/30 hover:bg-green-600/40 hover:border-green-400/50 hover:scale-105 transition-all duration-300 cursor-pointer p-3">
          <span className="text-white text-xs font-bold">{event.title}</span>
        </div>
      );
    } else if (event.type === "multiple") {
      return (
        <div className="space-y-1">
          {Array.from({ length: Math.min(3, event.count) }).map((_, i) => (
            <div
              key={i}
              className={`w-full h-4 rounded-lg cursor-pointer hover:scale-105 transition-all duration-300 ${
                i === 0
                  ? "bg-amber-500/40 hover:bg-amber-500/60"
                  : i === 1
                    ? "bg-red-500/40 hover:bg-red-500/60"
                    : "bg-purple-500/40 hover:bg-purple-500/60"
              }`}
            ></div>
          ))}
          {event.count > 3 && (
            <span className="text-tyrian-gray-medium text-xs">
              +{event.count - 3} more
            </span>
          )}
        </div>
      );
    }
    return null;
  };

  const AddEventButton = ({ date }: { date: string }) => (
    <button
      onClick={() => handleAddEvent(date)}
      className="group w-full h-16 border-2 border-dashed border-tyrian-purple-primary/30 rounded-xl hover:border-tyrian-purple-primary hover:bg-tyrian-purple-primary/10 transition-all duration-300 flex items-center justify-center"
    >
      <Plus className="w-6 h-6 text-tyrian-purple-primary/50 group-hover:text-tyrian-purple-primary group-hover:scale-110 transition-all duration-300" />
    </button>
  );

  return (
    <div className="relative w-full">
      {/* Centered content container */}
      <div className="relative z-10 w-full max-w-[1293px] mx-auto px-3 sm:px-4 lg:px-0 py-6 sm:py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs />

        {/* Persistent Navigation */}
        <PersistentNav />

        {/* Page Title */}
        <h1 className="text-white text-xl sm:text-2xl font-bold font-nunito mt-4 sm:mt-6">
          Calendar
        </h1>

        {/* Calendar Container */}
        <div className="mt-6 space-y-6">
          {/* Filter Section */}
          <div className="w-full rounded-3xl border border-tyrian-gray-darker glass-card backdrop-blur-[50px] p-4 sm:p-6">
            {/* Filter Tags */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {filterCategories.map((category) => {
                const isActive = selectedFilters.includes(category.id);
                return (
                  <button
                    key={category.id}
                    onClick={() => handleFilterToggle(category.id)}
                    aria-pressed={isActive}
                    className={`inline-flex items-center gap-2 h-8 px-3 rounded-lg border transition-all duration-200 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-tyrian-purple-primary/60 ${
                      isActive
                        ? "bg-tyrian-purple-dark/40 border-tyrian-purple-primary text-white shadow-md ring-2 ring-tyrian-purple-primary/25 ring-2 ring-tyrian-purple-primary/25"
                        : "bg-transparent border-tyrian-gray-darker text-white/90 hover:bg-white/5 hover:border-tyrian-purple-primary/40"
                    }`}
                  >
                    <div
                      className={`w-2.5 h-2.5 rounded-full border-2 transition-all duration-200 ${category.dotColor} ${
                        isActive ? "ring-2 ring-tyrian-purple-primary/30" : ""
                      }`}
                    />
                    <span
                      className={`text-xs font-bold font-nunito uppercase ${isActive ? "text-white" : "text-white/90"}`}
                    >
                      {category.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search and Controls */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              {/* Search */}
              <div
                className={`flex-1 flex items-center gap-2 px-4 py-3 rounded-lg border glass-card backdrop-blur-[50px] transition-all duration-300 ${
                  searchFocused
                    ? "border-tyrian-purple-primary shadow-lg shadow-tyrian-purple-primary/20"
                    : "border-tyrian-gray-darker hover:border-tyrian-purple-primary/50"
                }`}
              >
                <Search
                  className={`w-6 h-6 transition-colors duration-300 ${
                    searchFocused
                      ? "text-tyrian-purple-primary"
                      : "text-tyrian-gray-medium"
                  }`}
                />
                <input
                  type="text"
                  placeholder="Search"
                  className="flex-1 bg-transparent text-white placeholder-tyrian-gray-medium text-sm font-nunito outline-none"
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                />
              </div>

              {/* Filters Button */}
              <button className="flex items-center gap-2 px-4 py-3 rounded-lg border border-tyrian-gray-darker glass-card backdrop-blur-[50px] hover:bg-tyrian-purple-dark/30 hover:border-tyrian-purple-primary/50 hover:scale-105 transition-all duration-300">
                <Filter className="w-6 h-6 text-tyrian-gray-medium group-hover:text-white transition-colors" />
                <span className="text-tyrian-gray-medium group-hover:text-white text-sm font-nunito transition-colors">
                  Filters
                </span>
              </button>

              {/* View Toggle */}
              <button className="flex items-center justify-center w-11 h-11 rounded-full bg-gradient-to-br from-tyrian-purple-primary to-tyrian-purple-dark backdrop-blur-[50px] hover:scale-105 hover:shadow-md hover:shadow-tyrian-purple-primary/20 transition-transform duration-200">
                <svg className="w-5 h-5 " viewBox="0 0 20 20" fill="none">
                  <path
                    d="M1.66406 15.0013C1.66406 13.7176 1.66406 13.0757 1.953 12.6042C2.11468 12.3404 2.3365 12.1186 2.60034 11.9569C3.07185 11.668 3.7137 11.668 4.9974 11.668C6.2811 11.668 6.92295 11.668 7.39445 11.9569C7.65829 12.1186 7.88011 12.3404 8.04179 12.6042C8.33073 13.0757 8.33073 13.7176 8.33073 15.0013C8.33073 16.285 8.33073 16.9269 8.04179 17.3984C7.88011 17.6622 7.65829 17.8841 7.39445 18.0457C6.92295 18.3346 6.2811 18.3346 4.9974 18.3346C3.7137 18.3346 3.07185 18.3346 2.60034 18.0457C2.3365 17.8841 2.11468 17.6622 1.953 17.3984C1.66406 16.9269 1.66406 16.285 1.66406 15.0013Z"
                    stroke="white"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M11.6641 15.0013C11.6641 13.7176 11.6641 13.0757 11.953 12.6042C12.1146 12.3404 12.3365 12.1186 12.6003 11.9569C13.0718 11.668 13.7137 11.668 14.9974 11.668C16.2811 11.668 16.923 11.668 17.3945 11.9569C17.6583 12.1186 17.8801 12.3404 18.0418 12.6042C18.3307 13.0757 18.3307 13.7176 18.3307 15.0013C18.3307 16.285 18.3307 16.9269 18.0418 17.3984C17.8801 17.6622 17.6583 17.8841 17.3945 18.0457C16.923 18.3346 16.2811 18.3346 14.9974 18.3346C13.7137 18.3346 13.0718 18.3346 12.6003 18.0457C12.3365 17.8841 12.1146 17.6622 11.953 17.3984C11.6641 16.9269 11.6641 16.285 11.6641 15.0013Z"
                    stroke="white"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M2 5.33333C2 4.04963 2 3.40778 2.28894 2.93627C2.45062 2.67244 2.67244 2.45062 2.93627 2.28894C3.40778 2 4.04963 2 5.33333 2C6.61703 2 7.25888 2 7.73039 2.28894C7.99422 2.45062 8.21605 2.67244 8.37772 2.93627C8.66667 3.40778 8.66667 4.04963 8.66667 5.33333C8.66667 6.61703 8.66667 7.25888 8.37772 7.73039C8.21605 7.99422 7.99422 8.21605 7.73039 8.37772C7.25888 8.66667 6.61703 8.66667 5.33333 8.66667C4.04963 8.66667 3.40778 8.66667 2.93627 8.37772C2.67244 8.21605 2.45062 7.99422 2.28894 7.73039C2 7.25888 2 6.61703 2 5.33333Z"
                    stroke="white"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M11.6641 5.0013C11.6641 3.7176 11.6641 3.07575 11.953 2.60424C12.1146 2.34041 12.3365 2.11859 12.6003 1.95691C13.0718 1.66797 13.7137 1.66797 14.9974 1.66797C16.2811 1.66797 16.923 1.66797 17.3945 1.95691C17.6583 2.11859 17.8801 2.34041 18.0418 2.60424C18.3307 3.07575 18.3307 3.7176 18.3307 5.0013C18.3307 6.285 18.3307 6.92685 18.0418 7.39836C17.8801 7.66219 17.6583 7.88402 17.3945 8.04569C16.923 8.33464 16.2811 8.33464 14.9974 8.33464C13.7137 8.33464 13.0718 8.33464 12.6003 8.04569C12.3365 7.88402 12.1146 7.66219 11.953 7.39836C11.6641 6.92685 11.6641 6.285 11.6641 5.0013Z"
                    stroke="white"
                    strokeWidth="1.5"
                  />
                </svg>
              </button>

              {/* Menu Button */}
              <button className="flex items-center justify-center w-11 h-11 rounded-full border border-tyrian-gray-darker glass-card hover:bg-tyrian-purple-dark/30 hover:border-tyrian-purple-primary/50 hover:scale-105 transition-all duration-300 group">
                <svg className="w-5 h-5 " viewBox="0 0 20 20" fill="none">
                  <path
                    d="M1.66406 9.4987C1.66406 8.53345 1.8655 8.33203 2.83073 8.33203H17.1641C18.1293 8.33203 18.3307 8.53345 18.3307 9.4987V10.4987C18.3307 11.4639 18.1293 11.6654 17.1641 11.6654H2.83073C1.8655 11.6654 1.66406 11.4639 1.66406 10.4987V9.4987Z"
                    stroke="#808283"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M1.66406 2.83464C1.66406 1.86941 1.8655 1.66797 2.83073 1.66797H17.1641C18.1293 1.66797 18.3307 1.86941 18.3307 2.83464V3.83464C18.3307 4.79986 18.1293 5.0013 17.1641 5.0013H2.83073C1.8655 5.0013 1.66406 4.79986 1.66406 3.83464V2.83464Z"
                    stroke="#808283"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M1.66406 16.1667C1.66406 15.2014 1.8655 15 2.83073 15H17.1641C18.1293 15 18.3307 15.2014 18.3307 16.1667V17.1667C18.3307 18.1319 18.1293 18.3333 17.1641 18.3333H2.83073C1.8655 18.3333 1.66406 18.1319 1.66406 17.1667V16.1667Z"
                    stroke="#808283"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            {/* Separator */}
            <div className="w-full h-px bg-tyrian-gray-darker mb-6"></div>
          </div>

          {/* Calendar Grid */}
          <div className="w-full rounded-3xl border border-tyrian-gray-darker glass-card backdrop-blur-[50px] p-4 sm:p-6">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
              {/* Navigation */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevMonth}
                  className="flex items-center justify-center w-6 h-6 rounded bg-gradient-to-br from-tyrian-purple-primary to-tyrian-purple-dark hover:scale-105 hover:shadow-md hover:shadow-tyrian-purple-primary/20 transition-transform duration-200"
                >
                  <ChevronLeft className="w-4 h-4 text-white " />
                </button>
                <button
                  onClick={handleNextMonth}
                  className="flex items-center justify-center w-6 h-6 rounded bg-gradient-to-br from-tyrian-purple-primary to-tyrian-purple-dark hover:scale-105 hover:shadow-md hover:shadow-tyrian-purple-primary/20 transition-transform duration-200"
                >
                  <ChevronRight className="w-4 h-4 text-white " />
                </button>
              </div>

              {/* Month/Year */}
              <h2 className="text-white text-sm font-bold font-nunito">
                {currentMonth}
              </h2>

              {/* Events Count */}
              <span className="text-tyrian-gray-medium text-xs font-bold font-nunito uppercase">
                N Events
              </span>
            </div>

            {/* Days of Week Header */}
            <div className="grid grid-cols-7 gap-0 mb-4">
              {weekDays.map((day, index) => (
                <div
                  key={day}
                  className={`h-10 bg-tyrian-gray-darker flex items-center justify-center ${index < 6 ? "border-r border-tyrian-gray-darker" : ""}`}
                >
                  <span className="text-tyrian-gray-medium text-xs font-bold font-nunito uppercase hidden sm:inline">
                    {day}
                  </span>
                  <span className="text-tyrian-gray-medium text-xs font-bold font-nunito uppercase sm:hidden">
                    {day.substring(0, 3)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-0 border border-tyrian-gray-darker rounded-lg overflow-hidden">
              {calendarData.map((day, index) => (
                <div
                  key={`${day.date}-${index}`}
                  className={`min-h-32 p-2 relative transition-all duration-300 hover:bg-tyrian-purple-dark/10 cursor-pointer group ${
                    index % 7 !== 6 ? "border-r border-tyrian-gray-darker" : ""
                  } ${index < calendarData.length - 7 ? "border-b border-tyrian-gray-darker" : ""}`}
                >
                  {/* Date Label */}
                  <div className="mb-2">
                    <span
                      className={`text-xs font-bold font-nunito uppercase transition-colors duration-300 ${
                        day.isPrevMonth
                          ? "text-tyrian-gray-medium opacity-50"
                          : "text-tyrian-gray-medium group-hover:text-white"
                      }`}
                    >
                      {day.date}
                    </span>
                  </div>

                  {/* Events */}
                  <div className="space-y-1">
                    {day.events.map((event, eventIndex) => (
                      <EventCard
                        key={eventIndex}
                        event={event}
                        date={day.date}
                      />
                    ))}

                    {/* Add Event Button - appears on hover if no events or limited events */}
                    {day.events.length === 0 && !day.isPrevMonth && (
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <AddEventButton date={day.date} />
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Fill remaining calendar cells */}
              {Array.from({ length: 35 - calendarData.length }).map(
                (_, index) => (
                  <div
                    key={`empty-${index}`}
                    className={`min-h-32 p-2 relative transition-all duration-300 hover:bg-tyrian-purple-dark/10 cursor-pointer group ${
                      (calendarData.length + index) % 7 !== 6
                        ? "border-r border-tyrian-gray-darker"
                        : ""
                    } ${calendarData.length + index < 28 ? "border-b border-tyrian-gray-darker" : ""}`}
                  >
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <AddEventButton
                        date={`${calendarData.length + index + 1} OCT`}
                      />
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
