"use client";

import { X } from "lucide-react";
import type { ReactNode } from "react";
import { cx } from "../../lib/cx";
import { StatusIcon, type Status } from "../../lib/status";
import { IconButton } from "../button/IconButton";
import styles from "./alert.module.css";

export interface BannerProps {
  status?: Status;
  children: ReactNode;
  /** Inline action, e.g. a Reconnect button. */
  action?: ReactNode;
  /** Renders a dismiss control. Blocking conditions should not be dismissible. */
  onDismiss?: () => void;
  className?: string;
}

/**
 * Full-width persistent strip for workspace-level conditions
 * (connection lost, policy notices). Not for transient confirmations —
 * use Toast for those.
 */
export function Banner({ status = "info", children, action, onDismiss, className }: BannerProps) {
  return (
    <div
      role={status === "danger" ? "alert" : "status"}
      className={cx(styles.banner, styles[status], className)}
    >
      <StatusIcon status={status} className={styles.icon} />
      <span className={styles.bannerText}>{children}</span>
      {action}
      {onDismiss && (
        <IconButton label="Dismiss" size="sm" onClick={onDismiss}>
          <X size={14} aria-hidden />
        </IconButton>
      )}
    </div>
  );
}
