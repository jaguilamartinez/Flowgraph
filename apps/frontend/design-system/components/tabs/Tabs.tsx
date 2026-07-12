"use client";

import { Tabs as RadixTabs } from "radix-ui";
import type { ComponentPropsWithRef, ReactNode } from "react";
import { cx } from "../../lib/cx";
import styles from "./tabs.module.css";

export const Tabs = RadixTabs.Root;

export interface TabsListProps extends ComponentPropsWithRef<typeof RadixTabs.List> {
  /** Accessible name for the tab list, e.g. `Workspace panels`. */
  "aria-label": string;
}

export function TabsList({ className, ...props }: TabsListProps) {
  return <RadixTabs.List className={cx(styles.list, className)} {...props} />;
}

export interface TabsTriggerProps
  extends ComponentPropsWithRef<typeof RadixTabs.Trigger> {
  icon?: ReactNode;
  /** Numeric badge, e.g. diagnostic count. */
  count?: number;
}

export function TabsTrigger({
  icon,
  count,
  className,
  children,
  ...props
}: TabsTriggerProps) {
  return (
    <RadixTabs.Trigger className={cx(styles.trigger, className)} {...props}>
      {icon}
      {children}
      {typeof count === "number" && <span className={styles.count}>{count}</span>}
    </RadixTabs.Trigger>
  );
}

export type TabsContentProps = ComponentPropsWithRef<typeof RadixTabs.Content>;

export function TabsContent({ className, ...props }: TabsContentProps) {
  return <RadixTabs.Content className={cx(styles.content, className)} {...props} />;
}
