import React, { ReactNode } from "react";
import { XIcon } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/40 backdrop-blur-xs p-4">
      <div className="w-full max-w-lg rounded-lg border border-ink-100 bg-white p-6 shadow-pop animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-ink-100 pb-3">
          <h3 className="text-sm font-semibold text-ink-900">{title}</h3>
          <button
            onClick={onClose}
            className="rounded p-1 text-ink-400 hover:bg-ink-50 hover:text-ink-700"
          >
            <XIcon className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
};