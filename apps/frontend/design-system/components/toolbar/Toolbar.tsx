"use client";

import { Toolbar as RadixToolbar } from "radix-ui";
import type { ComponentPropsWithRef } from "react";
import { cx } from "../../lib/cx";
import styles from "./toolbar.module.css";

export interface ToolbarProps extends ComponentPropsWithRef<typeof RadixToolbar.Root> {
  /** Accessible name, e.g. `Canvas tools`. */
  "aria-label": string;
}

/**
 * Keyboard-navigable action row (arrow keys move, one tab stop).
 * Compose with Button/IconButton via ToolbarButton asChild.
 */
export function Toolbar({ className, ...props }: ToolbarProps) {
  return <RadixToolbar.Root className={cx(styles.root, className)} {...props} />;
}

export const ToolbarButton = RadixToolbar.Button;

export function ToolbarSeparator() {
  return <RadixToolbar.Separator className={styles.separator} />;
}

export type ToolbarToggleGroupProps = ComponentPropsWithRef<
  typeof RadixToolbar.ToggleGroup
>;

export function ToolbarToggleGroup(props: ToolbarToggleGroupProps) {
  return <RadixToolbar.ToggleGroup {...props} />;
}

export type ToolbarToggleItemProps = ComponentPropsWithRef<
  typeof RadixToolbar.ToggleItem
>;

export function ToolbarToggleItem({ className, ...props }: ToolbarToggleItemProps) {
  return (
    <RadixToolbar.ToggleItem className={cx(styles.toggleItem, className)} {...props} />
  );
}
