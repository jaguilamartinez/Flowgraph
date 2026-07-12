import { CircleAlert } from "lucide-react";
import type { ReactNode } from "react";
import { cx } from "../../lib/cx";
import styles from "./empty-state.module.css";

export interface ErrorStateProps {
  /** What happened, in plain language. */
  title: ReactNode;
  /** What is affected and what the user can do next. */
  description?: ReactNode;
  /** Recovery actions — retry, go back, open diagnostics. */
  actions?: ReactNode;
  /** Stable diagnostic/support code, shown in monospace. */
  supportCode?: string;
  className?: string;
}

/** Full-area failure state with optional recovery actions. */
export function ErrorState({
  title,
  description,
  actions,
  supportCode,
  className,
}: ErrorStateProps) {
  return (
    <div role="alert" className={cx(styles.root, className)}>
      <span className={cx(styles.icon, styles.iconDanger)} aria-hidden>
        <CircleAlert size={20} />
      </span>
      <h3 className={styles.title}>{title}</h3>
      {description && <p className={styles.description}>{description}</p>}
      {actions && <div className={styles.actions}>{actions}</div>}
      {supportCode && <span className={styles.supportCode}>Support code: {supportCode}</span>}
    </div>
  );
}
