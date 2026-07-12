import { StatusIcon, type Status } from "@/design-system";
import styles from "../gallery.module.css";
import { Grid, Row, Section, Specimen } from "./specimen";

const surfaceTokens = [
  ["--ds-surface-canvas", "Main workspace background"],
  ["--ds-surface-default", "Docks and application chrome"],
  ["--ds-surface-raised", "Dialogs and floating content"],
  ["--ds-surface-inset", "Logs, code, secondary wells"],
  ["--ds-border-default", "Dividers and containers"],
  ["--ds-border-strong", "Emphasized borders"],
] as const;

const accentTokens = [
  ["--ds-action-primary", "Brand and primary action"],
  ["--ds-focus-ring", "Keyboard focus and graph selection"],
  ["--ds-status-proposal-icon", "Unapplied assistant proposals only"],
  ["--ds-status-success-icon", "Deterministically verified success"],
  ["--ds-status-warning-icon", "Needs attention"],
  ["--ds-status-danger-icon", "Error, failure, destructive action"],
] as const;

const statuses: Array<{ status: Status; usage: string }> = [
  { status: "neutral", usage: "Idle, not checked, informative metadata" },
  { status: "info", usage: "System relationships and progress" },
  { status: "success", usage: "Verified success only" },
  { status: "warning", usage: "Valid but requires attention" },
  { status: "danger", usage: "Errors and destructive actions only" },
  { status: "proposal", usage: "Unapplied assistant-originated changes" },
];

const spaceSteps = [
  ["--ds-space-1", "4"],
  ["--ds-space-2", "8"],
  ["--ds-space-3", "12"],
  ["--ds-space-4", "16"],
  ["--ds-space-6", "24"],
  ["--ds-space-8", "32"],
  ["--ds-space-12", "48"],
] as const;

export function FoundationsSection() {
  return (
    <Section
      id="foundations"
      title="Foundations"
      description={
        <>
          Warm neutral surfaces support dense engineering work. Rust identifies the brand
          and primary actions; blue identifies focus and system information. Feature code
          consumes semantic tokens rather than raw color values.
        </>
      }
    >
      <Grid>
        <Specimen label="Surfaces and borders">
          <div className={styles.swatchList}>
            {surfaceTokens.map(([token, role]) => (
              <div key={token} className={styles.swatchRow}>
                <span className={styles.swatchChip} style={{ background: `var(${token})` }} />
                <span className={styles.swatchName}>{token}</span>
                <span className={styles.swatchRole}>{role}</span>
              </div>
            ))}
          </div>
        </Specimen>

        <Specimen label="Accents" note="One meaning per hue. Red is never decoration.">
          <div className={styles.swatchList}>
            {accentTokens.map(([token, role]) => (
              <div key={token} className={styles.swatchRow}>
                <span className={styles.swatchChip} style={{ background: `var(${token})` }} />
                <span className={styles.swatchName}>{token}</span>
                <span className={styles.swatchRole}>{role}</span>
              </div>
            ))}
          </div>
        </Specimen>

        <Specimen
          label="Status system"
          note="Status always combines text, an icon or shape, and color as reinforcement — never color alone."
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--ds-space-2)" }}>
            {statuses.map(({ status, usage }) => (
              <div
                key={status}
                className={styles.statusRow}
                style={{
                  background: `var(--ds-status-${status}-surface)`,
                  borderColor: `var(--ds-status-${status}-border)`,
                }}
              >
                <span style={{ color: `var(--ds-status-${status}-icon)`, display: "inline-flex" }}>
                  <StatusIcon status={status} />
                </span>
                <strong style={{ color: `var(--ds-status-${status}-text)` }}>{status}</strong>
                <span style={{ color: "var(--ds-text-secondary)" }}>{usage}</span>
              </div>
            ))}
          </div>
        </Specimen>

        <Specimen
          label="Typography"
          note="Two functional stacks. Monospace is for identifiers, values, logs, and units — never an aesthetic."
        >
          <div className={styles.typeSample}>
            <div className={styles.typeRow}>
              <span className={styles.typeMeta}>24 / 600</span>
              <span style={{ fontSize: "var(--ds-text-3xl)", fontWeight: 600 }}>
                Page title
              </span>
            </div>
            <div className={styles.typeRow}>
              <span className={styles.typeMeta}>16 / 600</span>
              <span style={{ fontSize: "var(--ds-text-xl)", fontWeight: 600 }}>
                Panel heading
              </span>
            </div>
            <div className={styles.typeRow}>
              <span className={styles.typeMeta}>13 / 400</span>
              <span>Base interface text remains readable at compact density.</span>
            </div>
            <div className={styles.typeRow}>
              <span className={styles.typeMeta}>12 / 400</span>
              <span style={{ fontSize: "var(--ds-text-sm)", color: "var(--ds-text-secondary)" }}>
                Secondary and supporting text.
              </span>
            </div>
          </div>
          <pre className={styles.monoBlock}>
            {"revision   time_step   end_time\n"}
            {"rev-0012     0.0100      1.0000\n"}
            {"rev-0013     0.0025      2.5000"}
          </pre>
        </Specimen>

        <Specimen label="Spacing — 4 px base scale">
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--ds-space-2)" }}>
            {spaceSteps.map(([token, px]) => (
              <div key={token} className={styles.spaceRow}>
                <span className={styles.typeMeta}>
                  {token.replace("--ds-", "")} · {px}px
                </span>
                <span className={styles.spaceBar} style={{ width: `${px}px` }} />
              </div>
            ))}
          </div>
        </Specimen>

        <Specimen
          label="Radii and elevation"
          note="Small, consistent radii. Elevation is reserved for overlays, menus, dialogs, and dragged items."
        >
          <Row>
            <span className={styles.radiusChip} style={{ borderRadius: "var(--ds-radius-sm)" }}>
              sm 3
            </span>
            <span className={styles.radiusChip} style={{ borderRadius: "var(--ds-radius-md)" }}>
              md 5
            </span>
            <span className={styles.radiusChip} style={{ borderRadius: "var(--ds-radius-lg)" }}>
              lg 8
            </span>
          </Row>
          <Row>
            <span className={styles.shadowChip} style={{ boxShadow: "var(--ds-shadow-raised)" }}>
              raised
            </span>
            <span className={styles.shadowChip} style={{ boxShadow: "var(--ds-shadow-overlay)" }}>
              overlay
            </span>
            <span className={styles.shadowChip} style={{ boxShadow: "var(--ds-shadow-dialog)" }}>
              dialog
            </span>
          </Row>
        </Specimen>
      </Grid>

      <Specimen
        label="Graph-specific tokens"
        note="Node, edge, and port roles come from --ds-graph-* tokens. Selection is blue; unsupported nodes retain their label, kind, and diagnostic state."
      >
        <div className={styles.graphDemo}>
          <div className={styles.graphNode} style={{ top: 28, left: 24 }}>
            <span className={styles.graphNodeKind}>parse_model_part</span>
            <span>Import model part</span>
            <span
              className={styles.graphPort}
              style={{ right: -6, top: 24, background: "var(--ds-graph-port-compatible)" }}
            />
          </div>
          <div
            className={`${styles.graphNode} ${styles.graphNodeSelected}`}
            style={{ top: 96, left: 220 }}
          >
            <span className={styles.graphNodeKind}>static_analysis</span>
            <span>Structural stage</span>
            <span
              className={styles.graphPort}
              style={{ left: -6, top: 24, background: "var(--ds-graph-port-compatible)" }}
            />
            <span
              className={styles.graphPort}
              style={{ right: -6, top: 24, background: "var(--ds-graph-port-incompatible)" }}
            />
          </div>
          <div
            className={`${styles.graphNode} ${styles.graphNodeUnsupported}`}
            style={{ top: 28, left: 420 }}
          >
            <span className={styles.graphNodeKind}>legacy/custom_bc</span>
            <span>Unsupported node</span>
          </div>
          <svg
            aria-hidden
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
          >
            <path
              d="M 162 55 C 200 55, 185 122, 218 122"
              fill="none"
              stroke="var(--ds-graph-edge-selected)"
              strokeWidth="1.5"
            />
            <path
              d="M 360 122 C 400 122, 390 60, 418 58"
              fill="none"
              stroke="var(--ds-graph-edge-invalid)"
              strokeWidth="1.5"
              strokeDasharray="4 3"
            />
          </svg>
        </div>
      </Specimen>
    </Section>
  );
}
