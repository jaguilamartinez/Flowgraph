import type { ReactNode } from "react";
import { cx } from "@/design-system";
import styles from "../gallery.module.css";

export function Section({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={styles.section}>
      <h2 id={`${id}-title`} className={styles.sectionTitle}>
        {title}
      </h2>
      {description && <p className={styles.sectionDescription}>{description}</p>}
      {children}
    </section>
  );
}

export function Grid({ children, wide }: { children: ReactNode; wide?: boolean }) {
  return <div className={cx(styles.grid, wide && styles.gridWide)}>{children}</div>;
}

export function Specimen({
  label,
  note,
  children,
}: {
  label: string;
  note?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className={styles.specimen}>
      <span className={styles.specimenLabel}>{label}</span>
      {children}
      {note && <p className={styles.specimenNote}>{note}</p>}
    </div>
  );
}

export function Row({ children }: { children: ReactNode }) {
  return <div className={styles.row}>{children}</div>;
}

export function Stack({ children, wide }: { children: ReactNode; wide?: boolean }) {
  return <div className={cx(styles.stack, wide && styles.stackWide)}>{children}</div>;
}
