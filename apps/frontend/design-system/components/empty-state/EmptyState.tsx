import type { ReactNode } from "react";
import { cx } from "../../lib/cx";
import styles from "./empty-state.module.css";

export interface EmptyStateProps {
  icon?: ReactNode;
  title: ReactNode;
  /** Answers: what belongs here, why is it empty. */
  description?: ReactNode;
  /** The primary next action, plus optional secondary paths. */
  actions?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, actions, className }: EmptyStateProps) {
  return (
    <div className={cx(styles.root, className)}>
      {icon && (
        <span className={styles.icon} aria-hidden>
          {icon}
        </span>
      )}
      <h3 className={styles.title}>{title}</h3>
      {description && <p className={styles.description}>{description}</p>}
      {actions && <div className={styles.actions}>{actions}</div>}
    </div>
  );
}
