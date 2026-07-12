"use client";

import { Search } from "lucide-react";
import { Dialog as RadixDialog, VisuallyHidden } from "radix-ui";
import {
  useEffect,
  useId,
  useMemo,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { cx } from "../../lib/cx";
import styles from "./command-palette.module.css";

export interface Command {
  id: string;
  label: string;
  /** Group heading, e.g. `Graph`, `Project`. */
  section?: string;
  icon?: ReactNode;
  /** Display-only shortcut hint, e.g. `⌘⇧V`. */
  shortcut?: string;
  /** Extra search terms (synonyms, technical kinds). */
  keywords?: string[];
  disabled?: boolean;
  /** Why the command is unavailable — shown, not hidden in a tooltip. */
  disabledReason?: string;
  onSelect?: () => void;
}

export interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  commands: Command[];
  placeholder?: string;
  emptyMessage?: string;
}

/**
 * Keyboard-first command palette. Disabled commands stay visible with
 * their reason so constraints are never hidden (product spec §7.4).
 */
export function CommandPalette({
  open,
  onOpenChange,
  commands,
  placeholder = "Type a command or search…",
  emptyMessage = "No matching commands",
}: CommandPaletteProps) {
  const listId = useId();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
    }
  }, [open]);

  const filtered = useMemo(() => {
    if (!query) return commands;
    const needle = query.toLowerCase();
    return commands.filter(
      (command) =>
        command.label.toLowerCase().includes(needle) ||
        command.section?.toLowerCase().includes(needle) ||
        command.keywords?.some((keyword) => keyword.toLowerCase().includes(needle)),
    );
  }, [commands, query]);

  function moveActive(delta: number) {
    const enabled = filtered
      .map((command, index) => ({ command, index }))
      .filter(({ command }) => !command.disabled);
    if (!enabled.length) return;
    const currentPosition = enabled.findIndex(({ index }) => index === activeIndex);
    const nextPosition =
      currentPosition === -1
        ? 0
        : (currentPosition + delta + enabled.length) % enabled.length;
    setActiveIndex(enabled[nextPosition].index);
  }

  function commit(command: Command) {
    if (command.disabled) return;
    onOpenChange(false);
    command.onSelect?.();
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      moveActive(1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      moveActive(-1);
    } else if (event.key === "Enter") {
      const active = filtered[activeIndex];
      if (active) {
        event.preventDefault();
        commit(active);
      }
    }
  }

  // Rebuild section order from the filtered list.
  const sections = useMemo(() => {
    const order: Array<{ section: string | undefined; items: Array<{ command: Command; index: number }> }> = [];
    filtered.forEach((command, index) => {
      const last = order[order.length - 1];
      if (last && last.section === command.section) {
        last.items.push({ command, index });
      } else {
        order.push({ section: command.section, items: [{ command, index }] });
      }
    });
    return order;
  }, [filtered]);

  const activeCommand = filtered[activeIndex];

  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className={styles.overlay} />
        <RadixDialog.Content className={styles.content} aria-describedby={undefined}>
          <VisuallyHidden.Root>
            <RadixDialog.Title>Command palette</RadixDialog.Title>
          </VisuallyHidden.Root>
          <div className={styles.inputRow}>
            <Search size={16} aria-hidden className={styles.searchIcon} />
            <input
              className={styles.input}
              role="combobox"
              aria-expanded="true"
              aria-controls={listId}
              aria-autocomplete="list"
              aria-activedescendant={
                activeCommand ? `${listId}-${activeCommand.id}` : undefined
              }
              aria-label="Search commands"
              placeholder={placeholder}
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setActiveIndex(0);
              }}
              onKeyDown={onKeyDown}
            />
          </div>
          <ul id={listId} role="listbox" aria-label="Commands" className={styles.list}>
            {filtered.length === 0 && <li className={styles.empty}>{emptyMessage}</li>}
            {sections.map((group, groupIndex) => (
              <li key={`${group.section ?? "ungrouped"}-${groupIndex}`} role="none">
                {group.section && (
                  <div className={styles.sectionLabel} role="presentation">
                    {group.section}
                  </div>
                )}
                <ul role="group" style={{ margin: 0, padding: 0, listStyle: "none" }}>
                  {group.items.map(({ command, index }) => (
                    <li
                      key={command.id}
                      id={`${listId}-${command.id}`}
                      role="option"
                      aria-selected={index === activeIndex}
                      aria-disabled={command.disabled || undefined}
                      className={cx(
                        styles.command,
                        index === activeIndex && styles.commandActive,
                        command.disabled && styles.commandDisabled,
                      )}
                      onMouseDown={(event) => {
                        event.preventDefault();
                        commit(command);
                      }}
                      onMouseEnter={() => {
                        if (!command.disabled) setActiveIndex(index);
                      }}
                    >
                      <span className={styles.commandIcon} aria-hidden>
                        {command.icon}
                      </span>
                      <span className={styles.commandLabel}>{command.label}</span>
                      {command.disabled && command.disabledReason && (
                        <span className={styles.disabledReason}>{command.disabledReason}</span>
                      )}
                      {command.shortcut && !command.disabled && (
                        <span className={styles.shortcut} aria-hidden>
                          {command.shortcut}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}
