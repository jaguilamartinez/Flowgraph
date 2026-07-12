"use client";

import { X } from "lucide-react";
import { Toast as RadixToast } from "radix-ui";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { cx } from "../../lib/cx";
import { StatusIcon, type Status } from "../../lib/status";
import { IconButton } from "../button/IconButton";
import styles from "./toast.module.css";

export interface ToastOptions {
  title: string;
  description?: string;
  status?: Status;
  /** Milliseconds before auto-dismiss. */
  duration?: number;
}

interface ToastContextValue {
  toast: (options: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

/**
 * Imperative toast API. The nearest ToastProvider renders the queue.
 * Toasts are transient confirmations only — never the sole location of
 * error details or required actions.
 */
export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast requires a ToastProvider ancestor");
  }
  return context;
}

interface ToastEntry extends ToastOptions {
  id: number;
}

const statusIconClass: Record<Status, string> = {
  neutral: styles.iconNeutral,
  info: styles.iconInfo,
  success: styles.iconSuccess,
  warning: styles.iconWarning,
  danger: styles.iconDanger,
  proposal: styles.iconProposal,
};

let nextToastId = 1;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastEntry[]>([]);

  const toast = useCallback((options: ToastOptions) => {
    setToasts((current) => [...current, { id: nextToastId++, ...options }]);
  }, []);

  const remove = useCallback((id: number) => {
    setToasts((current) => current.filter((entry) => entry.id !== id));
  }, []);

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      <RadixToast.Provider swipeDirection="right" duration={5000}>
        {children}
        {toasts.map((entry) => {
          const status = entry.status ?? "neutral";
          return (
            <RadixToast.Root
              key={entry.id}
              className={styles.toast}
              duration={entry.duration}
              onOpenChange={(open) => {
                if (!open) remove(entry.id);
              }}
            >
              <StatusIcon
                status={status}
                className={cx(styles.icon, statusIconClass[status])}
              />
              <div className={styles.content}>
                <RadixToast.Title className={styles.title}>{entry.title}</RadixToast.Title>
                {entry.description && (
                  <RadixToast.Description className={styles.description}>
                    {entry.description}
                  </RadixToast.Description>
                )}
              </div>
              <RadixToast.Close asChild>
                <IconButton label="Dismiss notification" size="sm">
                  <X size={14} aria-hidden />
                </IconButton>
              </RadixToast.Close>
            </RadixToast.Root>
          );
        })}
        <RadixToast.Viewport className={styles.viewport} label="Notifications" />
      </RadixToast.Provider>
    </ToastContext.Provider>
  );
}
