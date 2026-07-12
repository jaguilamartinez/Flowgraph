"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import {
  ToastProvider,
  Toolbar,
  ToolbarSeparator,
  ToolbarToggleGroup,
  ToolbarToggleItem,
  TooltipProvider,
} from "@/design-system";
import styles from "./gallery.module.css";
import { ActionsSection } from "./_sections/actions";
import { DataSection } from "./_sections/data";
import { FeedbackSection } from "./_sections/feedback";
import { FormsSection } from "./_sections/forms";
import { FoundationsSection } from "./_sections/foundations";
import { LayoutSection } from "./_sections/layout-section";
import { NavigationSection } from "./_sections/navigation";
import { OverlaysSection } from "./_sections/overlays";

type ThemeChoice = "light" | "dark" | "system";
type DensityChoice = "comfortable" | "compact";

const sections = [
  ["foundations", "Foundations"],
  ["actions", "Actions"],
  ["forms", "Forms"],
  ["overlays", "Overlays"],
  ["navigation", "Navigation"],
  ["feedback", "Feedback & status"],
  ["data", "Data"],
  ["layout", "Workspace layout"],
] as const;

function applyTheme(choice: ThemeChoice) {
  const resolved =
    choice === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : choice;
  document.documentElement.dataset.theme = resolved;
  if (choice === "system") localStorage.removeItem("fg-theme");
  else localStorage.setItem("fg-theme", choice);
}

function applyDensity(choice: DensityChoice) {
  document.documentElement.dataset.density = choice;
  localStorage.setItem("fg-density", choice);
}

export function GalleryClient() {
  const [theme, setTheme] = useState<ThemeChoice>("system");
  const [density, setDensity] = useState<DensityChoice>("comfortable");

  useEffect(() => {
    const storedTheme = localStorage.getItem("fg-theme");
    if (storedTheme === "light" || storedTheme === "dark") setTheme(storedTheme);
    const storedDensity = localStorage.getItem("fg-density");
    if (storedDensity === "compact") setDensity("compact");
  }, []);

  useEffect(() => {
    if (theme !== "system") {
      document.documentElement.dataset.theme = theme;
      return;
    }

    const queryTheme = new URLSearchParams(window.location.search).get("theme");
    if (queryTheme === "light" || queryTheme === "dark") {
      document.documentElement.dataset.theme = queryTheme;
      return;
    }

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const syncSystemTheme = () => {
      document.documentElement.dataset.theme = media.matches ? "dark" : "light";
    };
    syncSystemTheme();
    media.addEventListener("change", syncSystemTheme);
    return () => media.removeEventListener("change", syncSystemTheme);
  }, [theme]);

  return (
    <TooltipProvider>
      <ToastProvider>
        <div className={styles.page}>
          <header className={styles.header}>
            <div className={styles.headerTitle}>
              <a className={styles.wordmark} href="/">
                Flowgraph AI
              </a>
              <span className={styles.headerMeta}>Design system · v0.1</span>
            </div>
            <Toolbar aria-label="Catalog display settings">
              <ToolbarToggleGroup
                type="single"
                value={theme}
                onValueChange={(value) => {
                  if (!value) return;
                  const choice = value as ThemeChoice;
                  setTheme(choice);
                  applyTheme(choice);
                }}
                aria-label="Theme"
              >
                <ToolbarToggleItem value="light" aria-label="Light theme">
                  <Sun size={14} aria-hidden />
                  Light
                </ToolbarToggleItem>
                <ToolbarToggleItem value="dark" aria-label="Dark theme">
                  <Moon size={14} aria-hidden />
                  Dark
                </ToolbarToggleItem>
                <ToolbarToggleItem value="system" aria-label="System theme">
                  <Monitor size={14} aria-hidden />
                  System
                </ToolbarToggleItem>
              </ToolbarToggleGroup>
              <ToolbarSeparator />
              <ToolbarToggleGroup
                type="single"
                value={density}
                onValueChange={(value) => {
                  if (!value) return;
                  const choice = value as DensityChoice;
                  setDensity(choice);
                  applyDensity(choice);
                }}
                aria-label="Density"
              >
                <ToolbarToggleItem value="comfortable">Comfortable</ToolbarToggleItem>
                <ToolbarToggleItem value="compact">Compact</ToolbarToggleItem>
              </ToolbarToggleGroup>
            </Toolbar>
          </header>

          <div className={styles.shell}>
            <nav className={styles.nav} aria-label="Catalog sections">
              <p className={styles.navKicker}>Catalog</p>
              {sections.map(([id, label]) => (
                <a key={id} href={`#${id}`} className={styles.navLink}>
                  {label}
                </a>
              ))}
            </nav>

            <main className={styles.main}>
              <div className={styles.intro}>
                <h1 className={styles.introTitle}>Interface foundations and component catalog</h1>
                <p className={styles.introText}>
                  This catalog documents tokens, component behavior, content patterns, and
                  accessibility states for the Flowgraph AI workspace. Product-specific
                  interfaces build on these foundations inside their feature modules.
                </p>
              </div>

              <FoundationsSection />
              <ActionsSection />
              <FormsSection />
              <OverlaysSection />
              <NavigationSection />
              <FeedbackSection />
              <DataSection />
              <LayoutSection />
            </main>
          </div>
        </div>
      </ToastProvider>
    </TooltipProvider>
  );
}
