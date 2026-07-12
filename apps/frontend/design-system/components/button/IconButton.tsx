"use client";

import type { ComponentPropsWithRef, ReactNode } from "react";
import { cx } from "../../lib/cx";
import styles from "./button.module.css";
import type { ButtonSize, ButtonVariant } from "./Button";

export interface IconButtonProps
  extends Omit<ComponentPropsWithRef<"button">, "children" | "aria-label"> {
  /** Accessible name. Icon-only actions always require one. */
  label: string;
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export function IconButton({
  label,
  variant = "ghost",
  size = "md",
  className,
  children,
  type = "button",
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      className={cx(
        styles.button,
        styles.iconButton,
        styles[variant],
        size === "sm" && styles.sm,
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
