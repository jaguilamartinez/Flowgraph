import type { ReactNode } from "react";
import { cx } from "../../lib/cx";
import { StatusIcon, type Status } from "../../lib/status";
import styles from "./alert.module.css";

export interface InlineAlertProps {
  status?: Status;
  title?: ReactNode;
  children: ReactNode;
  /** Follow-up actions, e.g. `Focus node`, `Retry`. */
  actions?: ReactNode;
  className?: string;
}

/**
 * Persistent contextual message. Error copy states what happened, what
 * is affected, and what the user can do next.
 */
export function InlineAlert({
  status = "info",
  title,
  children,
  actions,
  className,
}: InlineAlertProps) {
  return (
    <div
      role={status === "danger" ? "alert" : "status"}
      className={cx(styles.inlineAlert, styles[status], className)}
    >
      <StatusIcon status={status} className={styles.icon} />
      <div className={styles.content}>
        {title && <span className={styles.title}>{title}</span>}
        <span className={styles.bodyText}>{children}</span>
        {actions && <span className={styles.actions}>{actions}</span>}
      </div>
    </div>
  );
}
