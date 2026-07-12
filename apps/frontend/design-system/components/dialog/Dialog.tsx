"use client";

import { X } from "lucide-react";
import { Dialog as RadixDialog } from "radix-ui";
import type { ReactNode } from "react";
import { cx } from "../../lib/cx";
import { IconButton } from "../button/IconButton";
import styles from "./dialog.module.css";

/**
 * Modal dialog. Reserved for flows that genuinely block — confirmation
 * of destructive actions, required setup input. Routine editing stays
 * in panels to preserve spatial context (product spec §7.2).
 */
export const Dialog = RadixDialog.Root;
export const DialogTrigger = RadixDialog.Trigger;
export const DialogClose = RadixDialog.Close;

export interface DialogContentProps {
  title: ReactNode;
  /** Optional supporting sentence under the title. */
  description?: ReactNode;
  children?: ReactNode;
  /** Footer actions, usually DialogClose-wrapped buttons. */
  footer?: ReactNode;
  size?: "md" | "wide";
  className?: string;
}

export function DialogContent({
  title,
  description,
  children,
  footer,
  size = "md",
  className,
}: DialogContentProps) {
  return (
    <RadixDialog.Portal>
      <RadixDialog.Overlay className={styles.overlay} />
      <RadixDialog.Content
        className={cx(styles.content, size === "wide" && styles.wide, className)}
      >
        <div className={styles.header}>
          <div className={styles.headings}>
            <RadixDialog.Title className={styles.title}>{title}</RadixDialog.Title>
            {description && (
              <RadixDialog.Description className={styles.description}>
                {description}
              </RadixDialog.Description>
            )}
          </div>
          <RadixDialog.Close asChild>
            <IconButton label="Close dialog" size="sm">
              <X size={16} aria-hidden />
            </IconButton>
          </RadixDialog.Close>
        </div>
        {children && <div className={styles.body}>{children}</div>}
        {footer && <div className={styles.footer}>{footer}</div>}
      </RadixDialog.Content>
    </RadixDialog.Portal>
  );
}
