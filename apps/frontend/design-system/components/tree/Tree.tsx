"use client";

import { ChevronRight } from "lucide-react";
import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { cx } from "../../lib/cx";
import { StatusIcon, type Status } from "../../lib/status";
import styles from "./tree.module.css";

export interface TreeNode {
  id: string;
  label: string;
  icon?: ReactNode;
  /** Diagnostic marker rendered as icon + text, never color alone. */
  status?: Status;
  /** Short text next to the status icon, e.g. `2 errors`. */
  statusLabel?: string;
  children?: TreeNode[];
}

export interface TreeProps {
  /** Accessible name, e.g. `Graph outline`. */
  "aria-label": string;
  nodes: TreeNode[];
  selectedId?: string;
  onSelect?: (node: TreeNode) => void;
  defaultExpandedIds?: string[];
  className?: string;
}

interface FlatNode {
  node: TreeNode;
  depth: number;
  parentId?: string;
}

const statusMetaClass: Record<Status, string> = {
  neutral: styles.metaNeutral,
  info: styles.metaInfo,
  success: styles.metaSuccess,
  warning: styles.metaWarning,
  danger: styles.metaDanger,
  proposal: styles.metaProposal,
};

/**
 * Accessible tree view (WAI-ARIA tree pattern with roving tabindex).
 * Serves the synchronized graph outline: not an accessibility fallback,
 * but a productive view for large graphs.
 */
export function Tree({
  "aria-label": ariaLabel,
  nodes,
  selectedId,
  onSelect,
  defaultExpandedIds = [],
  className,
}: TreeProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(defaultExpandedIds));
  const [focusedId, setFocusedId] = useState<string | undefined>();
  const rowRefs = useRef(new Map<string, HTMLDivElement>());

  const visible = useMemo(() => {
    const flat: FlatNode[] = [];
    function walk(items: TreeNode[], depth: number, parentId?: string) {
      for (const node of items) {
        flat.push({ node, depth, parentId });
        if (node.children?.length && expanded.has(node.id)) {
          walk(node.children, depth + 1, node.id);
        }
      }
    }
    walk(nodes, 0);
    return flat;
  }, [nodes, expanded]);

  const toggle = useCallback((id: string) => {
    setExpanded((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  function focusRow(id: string) {
    setFocusedId(id);
    rowRefs.current.get(id)?.focus();
  }

  function onKeyDown(event: KeyboardEvent, flat: FlatNode, index: number) {
    const { node } = flat;
    const hasChildren = Boolean(node.children?.length);
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (index < visible.length - 1) focusRow(visible[index + 1].node.id);
        break;
      case "ArrowUp":
        event.preventDefault();
        if (index > 0) focusRow(visible[index - 1].node.id);
        break;
      case "ArrowRight":
        event.preventDefault();
        if (hasChildren && !expanded.has(node.id)) toggle(node.id);
        else if (hasChildren && index < visible.length - 1) {
          focusRow(visible[index + 1].node.id);
        }
        break;
      case "ArrowLeft":
        event.preventDefault();
        if (hasChildren && expanded.has(node.id)) toggle(node.id);
        else if (flat.parentId) focusRow(flat.parentId);
        break;
      case "Home":
        event.preventDefault();
        if (visible.length) focusRow(visible[0].node.id);
        break;
      case "End":
        event.preventDefault();
        if (visible.length) focusRow(visible[visible.length - 1].node.id);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        onSelect?.(node);
        break;
      default:
        break;
    }
  }

  const tabStopId = focusedId ?? selectedId ?? visible[0]?.node.id;

  return (
    <ul role="tree" aria-label={ariaLabel} className={cx(styles.tree, className)}>
      {visible.map((flat, index) => {
        const { node, depth } = flat;
        const hasChildren = Boolean(node.children?.length);
        const isExpanded = expanded.has(node.id);
        const isSelected = node.id === selectedId;
        return (
          <li key={node.id} role="none" className={styles.item}>
            <div
              ref={(element) => {
                if (element) rowRefs.current.set(node.id, element);
                else rowRefs.current.delete(node.id);
              }}
              role="treeitem"
              aria-expanded={hasChildren ? isExpanded : undefined}
              aria-selected={isSelected}
              aria-level={depth + 1}
              tabIndex={node.id === tabStopId ? 0 : -1}
              className={cx(styles.row, isSelected && styles.rowSelected)}
              style={{ "--tree-depth": depth } as React.CSSProperties}
              onClick={() => {
                setFocusedId(node.id);
                if (hasChildren) toggle(node.id);
                onSelect?.(node);
              }}
              onKeyDown={(event) => onKeyDown(event, flat, index)}
            >
              {hasChildren ? (
                <span
                  className={cx(styles.toggle, isExpanded && styles.toggleExpanded)}
                  aria-hidden
                >
                  <ChevronRight size={14} />
                </span>
              ) : (
                <span className={styles.toggleSpacer} aria-hidden />
              )}
              {node.icon && (
                <span className={styles.itemIcon} aria-hidden>
                  {node.icon}
                </span>
              )}
              <span className={styles.label}>{node.label}</span>
              {node.status && (
                <span className={cx(styles.meta, statusMetaClass[node.status])}>
                  <StatusIcon status={node.status} size={13} />
                  {node.statusLabel}
                </span>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
