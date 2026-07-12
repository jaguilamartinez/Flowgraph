"use client";

import { Check, Minus } from "lucide-react";
import { Checkbox as RadixCheckbox } from "radix-ui";
import { useId, type ReactNode } from "react";
import { cx } from "../../lib/cx";
import styles from "./selection.module.css";

export interface CheckboxProps {
  label: ReactNode;
  description?: ReactNode;
  checked?: boolean | "indeterminate";
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean | "indeterminate") => void;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  value?: string;
  className?: string;
}

export function Checkbox({
  label,
  description,
  checked,
  defaultChecked,
  onCheckedChange,
  disabled,
  required,
  name,
  value,
  className,
}: CheckboxProps) {
  const id = useId();
  const descriptionId = description ? `${id}-description` : undefined;

  return (
    <label
      htmlFor={id}
      className={cx(styles.row, disabled && styles.rowDisabled, className)}
    >
      <RadixCheckbox.Root
        id={id}
        className={styles.checkbox}
        checked={checked}
        defaultChecked={defaultChecked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        required={required}
        name={name}
        value={value}
        aria-describedby={descriptionId}
      >
        <RadixCheckbox.Indicator>
          <Check
            size={12}
            strokeWidth={3}
            aria-hidden
            className={styles.checkedIcon}
          />
          <Minus
            size={12}
            strokeWidth={3}
            aria-hidden
            className={styles.indeterminateIcon}
          />
        </RadixCheckbox.Indicator>
      </RadixCheckbox.Root>
      <span className={styles.labelText}>{label}</span>
      {description && (
        <span id={descriptionId} className={styles.description}>
          {description}
        </span>
      )}
    </label>
  );
}
