"use client";

import { CircleAlert } from "lucide-react";
import {
  createContext,
  useContext,
  useId,
  type ComponentPropsWithRef,
  type ReactNode,
} from "react";
import { cx } from "../../lib/cx";
import styles from "./form-field.module.css";

interface FormFieldContextValue {
  controlId: string;
  helpId?: string;
  errorId?: string;
  invalid: boolean;
  required: boolean;
}

const FormFieldContext = createContext<FormFieldContextValue | null>(null);

/**
 * Wiring for controls rendered inside a FormField. Returns the props a
 * control should spread to receive its id, description, and validity.
 */
export function useFormField() {
  const field = useContext(FormFieldContext);
  if (!field) return undefined;
  const describedBy =
    [field.errorId, field.helpId].filter(Boolean).join(" ") || undefined;
  return {
    id: field.controlId,
    "aria-describedby": describedBy,
    "aria-invalid": field.invalid || undefined,
    "aria-required": field.required || undefined,
  } as const;
}

export interface FormFieldProps {
  label: ReactNode;
  children: ReactNode;
  /** Persistent guidance under the control. */
  hint?: ReactNode;
  /** Deterministic validation error. Marks the control invalid. */
  error?: ReactNode;
  required?: boolean;
  /** Shows an explicit “Optional” marker next to the label. */
  showOptional?: boolean;
  className?: string;
}

/**
 * Groups Label, control, HelpText, and ErrorText and wires their
 * id/aria relationships. The single child control picks the wiring up
 * automatically when it calls `useFormField()` (all design-system
 * inputs do).
 */
export function FormField({
  label,
  children,
  hint,
  error,
  required = false,
  showOptional = false,
  className,
}: FormFieldProps) {
  const baseId = useId();
  const controlId = `${baseId}-control`;
  const helpId = hint ? `${baseId}-help` : undefined;
  const errorId = error ? `${baseId}-error` : undefined;

  return (
    <FormFieldContext.Provider
      value={{ controlId, helpId, errorId, invalid: Boolean(error), required }}
    >
      <div className={cx(styles.field, className)}>
        <Label htmlFor={controlId} required={required} showOptional={showOptional}>
          {label}
        </Label>
        {children}
        {hint && <HelpText id={helpId}>{hint}</HelpText>}
        {error && <ErrorText id={errorId}>{error}</ErrorText>}
      </div>
    </FormFieldContext.Provider>
  );
}

export interface LabelProps extends ComponentPropsWithRef<"label"> {
  required?: boolean;
  showOptional?: boolean;
}

export function Label({
  required,
  showOptional,
  className,
  children,
  ...props
}: LabelProps) {
  return (
    <label className={cx(styles.label, className)} {...props}>
      {children}
      {required && (
        <span className={styles.requiredMark} aria-hidden>
          *
        </span>
      )}
      {!required && showOptional && <span className={styles.optional}>Optional</span>}
    </label>
  );
}

export function HelpText({ className, ...props }: ComponentPropsWithRef<"p">) {
  return <p className={cx(styles.helpText, className)} {...props} />;
}

export function ErrorText({
  className,
  children,
  ...props
}: ComponentPropsWithRef<"p">) {
  return (
    <p className={cx(styles.errorText, className)} {...props}>
      <CircleAlert size={13} aria-hidden className={styles.errorIcon} />
      <span>{children}</span>
    </p>
  );
}
