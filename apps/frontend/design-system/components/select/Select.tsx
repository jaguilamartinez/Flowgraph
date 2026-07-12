"use client";

import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { Select as RadixSelect } from "radix-ui";
import type { ComponentPropsWithRef, ReactNode } from "react";
import { cx } from "../../lib/cx";
import { useFormField } from "../form-field/FormField";
import styles from "./select.module.css";

export interface SelectProps {
  children: ReactNode;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  name?: string;
  disabled?: boolean;
  required?: boolean;
  invalid?: boolean;
  className?: string;
  /** Accessible name when used outside a FormField. */
  "aria-label"?: string;
}

/** Single-choice select for a known, closed set of options. */
export function Select({
  children,
  value,
  defaultValue,
  onValueChange,
  placeholder,
  name,
  disabled,
  required,
  invalid,
  className,
  "aria-label": ariaLabel,
}: SelectProps) {
  const field = useFormField();
  const isInvalid = invalid ?? Boolean(field?.["aria-invalid"]);

  return (
    <RadixSelect.Root
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      name={name}
      disabled={disabled}
      required={required ?? Boolean(field?.["aria-required"])}
    >
      <RadixSelect.Trigger
        {...field}
        aria-invalid={isInvalid || undefined}
        aria-label={ariaLabel}
        className={cx(styles.trigger, isInvalid && styles.invalid, className)}
      >
        <RadixSelect.Value placeholder={placeholder} />
        <RadixSelect.Icon className={styles.chevron}>
          <ChevronDown size={14} aria-hidden />
        </RadixSelect.Icon>
      </RadixSelect.Trigger>
      <RadixSelect.Portal>
        <RadixSelect.Content className={styles.content} position="popper" sideOffset={4}>
          <RadixSelect.ScrollUpButton className={styles.scrollButton}>
            <ChevronUp size={14} aria-hidden />
          </RadixSelect.ScrollUpButton>
          <RadixSelect.Viewport className={styles.viewport}>{children}</RadixSelect.Viewport>
          <RadixSelect.ScrollDownButton className={styles.scrollButton}>
            <ChevronDown size={14} aria-hidden />
          </RadixSelect.ScrollDownButton>
        </RadixSelect.Content>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  );
}

export interface SelectItemProps
  extends Omit<ComponentPropsWithRef<typeof RadixSelect.Item>, "className"> {
  className?: string;
}

export function SelectItem({ className, children, ...props }: SelectItemProps) {
  return (
    <RadixSelect.Item className={cx(styles.item, className)} {...props}>
      <span className={styles.itemIndicator}>
        <RadixSelect.ItemIndicator>
          <Check size={14} aria-hidden />
        </RadixSelect.ItemIndicator>
      </span>
      <RadixSelect.ItemText>{children}</RadixSelect.ItemText>
    </RadixSelect.Item>
  );
}

export function SelectGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <RadixSelect.Group>
      <RadixSelect.Label className={styles.groupLabel}>{label}</RadixSelect.Label>
      {children}
    </RadixSelect.Group>
  );
}

export function SelectSeparator() {
  return <RadixSelect.Separator className={styles.separator} />;
}
