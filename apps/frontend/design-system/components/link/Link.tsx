"use client";

import { ExternalLink } from "lucide-react";
import { Slot } from "radix-ui";
import type { ComponentPropsWithRef } from "react";
import { cx } from "../../lib/cx";
import styles from "./link.module.css";

export interface LinkProps extends ComponentPropsWithRef<"a"> {
  /**
   * Render the child element instead of an `<a>`, keeping link styling.
   * Use to wrap framework links, e.g. `<Link asChild><NextLink …/></Link>`.
   */
  asChild?: boolean;
  /** Opens in a new tab with a marker icon and `rel="noreferrer"`. */
  external?: boolean;
  /** De-emphasized link that inherits text color. */
  quiet?: boolean;
}

export function Link({ asChild, external, quiet, className, children, ...props }: LinkProps) {
  const classes = cx(styles.link, quiet && styles.quiet, className);

  if (asChild) {
    return (
      <Slot.Root className={classes} {...props}>
        {children}
      </Slot.Root>
    );
  }

  return (
    <a
      className={classes}
      {...(external ? { target: "_blank", rel: "noreferrer" } : undefined)}
      {...props}
    >
      {children}
      {external && <ExternalLink size={12} aria-hidden />}
    </a>
  );
}
