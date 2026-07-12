import type { CSSProperties } from "react";
import { cx } from "../../lib/cx";
import styles from "./skeleton.module.css";

export interface SkeletonProps {
  /** `block` for panels, `text` for lines, `circle` for avatars/icons. */
  shape?: "block" | "text" | "circle";
  width?: CSSProperties["width"];
  height?: CSSProperties["height"];
  className?: string;
}

/**
 * Structural loading placeholder. Use only where the final shape is
 * stable; prefer explicit progress phases for long operations.
 */
export function Skeleton({ shape = "block", width, height, className }: SkeletonProps) {
  return (
    <span
      aria-hidden
      className={cx(
        styles.skeleton,
        shape === "text" && styles.text,
        shape === "circle" && styles.circle,
        className,
      )}
      style={{ width, height }}
    />
  );
}
