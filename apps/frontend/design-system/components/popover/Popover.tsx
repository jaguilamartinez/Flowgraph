"use client";

import { Popover as RadixPopover } from "radix-ui";
import type { ComponentPropsWithRef } from "react";
import { cx } from "../../lib/cx";
import styles from "./popover.module.css";

/** Non-modal contextual surface anchored to a trigger. */
export const Popover = RadixPopover.Root;
export const PopoverTrigger = RadixPopover.Trigger;
export const PopoverAnchor = RadixPopover.Anchor;
export const PopoverClose = RadixPopover.Close;

export type PopoverContentProps = ComponentPropsWithRef<typeof RadixPopover.Content>;

export function PopoverContent({
  className,
  sideOffset = 4,
  collisionPadding = 8,
  ...props
}: PopoverContentProps) {
  return (
    <RadixPopover.Portal>
      <RadixPopover.Content
        className={cx(styles.content, className)}
        sideOffset={sideOffset}
        collisionPadding={collisionPadding}
        {...props}
      />
    </RadixPopover.Portal>
  );
}
