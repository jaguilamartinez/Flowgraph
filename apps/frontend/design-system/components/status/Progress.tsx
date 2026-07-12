"use client";

import { Progress as RadixProgress } from "radix-ui";
import { cx } from "../../lib/cx";
import styles from "./status.module.css";

interface ProgressBaseProps {
  /** 0–100. Prefer explicit phase text over indeterminate spinners. */
  value: number;
  /** Visible label describing the operation, e.g. `Generating configuration`. */
  /** Right-aligned value text; defaults to a percentage. */
  valueText?: string;
  className?: string;
}

type ProgressLabel =
  | { label: string; "aria-label"?: string }
  | { label?: undefined; "aria-label": string };

export type ProgressProps = ProgressBaseProps & ProgressLabel;

export function Progress({
  value,
  label,
  "aria-label": ariaLabel,
  valueText,
  className,
}: ProgressProps) {
  const clamped = Math.max(0, Math.min(100, value));
  const display = valueText ?? `${Math.round(clamped)}%`;
  return (
    <div className={cx(styles.progress, className)}>
      {(label || valueText !== undefined) && (
        <div className={styles.progressHeader}>
          <span className={styles.progressLabel}>{label}</span>
          <span className={styles.progressValue}>{display}</span>
        </div>
      )}
      <RadixProgress.Root
        className={styles.progressTrack}
        value={clamped}
        aria-label={ariaLabel ?? label}
      >
        <RadixProgress.Indicator
          className={styles.progressFill}
          style={{ width: `${clamped}%` }}
        />
      </RadixProgress.Root>
    </div>
  );
}
