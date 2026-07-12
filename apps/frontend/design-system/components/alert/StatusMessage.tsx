"use client";

import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";
import { cx } from "../../lib/cx";
import { StatusIcon, type Status } from "../../lib/status";
import styles from "./alert.module.css";

export interface StatusMessageProps {
  status?: Status;
  /** Shows an activity spinner instead of the status icon. */
  busy?: boolean;
  children: ReactNode;
  /**
   * Announce updates to assistive technology. Use for state that changes
   * in place (save state, validation), per WCAG 4.1.3. Announcements are
   * polite; they never steal focus.
   */
  announce?: boolean;
  className?: string;
}

/**
 * Quiet inline status line: `Saved`, `Saving…`, `Validation out of date`.
 * Independent state dimensions stay separate — render one StatusMessage
 * per dimension rather than collapsing readiness into one indicator.
 */
export function StatusMessage({
  status = "neutral",
  busy = false,
  children,
  announce = false,
  className,
}: StatusMessageProps) {
  return (
    <span
      role={announce ? "status" : undefined}
      className={cx(styles.statusMessage, styles[status], className)}
    >
      {busy ? (
        <Loader2 size={13} aria-hidden className={styles.spinner} />
      ) : (
        <StatusIcon status={status} size={13} className={styles.statusMessageIcon} />
      )}
      {children}
    </span>
  );
}
