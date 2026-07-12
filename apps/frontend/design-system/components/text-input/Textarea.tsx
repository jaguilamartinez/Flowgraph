"use client";

import type { ComponentPropsWithRef } from "react";
import { cx } from "../../lib/cx";
import { useFormField } from "../form-field/FormField";
import styles from "./input.module.css";

export interface TextareaProps extends ComponentPropsWithRef<"textarea"> {
  invalid?: boolean;
  mono?: boolean;
}

export function Textarea({ invalid, mono, className, required, ...props }: TextareaProps) {
  const field = useFormField();
  const isInvalid = invalid ?? Boolean(field?.["aria-invalid"]);
  return (
    <textarea
      {...field}
      className={cx(
        styles.input,
        styles.textarea,
        isInvalid && styles.invalid,
        mono && styles.mono,
        className,
      )}
      aria-invalid={isInvalid || undefined}
      required={required ?? Boolean(field?.["aria-required"])}
      {...props}
    />
  );
}
