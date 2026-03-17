"use client";

import { useEffect } from "react";
import { create } from "zustand";
import { useIsClient } from "@/lib/use-is-client";

interface ToastState {
  message: string;
  visible: boolean;
  show: (message: string) => void;
  hide: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  message: "",
  visible: false,
  show: (message) => set({ message, visible: true }),
  hide: () => set({ visible: false }),
}));

export default function CartToast() {
  const { message, visible, hide } = useToastStore();
  const mounted = useIsClient();

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => hide(), 3000);
      return () => clearTimeout(timer);
    }
  }, [visible, hide]);

  if (!mounted) return null;

  return (
    <div
      className={`fixed bottom-24 right-6 z-50 transition-all duration-300 ease-out ${
        visible
          ? "translate-x-0 opacity-100"
          : "translate-x-full opacity-0 pointer-events-none"
      }`}
    >
      <div className="bg-surface/80 backdrop-blur-lg rounded-xl p-4 shadow-xl border border-white/20 max-w-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-success"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <p className="text-sm text-text-primary font-medium">{message}</p>
        </div>
      </div>
    </div>
  );
}
