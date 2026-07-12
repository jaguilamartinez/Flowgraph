"use client";

import { RadioGroup as RadixRadioGroup } from "radix-ui";
import { useId, type ReactNode } from "react";
import { cx } from "../../lib/cx";
import styles from "./selection.module.css";

export interface RadioGroupProps {
  children: ReactNode;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  name?: string;
  required?: boolean;
  className?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
}

export function RadioGroup({ children, className, ...props }: RadioGroupProps) {
  return (
    <RadixRadioGroup.Root className={cx(styles.radioGroup, className)} {...props}>
      {children}
    </RadixRadioGroup.Root>
  );
}

export interface RadioProps {
  value: string;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
  className?: string;
}

export function Radio({ value, label, description, disabled, className }: RadioProps) {
  const id = useId();
  const descriptionId = description ? `${id}-description` : undefined;

  return (
    <label
      htmlFor={id}
      className={cx(styles.row, disabled && styles.rowDisabled, className)}
    >
      <RadixRadioGroup.Item
        id={id}
        value={value}
        disabled={disabled}
        className={styles.radio}
        aria-describedby={descriptionId}
      >
        <RadixRadioGroup.Indicator className={styles.radioIndicator} />
      </RadixRadioGroup.Item>
      <span className={styles.labelText}>{label}</span>
      {description && (
        <span id={descriptionId} className={styles.description}>
          {description}
        </span>
      )}
    </label>
  );
}
