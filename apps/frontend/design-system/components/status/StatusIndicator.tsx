import type { ReactNode } from "react";
import { cx } from "../../lib/cx";
import type { Status } from "../../lib/status";
import styles from "./status.module.css";

export interface StatusIndicatorProps {
  status?: Status;
  /** Marks live activity with a pulsing dot (honors reduced motion). */
  running?: boolean;
  /** Plain-language state, e.g. `Running`, `2 warnings`. Required — status is never color-only. */
  children: ReactNode;
  /** Supplementary technical detail, e.g. elapsed time or an ID. */
  detail?: ReactNode;
  className?: string;
}

/** Dot-plus-text state marker for rows, headers, and run lifecycles. */
export function StatusIndicator({
  status = "neutral",
  running = false,
  children,
  detail,
  className,
}: StatusIndicatorProps) {
  return (
    <span className={cx(styles.indicator, styles[status], running && styles.running, className)}>
      <span className={styles.dot} aria-hidden />
      {children}
      {detail && <span className={styles.indicatorDetail}>{detail}</span>}
    </span>
  );
}
