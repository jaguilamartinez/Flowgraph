"use client";

import { AlertDialog as RadixAlertDialog } from "radix-ui";
import type { ReactNode } from "react";
import { cx } from "../../lib/cx";
import { Button } from "../button/Button";
import styles from "./dialog.module.css";

/**
 * Confirmation for destructive or irreversible actions. Focus lands on
 * Cancel; the action states its consequence in plain language.
 */
export const AlertDialog = RadixAlertDialog.Root;
export const AlertDialogTrigger = RadixAlertDialog.Trigger;

export interface AlertDialogContentProps {
  title: ReactNode;
  /** What happens, what is affected, and whether it can be undone. */
  description: ReactNode;
  /** Verb-first action label, e.g. `Delete project`. */
  actionLabel: string;
  cancelLabel?: string;
  onAction?: () => void;
  /** Marks the action destructive (danger styling). */
  destructive?: boolean;
  children?: ReactNode;
  className?: string;
}

export function AlertDialogContent({
  title,
  description,
  actionLabel,
  cancelLabel = "Cancel",
  onAction,
  destructive = false,
  children,
  className,
}: AlertDialogContentProps) {
  return (
    <RadixAlertDialog.Portal>
      <RadixAlertDialog.Overlay className={styles.overlay} />
      <RadixAlertDialog.Content className={cx(styles.content, className)}>
        <div className={styles.header}>
          <div className={styles.headings}>
            <RadixAlertDialog.Title className={styles.title}>
              {title}
            </RadixAlertDialog.Title>
            <RadixAlertDialog.Description className={styles.description}>
              {description}
            </RadixAlertDialog.Description>
          </div>
        </div>
        {children && <div className={styles.body}>{children}</div>}
        <div className={styles.footer}>
          <RadixAlertDialog.Cancel asChild>
            <Button variant="secondary">{cancelLabel}</Button>
          </RadixAlertDialog.Cancel>
          <RadixAlertDialog.Action asChild>
            <Button variant={destructive ? "danger" : "primary"} onClick={onAction}>
              {actionLabel}
            </Button>
          </RadixAlertDialog.Action>
        </div>
      </RadixAlertDialog.Content>
    </RadixAlertDialog.Portal>
  );
}
