"use client";

import { useId, type ComponentPropsWithRef } from "react";
import { cx } from "../../lib/cx";
import { useFormField } from "../form-field/FormField";
import styles from "./input.module.css";

export interface UnitInputProps extends ComponentPropsWithRef<"input"> {
  /** Unit suffix, e.g. `s`, `MPa`, `kg/m³`. Announced with the value. */
  unit: string;
  invalid?: boolean;
}

/** Text input with a fixed unit suffix. Values render in monospace. */
export function UnitInput({
  unit,
  invalid,
  className,
  disabled,
  required,
  "aria-describedby": describedBy,
  ...props
}: UnitInputProps) {
  const field = useFormField();
  const isInvalid = invalid ?? Boolean(field?.["aria-invalid"]);
  const unitId = useId();
  const descriptionIds = [field?.["aria-describedby"], describedBy, unitId]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={cx(
        styles.frame,
        disabled && styles.frameDisabled,
        isInvalid && styles.frameInvalid,
        className,
      )}
    >
      <input
        {...field}
        inputMode="decimal"
        className={cx(styles.frameInput, styles.mono)}
        aria-invalid={isInvalid || undefined}
        aria-describedby={descriptionIds}
        disabled={disabled}
        required={required ?? Boolean(field?.["aria-required"])}
        {...props}
      />
      <span id={unitId} className={styles.unit} aria-label={`Unit: ${unit}`}>
        {unit}
      </span>
    </div>
  );
}
