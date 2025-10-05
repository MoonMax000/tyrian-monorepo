import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PortfolioProvider } from "./contexts/PortfolioContext";
import Header from "./components/Header";
import NewSidebar from "./components/NewSidebar";
import RightSidebar from "./components/RightSidebar";
import Footer from "./components/Footer";
import BackgroundRibbons from "./components/BackgroundRibbons";
import Index from "./pages/Index";
import PortfolioDetail from "./pages/PortfolioDetail";
import FollowingPortfolios from "./pages/FollowingPortfolios";
import SignalsView from "./pages/SignalsView";
import Calendar from "./pages/Calendar";
import NewListings from "./pages/NewListings";
import Quotes from "./pages/Quotes";
import Screener from "./pages/Screener";
import Psychology from "./pages/Psychology";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <PortfolioProvider>
        <BrowserRouter>
          <div className="relative min-h-screen bg-tyrian-black text-white font-nunito flex flex-col overflow-x-hidden">
            {/* Background ribbons - global for all pages */}
            <BackgroundRibbons />

            {/* Header */}
            <Header
              onMenuClick={() => setRightSidebarOpen(!rightSidebarOpen)}
            />

            {/* Main Layout - flex container matching original structure */}
            <div className="relative z-10 flex justify-start pt-16 mb-60">
              {/* Left Sidebar */}
              <NewSidebar />

              {/* Main Content */}
              <main className="flex-1">
                <div className="min-h-[calc(100vh-4rem)] flex flex-col">
                  <div className="flex-1">
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route
                        path="/portfolio/:portfolioId"
                        element={<PortfolioDetail />}
                      />
                      <Route
                        path="/following-portfolios"
                        element={<FollowingPortfolios />}
                      />
                      <Route path="/signals" element={<SignalsView />} />
                      <Route path="/calendar" element={<Calendar />} />
                      <Route path="/quotes" element={<Quotes />} />
                      <Route path="/screener" element={<Screener />} />
                      <Route path="/new-listings" element={<NewListings />} />
                      <Route path="/psychology" element={<Psychology />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </div>

                  {/* Footer */}
                  <Footer />
                </div>
              </main>

              {/* Right Sidebar - collapses to width 0 when closed */}
              <RightSidebar
                isOpen={rightSidebarOpen}
                onClose={() => setRightSidebarOpen(false)}
              />
            </div>
          </div>
        </BrowserRouter>
      </PortfolioProvider>
    </QueryClientProvider>
  );
}

export default App;
