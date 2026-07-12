"use client";

import { ChevronDown } from "lucide-react";
import { Accordion as RadixAccordion } from "radix-ui";
import type { ReactNode } from "react";
import { cx } from "../../lib/cx";
import styles from "./disclosure.module.css";

export type AccordionProps = {
  children: ReactNode;
  className?: string;
} & (
  | {
      type: "single";
      collapsible?: boolean;
      value?: string;
      defaultValue?: string;
      onValueChange?: (value: string) => void;
    }
  | {
      type: "multiple";
      value?: string[];
      defaultValue?: string[];
      onValueChange?: (value: string[]) => void;
    }
);

export function Accordion({ children, className, ...props }: AccordionProps) {
  return (
    <RadixAccordion.Root className={cx(styles.accordion, className)} {...props}>
      {children}
    </RadixAccordion.Root>
  );
}

export interface AccordionItemProps {
  value: string;
  title: ReactNode;
  children: ReactNode;
  disabled?: boolean;
  className?: string;
}

export function AccordionItem({
  value,
  title,
  children,
  disabled,
  className,
}: AccordionItemProps) {
  return (
    <RadixAccordion.Item value={value} disabled={disabled} className={cx(styles.item, className)}>
      <RadixAccordion.Header asChild>
        <h3 style={{ margin: 0 }}>
          <RadixAccordion.Trigger className={styles.trigger}>
            {title}
            <ChevronDown size={14} aria-hidden className={styles.chevron} />
          </RadixAccordion.Trigger>
        </h3>
      </RadixAccordion.Header>
      <RadixAccordion.Content className={styles.panel}>{children}</RadixAccordion.Content>
    </RadixAccordion.Item>
  );
}
