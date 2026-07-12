"use client";

import { Check } from "lucide-react";
import { DropdownMenu as RadixDropdownMenu } from "radix-ui";
import type { ComponentPropsWithRef, ReactNode } from "react";
import { cx } from "../../lib/cx";
import styles from "./menu.module.css";

export const DropdownMenu = RadixDropdownMenu.Root;
export const DropdownMenuTrigger = RadixDropdownMenu.Trigger;

export type DropdownMenuContentProps = ComponentPropsWithRef<
  typeof RadixDropdownMenu.Content
>;

export function DropdownMenuContent({
  className,
  sideOffset = 4,
  collisionPadding = 8,
  ...props
}: DropdownMenuContentProps) {
  return (
    <RadixDropdownMenu.Portal>
      <RadixDropdownMenu.Content
        className={cx(styles.content, className)}
        sideOffset={sideOffset}
        collisionPadding={collisionPadding}
        {...props}
      />
    </RadixDropdownMenu.Portal>
  );
}

export interface DropdownMenuItemProps
  extends ComponentPropsWithRef<typeof RadixDropdownMenu.Item> {
  icon?: ReactNode;
  /** Display-only shortcut hint, e.g. `⌘K`. */
  shortcut?: string;
  /** Destructive action styling; rendered with the danger color role. */
  destructive?: boolean;
}

export function DropdownMenuItem({
  icon,
  shortcut,
  destructive,
  className,
  children,
  ...props
}: DropdownMenuItemProps) {
  return (
    <RadixDropdownMenu.Item
      className={cx(styles.item, destructive && styles.destructive, className)}
      {...props}
    >
      <span className={styles.itemIcon} aria-hidden>
        {icon}
      </span>
      <span className={styles.itemLabel}>{children}</span>
      {shortcut && (
        <span className={styles.shortcut} aria-hidden>
          {shortcut}
        </span>
      )}
    </RadixDropdownMenu.Item>
  );
}

export interface DropdownMenuCheckboxItemProps
  extends ComponentPropsWithRef<typeof RadixDropdownMenu.CheckboxItem> {}

export function DropdownMenuCheckboxItem({
  className,
  children,
  ...props
}: DropdownMenuCheckboxItemProps) {
  return (
    <RadixDropdownMenu.CheckboxItem className={cx(styles.item, className)} {...props}>
      <span className={styles.checkIndicator}>
        <RadixDropdownMenu.ItemIndicator>
          <Check size={14} aria-hidden />
        </RadixDropdownMenu.ItemIndicator>
      </span>
      <span className={styles.itemLabel}>{children}</span>
    </RadixDropdownMenu.CheckboxItem>
  );
}

export function DropdownMenuLabel({ children }: { children: ReactNode }) {
  return <RadixDropdownMenu.Label className={styles.label}>{children}</RadixDropdownMenu.Label>;
}

export function DropdownMenuSeparator() {
  return <RadixDropdownMenu.Separator className={styles.separator} />;
}
