import React, { useState } from "react";
import PersistentNav from "../components/PersistentNav";
import Breadcrumbs from "../components/Breadcrumbs";
import CreateReminderModal from "../components/CreateReminderModal";
import { Plus, Edit2, Trash2, Play } from "lucide-react";

interface Reminder {
  id: string;
  title: string;
  interval: string;
  lastTriggered: string;
  category: string;
  showInSidebar: boolean;
}

const Psychology: React.FC = () => {
  const [reminders, setReminders] = useState<Reminder[]>([
    {
      id: "1",
      title: "Read before the trade",
      interval: "3 hours",
      lastTriggered: "August 3, 2025, 09:45:54",
      category: "Psychological Reminder",
      showInSidebar: true,
    },
  ]);

  const [showInSidebar, setShowInSidebar] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleDelete = (id: string) =>
    setReminders((prev) => prev.filter((r) => r.id !== id));

  const handleCreate = (reminder: {
    name: string;
    frequency: number;
    text: string;
    sendToTelegram: boolean;
  }) => {
    const newReminder: Reminder = {
      id: Date.now().toString(),
      title: reminder.name,
      interval: `${reminder.frequency} hours`,
      lastTriggered: "Never",
      category: "Psychological Reminder",
      showInSidebar: false,
    };
    setReminders((prev) => [newReminder, ...prev]);
  };

  return (
    <div className="relative w-full">
      <div className="relative z-10 w-full max-w-[1293px] mx-auto px-3 sm:px-4 lg:px-0 py-6 sm:py-8">
        <Breadcrumbs />
        <PersistentNav />

        <div className="mt-6 sm:mt-8 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-white text-xl sm:text-2xl font-bold font-nunito">
              Psychology
            </h1>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-[32px] bg-tyrian-gradient-animated backdrop-blur-[58px] hover-lift"
            >
              <Plus className="w-5 h-5 text-white" />
              <span className="text-white text-sm font-bold font-nunito">
                Create
              </span>
            </button>
          </div>

          <div className="w-full rounded-xl border border-tyrian-gray-darker bg-tyrian-black/50 backdrop-blur-[50px] p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white text-lg sm:text-xl font-bold font-nunito">
                Reminders
              </h2>
            </div>
            <div className="w-full h-px bg-tyrian-gray-darker mb-4" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {reminders.map((r) => (
                <div
                  key={r.id}
                  className="rounded-xl border border-tyrian-gray-darker p-4"
                  style={{ backgroundColor: "#2E2744" }}
                >
                  <div className="flex flex-col gap-3">
                    <h3 className="text-white text-lg font-bold font-nunito">
                      {r.title}
                    </h3>
                    <div className="flex items-center gap-1">
                      <span className="text-tyrian-gray-medium text-sm font-nunito">
                        Every:
                      </span>
                      <span className="text-white text-sm font-bold font-nunito">
                        {r.interval}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-tyrian-gray-medium text-sm font-nunito">
                        Last triggered:
                      </span>
                      <span className="text-white text-sm font-bold font-nunito">
                        {r.lastTriggered}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="px-2 py-1 rounded-md border border-[#2E2744] bg-[rgba(11,14,17,0.50)]">
                        <span className="text-white text-sm font-bold font-nunito">
                          {r.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="flex w-10 h-10 justify-center items-center rounded-[32px] bg-tyrian-gradient-animated">
                          <Edit2 className="w-4 h-4 text-white" />
                        </button>
                        <button
                          onClick={() => handleDelete(r.id)}
                          className="flex w-10 h-10 justify-center items-center rounded-[32px] bg-tyrian-gradient-animated"
                        >
                          <Trash2 className="w-4 h-4 text-white" />
                        </button>
                        <button className="flex w-10 h-10 justify-center items-center rounded-[32px] bg-tyrian-gradient-animated">
                          <Play className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="w-full h-px bg-tyrian-gray-darker my-6" />

            <div className="flex items-center justify-between">
              <span className="text-white text-sm font-bold font-nunito">
                Show in sidebar
              </span>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={showInSidebar}
                  onChange={() => setShowInSidebar((v) => !v)}
                  className="sr-only peer"
                />
                <div className="relative w-[38px] h-5 rounded-full transition-all duration-200 peer-checked:bg-tyrian-gradient-animated bg-tyrian-gray-darker">
                  <div
                    className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${showInSidebar ? "translate-x-[18px]" : "translate-x-0.5"}`}
                  />
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>

      <CreateReminderModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreate}
      />
    </div>
  );
};

export default Psychology;
