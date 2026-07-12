"use client";

import { Check, ChevronDown, Search } from "lucide-react";
import {
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { cx } from "../../lib/cx";
import { useFormField } from "../form-field/FormField";
import { Input } from "../text-input/Input";
import styles from "./combobox.module.css";

export interface ComboboxOption {
  value: string;
  label: string;
  /** Secondary line, e.g. category or required application. */
  description?: string;
  disabled?: boolean;
}

export interface ComboboxProps {
  options: ComboboxOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  /** Shown when the query matches nothing. */
  emptyMessage?: string;
  disabled?: boolean;
  invalid?: boolean;
  className?: string;
  "aria-label"?: string;
}

function filterOptions(options: ComboboxOption[], query: string | null) {
  if (query === null || query === "") return options;
  const needle = query.toLowerCase();
  return options.filter(
    (option) =>
      option.label.toLowerCase().includes(needle) ||
      option.description?.toLowerCase().includes(needle),
  );
}

/**
 * Filterable single-select for large option sets (node catalog, Kratos
 * applications). Implements the WAI-ARIA combobox pattern with a list
 * popup and `aria-activedescendant` navigation.
 */
export function Combobox({
  options,
  value,
  onValueChange,
  placeholder,
  emptyMessage = "No matching options",
  disabled,
  invalid,
  className,
  "aria-label": ariaLabel,
}: ComboboxProps) {
  const field = useFormField();
  const listboxId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(-1);

  const selected = options.find((option) => option.value === value);
  const filtered = useMemo(() => filterOptions(options, query), [options, query]);

  const inputValue = query ?? selected?.label ?? "";

  function firstEnabledIndex(items: ComboboxOption[], fromEnd = false) {
    if (fromEnd) {
      for (let index = items.length - 1; index >= 0; index -= 1) {
        if (!items[index].disabled) return index;
      }
      return -1;
    }
    return items.findIndex((option) => !option.disabled);
  }

  function openList() {
    if (disabled) return;
    setOpen(true);
    const selectedIndex = filtered.findIndex(
      (option) => option.value === value && !option.disabled,
    );
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : firstEnabledIndex(filtered));
  }

  function close() {
    setOpen(false);
    setQuery(null);
    setActiveIndex(-1);
  }

  function commit(option: ComboboxOption) {
    if (option.disabled) return;
    onValueChange?.(option.value);
    close();
    inputRef.current?.focus();
  }

  function moveActive(delta: number) {
    if (!filtered.length) return;
    let next = activeIndex;
    for (let i = 0; i < filtered.length; i += 1) {
      next = (next + delta + filtered.length) % filtered.length;
      if (!filtered[next].disabled) break;
    }
    setActiveIndex(next);
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (!open) openList();
        else moveActive(1);
        break;
      case "ArrowUp":
        event.preventDefault();
        if (!open) openList();
        else moveActive(-1);
        break;
      case "Enter":
        if (open && activeIndex >= 0 && filtered[activeIndex]) {
          event.preventDefault();
          commit(filtered[activeIndex]);
        }
        break;
      case "Escape":
        if (open) {
          event.preventDefault();
          close();
        }
        break;
      case "Home":
      case "End":
        if (open && filtered.length) {
          event.preventDefault();
          setActiveIndex(firstEnabledIndex(filtered, event.key === "End"));
        }
        break;
      default:
        break;
    }
  }

  const activeOption = activeIndex >= 0 ? filtered[activeIndex] : undefined;

  return (
    <div className={cx(styles.root, className)}>
      <div className={styles.inputWrap}>
        <Search size={14} aria-hidden className={styles.searchIcon} />
        <Input
          {...field}
          ref={inputRef}
          role="combobox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={
            activeOption ? `${listboxId}-option-${activeIndex}` : undefined
          }
          aria-label={ariaLabel}
          className={styles.input}
          placeholder={placeholder}
          value={inputValue}
          invalid={invalid}
          disabled={disabled}
          onChange={(event) => {
            const nextQuery = event.target.value;
            setQuery(nextQuery);
            if (!open) setOpen(true);
            setActiveIndex(firstEnabledIndex(filterOptions(options, nextQuery)));
          }}
          onFocus={openList}
          onBlur={close}
          onKeyDown={onKeyDown}
        />
        <ChevronDown size={14} aria-hidden className={styles.chevron} />
      </div>
      {open && (
        <ul id={listboxId} role="listbox" className={styles.listbox}>
          {filtered.length === 0 && <li className={styles.empty}>{emptyMessage}</li>}
          {filtered.map((option, index) => (
            <li
              key={option.value}
              id={`${listboxId}-option-${index}`}
              role="option"
              aria-selected={option.value === value}
              aria-disabled={option.disabled || undefined}
              data-active={index === activeIndex || undefined}
              className={styles.option}
              // Mouse down fires before the input's blur closes the list.
              onMouseDown={(event) => {
                event.preventDefault();
                commit(option);
              }}
              onMouseEnter={() => setActiveIndex(index)}
            >
              <span className={styles.optionLabel}>
                <span className={styles.optionCheck}>
                  {option.value === value && <Check size={14} aria-hidden />}
                </span>
                {option.label}
              </span>
              {option.description && (
                <span className={styles.optionDescription}>{option.description}</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
