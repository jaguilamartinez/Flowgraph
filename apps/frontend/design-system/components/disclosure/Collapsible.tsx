"use client";

import { ChevronRight } from "lucide-react";
import { Collapsible as RadixCollapsible } from "radix-ui";
import type { ReactNode } from "react";
import { cx } from "../../lib/cx";
import styles from "./disclosure.module.css";

export interface CollapsibleProps {
  /** Trigger label, e.g. `Advanced settings`. */
  label: ReactNode;
  children: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  className?: string;
}

/** Inline disclosure for secondary content such as advanced options. */
export function Collapsible({
  label,
  children,
  open,
  defaultOpen,
  onOpenChange,
  disabled,
  className,
}: CollapsibleProps) {
  return (
    <RadixCollapsible.Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      disabled={disabled}
      className={className}
    >
      <RadixCollapsible.Trigger className={cx(styles.collapsibleTrigger)}>
        <ChevronRight size={14} aria-hidden className={styles.collapsibleChevron} />
        {label}
      </RadixCollapsible.Trigger>
      <RadixCollapsible.Content className={styles.collapsibleContent}>
        {children}
      </RadixCollapsible.Content>
    </RadixCollapsible.Root>
  );
}
