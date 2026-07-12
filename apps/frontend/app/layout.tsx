import type { Metadata } from "next";
import "../design-system/tokens/index.css";
import "./styles.css";

export const metadata: Metadata = {
  title: {
    default: "Flowgraph AI",
    template: "%s · Flowgraph AI",
  },
  description:
    "Frontend shell and design-system reference for a Kratos configuration workspace in development.",
};

/**
 * Resolves theme and density to explicit data attributes before first
 * paint so the design-system tokens apply without a flash. System
 * preference is the default; explicit choices persist in localStorage.
 * A ?theme=light|dark query overrides both for previews and visual
 * regression screenshots without touching stored preferences.
 */
const themeInitScript = `(function () {
  try {
    var override = location.search.match(/[?&]theme=(light|dark)/);
    var theme = override ? override[1] : localStorage.getItem("fg-theme");
    if (theme !== "light" && theme !== "dark") {
      theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    document.documentElement.dataset.theme = theme;
    var density = localStorage.getItem("fg-density");
    if (density === "compact" || density === "comfortable") {
      document.documentElement.dataset.density = density;
    }
  } catch {}
})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
