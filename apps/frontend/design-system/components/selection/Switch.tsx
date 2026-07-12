"use client";

import { Switch as RadixSwitch } from "radix-ui";
import { useId, type ReactNode } from "react";
import { cx } from "../../lib/cx";
import styles from "./selection.module.css";

export interface SwitchProps {
  label: ReactNode;
  description?: ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  name?: string;
  className?: string;
}

/** Immediate on/off setting. Use Checkbox inside forms that submit. */
export function Switch({
  label,
  description,
  checked,
  defaultChecked,
  onCheckedChange,
  disabled,
  name,
  className,
}: SwitchProps) {
  const id = useId();
  const descriptionId = description ? `${id}-description` : undefined;

  return (
    <label
      htmlFor={id}
      className={cx(styles.row, disabled && styles.rowDisabled, className)}
    >
      <RadixSwitch.Root
        id={id}
        className={styles.switch}
        checked={checked}
        defaultChecked={defaultChecked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        name={name}
        aria-describedby={descriptionId}
      >
        <RadixSwitch.Thumb className={styles.switchThumb} />
      </RadixSwitch.Root>
      <span className={styles.labelText}>{label}</span>
      {description && (
        <span id={descriptionId} className={styles.description}>
          {description}
        </span>
      )}
    </label>
  );
}
