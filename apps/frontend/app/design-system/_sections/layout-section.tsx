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
      description="Docks are resizable, collapsible, and keyboard-operable. The SplitView handle supports pointer input and the Arrow, Home, and End keys."
    >
      <Grid wide>
        <Specimen
          label="SplitView"
          note="Left dock (200–420 px) beside the graph canvas. Double-click the separator to reset. Store size preferences in user settings rather than graph data."
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
