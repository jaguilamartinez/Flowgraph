import type { ReactNode } from "react";
import { cx } from "../../lib/cx";
import type { Status } from "../../lib/status";
import styles from "./status.module.css";

export interface BadgeProps {
  status?: Status;
  children: ReactNode;
  /** Optional leading icon; the text label is always required. */
  icon?: ReactNode;
  /** Monospace with tabular numerals — versions, counts, identifiers. */
  mono?: boolean;
  className?: string;
}

/** Compact metadata label: environment, revision, count, category. */
export function Badge({ status = "neutral", children, icon, mono, className }: BadgeProps) {
  return (
    <span
      className={cx(styles.badge, styles[status], mono && styles.badgeMono, className)}
    >
      {icon}
      {children}
    </span>
  );
}
