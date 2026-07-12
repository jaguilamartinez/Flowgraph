import type { ComponentPropsWithRef } from "react";
import { cx } from "../../lib/cx";
import styles from "./table.module.css";

export interface TableProps extends ComponentPropsWithRef<"table"> {
  /** Adds row hover feedback for selectable/navigable rows. */
  interactive?: boolean;
}

/**
 * Data table for comparison and filtering (simulations, revisions,
 * artifacts). The wrapper contains horizontal overflow instead of
 * extending the page width.
 */
export function Table({ interactive, className, ...props }: TableProps) {
  return (
    <div className={cx(styles.scroller, interactive && styles.interactive)}>
      <table className={cx(styles.table, className)} {...props} />
    </div>
  );
}

export function TableCaption({ className, ...props }: ComponentPropsWithRef<"caption">) {
  return <caption className={cx(styles.caption, className)} {...props} />;
}

export function TableHeader(props: ComponentPropsWithRef<"thead">) {
  return <thead {...props} />;
}

export function TableBody(props: ComponentPropsWithRef<"tbody">) {
  return <tbody {...props} />;
}

export interface TableRowProps extends ComponentPropsWithRef<"tr"> {
  selected?: boolean;
}

export function TableRow({ selected, className, ...props }: TableRowProps) {
  return (
    <tr
      className={cx(styles.row, selected && styles.rowSelected, className)}
      aria-selected={selected === undefined ? undefined : selected}
      {...props}
    />
  );
}

export interface TableCellProps extends ComponentPropsWithRef<"td"> {
  /** Right-aligned monospace with tabular numerals. */
  numeric?: boolean;
  /** Monospace for identifiers and codes. */
  mono?: boolean;
}

export function TableHeaderCell({
  numeric,
  mono,
  className,
  ...props
}: Omit<TableCellProps, "ref"> & ComponentPropsWithRef<"th">) {
  return (
    <th
      scope="col"
      className={cx(styles.headerCell, numeric && styles.numeric, mono && styles.mono, className)}
      {...props}
    />
  );
}

export function TableCell({ numeric, mono, className, ...props }: TableCellProps) {
  return (
    <td
      className={cx(styles.cell, numeric && styles.numeric, mono && styles.mono, className)}
      {...props}
    />
  );
}
