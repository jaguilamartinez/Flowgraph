"use client";

import {
  useCallback,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import { cx } from "../../lib/cx";
import styles from "./split-view.module.css";

export interface SplitViewProps {
  /** The resizable pane (dock). */
  pane: ReactNode;
  /** The fluid main content. */
  children: ReactNode;
  direction?: "horizontal" | "vertical";
  /** Which side the fixed pane sits on. */
  paneSide?: "start" | "end";
  defaultSize?: number;
  minSize?: number;
  maxSize?: number;
  /** Accessible name for the resize handle, e.g. `Resize left dock`. */
  separatorLabel: string;
  /** Notified on resize; persist per user/project outside graph data. */
  onSizeChange?: (size: number) => void;
  className?: string;
}

const KEYBOARD_STEP = 16;

/**
 * Two-pane resizable layout for workspace docks. The separator is a
 * keyboard-operable `role="separator"`: arrow keys resize, Home/End
 * jump to the limits — dragging is never required.
 */
export function SplitView({
  pane,
  children,
  direction = "horizontal",
  paneSide = "start",
  defaultSize = 280,
  minSize = 160,
  maxSize = 520,
  separatorLabel,
  onSizeChange,
  className,
}: SplitViewProps) {
  const [size, setSize] = useState(defaultSize);
  const [dragging, setDragging] = useState(false);
  const dragState = useRef<{ start: number; startSize: number } | null>(null);
  const horizontal = direction === "horizontal";

  const clamp = useCallback(
    (next: number) => Math.max(minSize, Math.min(maxSize, next)),
    [minSize, maxSize],
  );

  const applySize = useCallback(
    (next: number) => {
      const clamped = clamp(next);
      setSize(clamped);
      onSizeChange?.(clamped);
    },
    [clamp, onSizeChange],
  );

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragState.current = {
      start: horizontal ? event.clientX : event.clientY,
      startSize: size,
    };
    setDragging(true);
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!dragState.current) return;
    const position = horizontal ? event.clientX : event.clientY;
    const delta = position - dragState.current.start;
    applySize(dragState.current.startSize + (paneSide === "start" ? delta : -delta));
  }

  function onPointerUp() {
    dragState.current = null;
    setDragging(false);
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const grow = horizontal ? "ArrowRight" : "ArrowDown";
    const shrink = horizontal ? "ArrowLeft" : "ArrowUp";
    const sign = paneSide === "start" ? 1 : -1;
    if (event.key === grow) {
      event.preventDefault();
      applySize(size + KEYBOARD_STEP * sign);
    } else if (event.key === shrink) {
      event.preventDefault();
      applySize(size - KEYBOARD_STEP * sign);
    } else if (event.key === "Home") {
      event.preventDefault();
      applySize(minSize);
    } else if (event.key === "End") {
      event.preventDefault();
      applySize(maxSize);
    }
  }

  const fixedPane = (
    <div
      className={cx(styles.pane, styles.fixedPane)}
      style={horizontal ? { width: size } : { height: size }}
    >
      {pane}
    </div>
  );

  const separator = (
    <div
      role="separator"
      tabIndex={0}
      aria-label={separatorLabel}
      aria-orientation={horizontal ? "vertical" : "horizontal"}
      aria-valuenow={Math.round(size)}
      aria-valuemin={minSize}
      aria-valuemax={maxSize}
      className={cx(
        styles.separator,
        horizontal ? styles.separatorHorizontal : styles.separatorVertical,
        dragging && styles.separatorDragging,
      )}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onLostPointerCapture={onPointerUp}
      onKeyDown={onKeyDown}
      onDoubleClick={() => applySize(defaultSize)}
    />
  );

  const fluid = <div className={cx(styles.pane, styles.fluidPane)}>{children}</div>;

  return (
    <div className={cx(styles.root, !horizontal && styles.vertical, className)}>
      {paneSide === "start" ? (
        <>
          {fixedPane}
          {separator}
          {fluid}
        </>
      ) : (
        <>
          {fluid}
          {separator}
          {fixedPane}
        </>
      )}
    </div>
  );
}
