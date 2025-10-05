import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PersistentNav from "../components/PersistentNav";
import Breadcrumbs from "../components/Breadcrumbs";
import { Search, ChevronDown } from "lucide-react";

interface NotificationItem {
  id: string;
  exchange: string;
  date: string;
}

const NewListings: React.FC = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"coin" | "exchange" | "date">("coin");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const notifications: NotificationItem[] = Array.from(
    { length: 20 },
    (_, i) => ({
      id: "ID",
      exchange: ["Bitget Spot", "Gate Spot", "Gate Futures"][i % 3],
      date: "03.08.25 , 13:44",
    }),
  );

  const itemsPerPage = 20;
  const totalPages = Math.ceil(notifications.length / itemsPerPage);

  const handleSort = (column: "coin" | "exchange" | "date") => {
    if (sortBy === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortDirection("asc");
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="relative w-full">
      <div className="relative z-10 w-full max-w-[1293px] mx-auto px-3 sm:px-4 lg:px-0 py-6 sm:py-8">
        <Breadcrumbs />
        <PersistentNav />

        <div className="mt-6 sm:mt-8 space-y-6">
          <h1 className="text-white text-xl sm:text-2xl font-bold font-nunito">
            New Listings
          </h1>

          <div className="w-full p-4 flex flex-col items-start gap-6 rounded-xl border border-tyrian-gray-darker bg-tyrian-dark/50 backdrop-blur-[50px]">
            <div className="flex flex-col items-start gap-2 w-full">
              <h2 className="text-white text-xl sm:text-2xl font-bold font-nunito">
                Notifications
              </h2>
              <p className="text-tyrian-gray-medium text-sm sm:text-base font-normal font-nunito leading-normal">
                To receive notifications about new listings, you need to:
                <br />
                Go to the Notifications section
                <br />
                Create a notification in the Listings block
              </p>
            </div>
            <button className="flex w-full sm:w-auto px-4 py-3 justify-center items-center gap-2 rounded-[32px] bg-tyrian-gradient-animated backdrop-blur-[58px] hover-lift">
              <span className="text-white text-center text-sm sm:text-base font-bold font-nunito">
                Go to Settings
              </span>
            </button>
          </div>

          <div className="w-full flex flex-col items-center gap-6">
            <div className="w-full flex flex-col items-start rounded-xl border border-tyrian-gray-darker bg-tyrian-black/50 backdrop-blur-[50px]">
              <div className="flex flex-col sm:flex-row w-full p-4 justify-between items-start sm:items-center gap-4">
                <h2 className="text-white text-xl sm:text-2xl font-bold font-nunito">
                  Notifications
                </h2>
                <div className="flex w-full sm:w-[220px] items-center gap-4">
                  <div className="flex flex-1 h-10 px-3 py-2.5 items-center gap-2 rounded-lg border border-tyrian-gray-darker bg-tyrian-dark/50 backdrop-blur-[50px]">
                    <Search className="w-5 h-5 sm:w-6 sm:h-6 text-tyrian-gray-medium flex-shrink-0" />
                    <input
                      type="text"
                      placeholder="Search coins"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 bg-transparent text-tyrian-gray-medium text-sm sm:text-base font-normal font-nunito outline-none placeholder:text-tyrian-gray-medium"
                    />
                  </div>
                </div>
              </div>

              <div className="hidden sm:flex w-full px-4 py-4 items-center gap-4 border-t border-b border-tyrian-gray-darker">
                <div className="flex items-center flex-1">
                  <button
                    onClick={() => handleSort("coin")}
                    className="flex items-center gap-2 text-white text-xs font-bold font-nunito uppercase tracking-wide hover:text-tyrian-purple-primary transition-colors"
                  >
                    COIN / CONTRACT
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${sortBy === "coin" && sortDirection === "desc" ? "rotate-180" : ""}`}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-center flex-1">
                  <button
                    onClick={() => handleSort("exchange")}
                    className="flex items-center gap-2 text-white text-xs font-bold font-nunito uppercase tracking-wide hover:text-tyrian-purple-primary transition-colors"
                  >
                    EXCHANGE
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${sortBy === "exchange" && sortDirection === "desc" ? "rotate-180" : ""}`}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-end flex-1">
                  <button
                    onClick={() => handleSort("date")}
                    className="flex items-center gap-2 text-white text-xs font-bold font-nunito uppercase tracking-wide hover:text-tyrian-purple-primary transition-colors"
                  >
                    DATE
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${sortBy === "date" && sortDirection === "desc" ? "rotate-180" : ""}`}
                    />
                  </button>
                </div>
              </div>

              {notifications.map((notification, index) => (
                <React.Fragment key={index}>
                  <div className="flex flex-col sm:flex-row w-full h-auto sm:h-14 px-4 py-3 sm:py-0 items-start sm:items-center gap-3 sm:gap-4">
                    <div className="flex items-center gap-1 flex-1 w-full sm:w-auto">
                      <span className="text-tyrian-gray-medium text-xs font-bold font-nunito sm:hidden">
                        COIN:
                      </span>
                      <span className="text-white text-xs sm:text-sm font-bold font-nunito">
                        {notification.id}
                      </span>
                    </div>
                    <div className="flex flex-col justify-center items-start sm:items-center flex-1 w-full sm:w-auto">
                      <span className="text-tyrian-gray-medium text-xs font-bold font-nunito sm:hidden">
                        EXCHANGE:
                      </span>
                      <span className="text-tyrian-purple-primary text-xs sm:text-sm font-bold font-nunito">
                        {notification.exchange}
                      </span>
                    </div>
                    <div className="flex flex-col justify-center items-start sm:items-end flex-1 w-full sm:w-auto">
                      <span className="text-tyrian-gray-medium text-xs font-bold font-nunito sm:hidden">
                        DATE:
                      </span>
                      <span className="text-white text-xs sm:text-sm font-bold font-nunito">
                        {notification.date}
                      </span>
                    </div>
                  </div>
                  {index < notifications.length - 1 && (
                    <div className="w-full h-px bg-tyrian-gray-darker" />
                  )}
                </React.Fragment>
              ))}
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="flex w-11 h-11 p-2.5 flex-col justify-center items-center gap-2 rounded border border-tyrian-gray-darker bg-tyrian-black/50 backdrop-blur-[50px] hover:bg-tyrian-purple-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="First page"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M14.6569 15L15.8319 13.825L12.0153 10L15.8319 6.175L14.6569 5L9.65686 10L14.6569 15Z"
                    fill="#B0B0B0"
                  />
                  <path
                    d="M9.16475 15L10.3398 13.825L6.52314 10L10.3398 6.175L9.16475 5L4.16475 10L9.16475 15Z"
                    fill="#B0B0B0"
                  />
                </svg>
              </button>

              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex w-11 h-11 p-2.5 flex-col justify-center items-center gap-2 rounded border border-tyrian-gray-darker bg-tyrian-black/50 backdrop-blur-[50px] hover:bg-tyrian-purple-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Previous page"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M12.5749 15L13.7499 13.825L9.93324 10L13.7499 6.175L12.5749 5L7.57491 10L12.5749 15Z"
                    fill="#B0B0B0"
                  />
                </svg>
              </button>

              {[1, 2, 3, 4].map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`flex w-11 h-11 p-2 flex-col justify-center items-center gap-2.5 rounded transition-colors ${
                    currentPage === page
                      ? "bg-tyrian-gradient-animated"
                      : "border border-tyrian-gray-darker bg-tyrian-black/50 backdrop-blur-[50px] hover:bg-tyrian-purple-primary/20"
                  }`}
                >
                  <span
                    className={`text-center text-sm sm:text-base font-bold font-nunito ${
                      currentPage === page
                        ? "text-white"
                        : "text-tyrian-gray-medium"
                    }`}
                  >
                    {page}
                  </span>
                </button>
              ))}

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex w-11 h-11 p-2.5 flex-col justify-center items-center gap-2 rounded border border-tyrian-gray-darker bg-tyrian-black/50 backdrop-blur-[50px] hover:bg-tyrian-purple-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Next page"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M8.67491 5L7.49991 6.175L11.3166 10L7.49991 13.825L8.67491 15L13.6749 10L8.67491 5Z"
                    fill="#B0B0B0"
                  />
                </svg>
              </button>

              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="flex w-11 h-11 p-2.5 flex-col justify-center items-center gap-2 rounded border border-tyrian-gray-darker bg-tyrian-black/50 backdrop-blur-[50px] hover:bg-tyrian-purple-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Last page"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M5.34289 5L4.16789 6.175L7.98456 10L4.16789 13.825L5.34289 15L10.3429 10L5.34289 5Z"
                    fill="#B0B0B0"
                  />
                  <path
                    d="M10.8351 5L9.66011 6.175L13.4768 10L9.66011 13.825L10.8351 15L15.8351 10L10.8351 5Z"
                    fill="#B0B0B0"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewListings;
