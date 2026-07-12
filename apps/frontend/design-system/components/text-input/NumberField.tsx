"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useId, useRef, type ComponentPropsWithRef } from "react";
import { cx } from "../../lib/cx";
import { useFormField } from "../form-field/FormField";
import styles from "./input.module.css";

export interface NumberFieldProps
  extends Omit<ComponentPropsWithRef<"input">, "type"> {
  /** Optional unit suffix rendered after the steppers. */
  unit?: string;
  invalid?: boolean;
}

/**
 * Numeric input with stepper buttons. Arrow keys step natively; the
 * buttons provide a pointer alternative and fire a change event.
 */
export function NumberField({
  unit,
  invalid,
  className,
  disabled,
  required,
  "aria-describedby": describedBy,
  ...props
}: NumberFieldProps) {
  const field = useFormField();
  const isInvalid = invalid ?? Boolean(field?.["aria-invalid"]);
  const inputRef = useRef<HTMLInputElement>(null);
  const unitId = useId();
  const descriptionIds = [field?.["aria-describedby"], describedBy, unit ? unitId : undefined]
    .filter(Boolean)
    .join(" ");

  function step(direction: "up" | "down") {
    const input = inputRef.current;
    if (!input) return;
    if (direction === "up") input.stepUp();
    else input.stepDown();
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.focus();
  }

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
        ref={inputRef}
        type="number"
        className={styles.frameInput}
        aria-invalid={isInvalid || undefined}
        aria-describedby={descriptionIds || undefined}
        disabled={disabled}
        required={required ?? Boolean(field?.["aria-required"])}
        {...props}
      />
      <div className={styles.steppers} aria-hidden={disabled || undefined}>
        <button
          type="button"
          tabIndex={-1}
          className={styles.stepButton}
          aria-label="Increase value"
          disabled={disabled}
          onClick={() => step("up")}
        >
          <ChevronUp size={12} aria-hidden />
        </button>
        <button
          type="button"
          tabIndex={-1}
          className={styles.stepButton}
          aria-label="Decrease value"
          disabled={disabled}
          onClick={() => step("down")}
        >
          <ChevronDown size={12} aria-hidden />
        </button>
      </div>
      {unit && (
        <span id={unitId} className={styles.unit} aria-label={`Unit: ${unit}`}>
          {unit}
        </span>
      )}
    </div>
  );
}
