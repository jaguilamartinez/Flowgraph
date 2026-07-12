"use client";

import { Box, FileText, Settings2 } from "lucide-react";
import { SplitView, Tree, type TreeNode } from "@/design-system";
import styles from "../gallery.module.css";
import { Grid, Section, Specimen } from "./specimen";

const catalog: TreeNode[] = [
  {
    id: "io",
    label: "IO",
    icon: <FileText size={14} />,
    children: [
      { id: "parse", label: "Parse model part" },
      { id: "export", label: "Export case" },
    ],
  },
  {
    id: "stages-cat",
    label: "Analysis stages",
    icon: <Settings2 size={14} />,
    children: [{ id: "static-cat", label: "Static structural" }],
  },
  { id: "materials-cat", label: "Materials", icon: <Box size={14} /> },
];

export function LayoutSection() {
  return (
    <Section
      id="layout"
      title="Workspace layout"
      description="Docks are resizable, collapsible, and keyboard-operable. The SplitView separator is a real role=separator: drag it, or focus it and use the arrow keys — dragging is never required (WCAG 2.2)."
    >
      <Grid wide>
        <Specimen
          label="SplitView"
          note="Left dock (240–520 px) beside the graph canvas. Double-click the separator to reset. Sizes persist per user, never inside graph data."
        >
          <div className={styles.splitDemo}>
            <SplitView
              pane={
                <div className={styles.splitPaneContent}>
                  <p className={styles.splitPaneHeading}>Node catalog</p>
                  <Tree
                    aria-label="Node catalog"
                    nodes={catalog}
                    defaultExpandedIds={["io", "stages-cat"]}
                  />
                </div>
              }
              separatorLabel="Resize left dock"
              defaultSize={260}
              minSize={200}
              maxSize={420}
            >
              <div className={styles.canvasPlaceholder}>Flowgraph canvas</div>
            </SplitView>
          </div>
        </Specimen>
      </Grid>
    </Section>
  );
}
