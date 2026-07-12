"use client";

import type { ComponentPropsWithRef } from "react";
import { cx } from "../../lib/cx";
import { useFormField } from "../form-field/FormField";
import styles from "./input.module.css";

export interface InputProps extends ComponentPropsWithRef<"input"> {
  /** Marks the control invalid. Set automatically inside a FormField with an error. */
  invalid?: boolean;
  /** Monospace with tabular numerals — for identifiers and technical values. */
  mono?: boolean;
}

export function Input({ invalid, mono, className, required, ...props }: InputProps) {
  const field = useFormField();
  const isInvalid = invalid ?? Boolean(field?.["aria-invalid"]);
  return (
    <input
      {...field}
      className={cx(styles.input, isInvalid && styles.invalid, mono && styles.mono, className)}
      aria-invalid={isInvalid || undefined}
      required={required ?? Boolean(field?.["aria-required"])}
      {...props}
    />
  );
}
