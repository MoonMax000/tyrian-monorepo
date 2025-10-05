import React, { useEffect, useRef, useState } from "react";
import {
  X,
  Plus,
  Minus,
  ChevronDown,
  List,
  ListOrdered,
  CheckSquare,
  Type,
  Bold,
  Italic,
  Underline,
} from "lucide-react";

type Reminder = {
  name: string;
  frequency: number;
  text: string;
  sendToTelegram: boolean;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onCreate?: (reminder: Reminder) => void;
};

export default function CreateReminderModal({
  isOpen,
  onClose,
  onCreate,
}: Props) {
  const [name, setName] = useState<string>("");
  const [frequency, setFrequency] = useState<number>(3);
  const [sendToTelegram, setSendToTelegram] = useState<boolean>(false);
  const [formatDropdownOpen, setFormatDropdownOpen] = useState<boolean>(false);
  const editorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => {
        const el = document.querySelector<HTMLInputElement>(
          "#reminder-name-input",
        );
        el?.focus();
      }, 120);
      document.body.style.overflow = "hidden";
      return () => {
        clearTimeout(t);
        document.body.style.overflow = "";
      };
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setName("");
      setFrequency(3);
      setSendToTelegram(false);
      if (editorRef.current) editorRef.current.innerHTML = "";
      setFormatDropdownOpen(false);
    }
  }, [isOpen]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        onClose();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  const modifyFrequency = (delta: number) => {
    setFrequency((prev) => Math.max(1, prev + delta));
  };

  const exec = (command: string, value?: string) => {
    editorRef.current?.focus();
    try {
      document.execCommand(command, false, value);
    } catch (e) {
      // fallback
    }
  };

  const toggleFormatDropdown = () => setFormatDropdownOpen((v) => !v);

  const applyFormatBlock = (block: "p" | "h3") => {
    exec("formatBlock", block === "p" ? "p" : "h3");
    setFormatDropdownOpen(false);
  };

  const insertCheckbox = () => {
    const html =
      '<label style="display:inline-flex;align-items:center;gap:8px;"><input type="checkbox" />&nbsp;</label>';
    exec("insertHTML", html);
  };

  const getEditorHTML = () => editorRef.current?.innerHTML ?? "";

  const handleCreate = () => {
    const reminder: Reminder = {
      name: name.trim(),
      frequency,
      text: getEditorHTML(),
      sendToTelegram,
    };
    if (onCreate) onCreate(reminder);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      aria-modal="true"
      role="dialog"
    >
      <div
        className="absolute inset-0 bg-tyrian-black/50 backdrop-blur-[50px]"
        onClick={onClose}
      />
      <div className="relative w-full max-w-3xl max-h-[90vh] m-4 md:m-8 rounded-2xl glass-card border-tyrian-gray-darker overflow-hidden flex flex-col shadow-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b border-tyrian-gray-darker">
          <h3 className="text-lg font-bold text-white">Psychology</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-tyrian-purple-background/20 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
        <div className="px-6 py-5 overflow-auto">
          <div className="mb-4">
            <label
              htmlFor="reminder-name-input"
              className="block text-sm font-medium text-white mb-2"
            >
              Name of psychology alert
            </label>
            <input
              id="reminder-name-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              className="w-full p-3 rounded-md bg-transparent border border-tyrian-gray-darker text-white focus:ring-2 focus:ring-tyrian-purple-primary outline-none"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-white mb-2">
              Trigger frequency every:{" "}
              <span className="font-bold">{frequency} hours</span>
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={1}
                value={frequency}
                onChange={(e) =>
                  setFrequency(Math.max(1, Number(e.target.value || 1)))
                }
                className="flex-1 p-3 rounded-md bg-transparent border border-tyrian-gray-darker text-tyrian-gray-medium outline-none"
              />
              <button
                type="button"
                onClick={() => modifyFrequency(-1)}
                className="flex w-11 h-11 justify-center items-center rounded-[32px] bg-tyrian-gradient-animated"
              >
                <Minus className="w-6 h-6 text-white" />
              </button>
              <button
                type="button"
                onClick={() => modifyFrequency(1)}
                className="flex w-11 h-11 justify-center items-center rounded-[32px] bg-tyrian-gradient-animated"
              >
                <Plus className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>
          <div className="mb-4 flex items-center justify-end gap-3">
            <input
              id="telegram-checkbox"
              type="checkbox"
              checked={sendToTelegram}
              onChange={(e) => setSendToTelegram(e.target.checked)}
              className="w-4 h-4 rounded border border-tyrian-gray-darker bg-transparent"
            />
            <label
              htmlFor="telegram-checkbox"
              className="text-sm text-white font-bold select-none"
            >
              Send to Telegram
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Text for Reminder
            </label>
            <div className="mb-2 flex items-center gap-2 flex-wrap">
              <div className="relative">
                <button
                  type="button"
                  onClick={toggleFormatDropdown}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-[32px] border border-tyrian-gray-darker bg-transparent text-sm text-white"
                >
                  <span>Regular</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                {formatDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-36 bg-[#0C1014] border border-tyrian-gray-darker rounded-md p-2 shadow-lg z-20">
                    <button
                      type="button"
                      onClick={() => applyFormatBlock("p")}
                      className="w-full text-left px-2 py-1 rounded hover:bg-tyrian-purple-background/10 text-white"
                    >
                      Regular
                    </button>
                    <button
                      type="button"
                      onClick={() => applyFormatBlock("h3")}
                      className="w-full text-left px-2 py-1 rounded hover:bg-tyrian-purple-background/10 text-white"
                    >
                      Heading
                    </button>
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => exec("insertUnorderedList")}
                className="p-2 rounded-[32px] border border-tyrian-gray-darker hover:bg-tyrian-purple-background/10"
              >
                <List className="w-4 h-4 text-white" />
              </button>
              <button
                type="button"
                onClick={() => exec("insertOrderedList")}
                className="p-2 rounded-[32px] border border-tyrian-gray-darker hover:bg-tyrian-purple-background/10"
              >
                <ListOrdered className="w-4 h-4 text-white" />
              </button>
              <button
                type="button"
                onClick={insertCheckbox}
                className="p-2 rounded-[32px] border border-tyrian-gray-darker hover:bg-tyrian-purple-background/10"
              >
                <CheckSquare className="w-4 h-4 text-white" />
              </button>
              <div className="p-2 rounded-[32px] border border-tyrian-gray-darker text-white">
                <Type className="w-4 h-4" />
              </div>
              <button
                type="button"
                onClick={() => exec("bold")}
                className="p-2 rounded-[32px] border border-tyrian-gray-darker hover:bg-tyrian-purple-background/10"
              >
                <Bold className="w-4 h-4 text-white" />
              </button>
              <button
                type="button"
                onClick={() => exec("italic")}
                className="p-2 rounded-[32px] border border-tyrian-gray-darker hover:bg-tyrian-purple-background/10"
              >
                <Italic className="w-4 h-4 text-white" />
              </button>
              <button
                type="button"
                onClick={() => exec("underline")}
                className="p-2 rounded-[32px] border border-tyrian-gray-darker hover:bg-tyrian-purple-background/10"
              >
                <Underline className="w-4 h-4 text-white" />
              </button>
            </div>
            <div
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              className="min-h-[180px] p-4 rounded-md border border-tyrian-gray-darker bg-transparent text-tyrian-gray-medium focus:outline-none"
              style={{ whiteSpace: "pre-wrap" }}
            />
          </div>
        </div>
        <div className="flex items-center justify-center gap-4 px-6 py-4 border-t border-tyrian-gray-darker bg-transparent">
          <button
            type="button"
            onClick={onClose}
            className="flex w-[180px] px-4 py-3 justify-center items-center rounded-[32px] border border-tyrian-gray-darker text-white hover:bg-tyrian-purple-background/6 font-bold"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleCreate}
            className="flex w-[180px] px-4 py-3 justify-center items-center rounded-[32px] text-white bg-tyrian-gradient-animated hover:opacity-95 font-bold"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
