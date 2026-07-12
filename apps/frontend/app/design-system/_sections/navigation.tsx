"use client";

import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  Maximize,
  Redo2,
  Undo2,
} from "lucide-react";
import {
  Accordion,
  AccordionItem,
  Collapsible,
  IconButton,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Toolbar,
  ToolbarButton,
  ToolbarSeparator,
  ToolbarToggleGroup,
  ToolbarToggleItem,
} from "@/design-system";
import styles from "../gallery.module.css";
import { Grid, Section, Specimen } from "./specimen";

export function NavigationSection() {
  return (
    <Section
      id="navigation"
      title="Navigation and structure"
      description="Docks use tabs; inspectors group fields by user task with disclosure for advanced content. Toolbars are a single tab stop with arrow-key navigation."
    >
      <Grid>
        <Specimen label="Tabs" note="Tab counts expose diagnostic totals before the panel opens.">
          <Tabs defaultValue="problems">
            <TabsList aria-label="Bottom dock panels">
              <TabsTrigger value="problems" count={3}>
                Problems
              </TabsTrigger>
              <TabsTrigger value="configuration">Configuration</TabsTrigger>
              <TabsTrigger value="artifacts">Artifacts</TabsTrigger>
              <TabsTrigger value="output" disabled>
                Simulation output
              </TabsTrigger>
            </TabsList>
            <TabsContent value="problems">
              <p style={{ margin: 0, color: "var(--ds-text-secondary)" }}>
                3 diagnostics: 2 errors, 1 warning. Selecting one highlights the graph
                element without closing the panel.
              </p>
            </TabsContent>
            <TabsContent value="configuration">
              <p style={{ margin: 0, color: "var(--ds-text-secondary)" }}>
                Generated files for the current revision.
              </p>
            </TabsContent>
            <TabsContent value="artifacts">
              <p style={{ margin: 0, color: "var(--ds-text-secondary)" }}>
                Attached model parts and materials.
              </p>
            </TabsContent>
          </Tabs>
        </Specimen>

        <Specimen label="Accordion" note="Group inspector fields by task rather than source-object order.">
          <Accordion type="multiple" defaultValue={["time"]}>
            <AccordionItem value="time" title="Time settings">
              <p style={{ margin: 0, color: "var(--ds-text-secondary)" }}>
                End time, time step, and output interval fields.
              </p>
            </AccordionItem>
            <AccordionItem value="solver" title="Solver settings">
              <p style={{ margin: 0, color: "var(--ds-text-secondary)" }}>
                Solver type, tolerance, and maximum iterations.
              </p>
            </AccordionItem>
            <AccordionItem value="restart" title="Restart options" disabled>
              Unavailable for this analysis type.
            </AccordionItem>
          </Accordion>
        </Specimen>

        <Specimen
          label="Collapsible"
          note="Raw JSON is shown in an explicit advanced view and uses the same validation path."
        >
          <Collapsible label="Advanced: raw parameters">
            <pre className={styles.monoBlock}>
              {'{\n  "solver_type": "amgcl",\n  "tolerance": 1e-6,\n  "max_iteration": 200\n}'}
            </pre>
          </Collapsible>
        </Specimen>

        <Specimen label="Toolbar" note="Arrow keys move between controls; the toolbar is one tab stop.">
          <Toolbar aria-label="Canvas tools">
            <ToolbarButton asChild>
              <IconButton label="Undo" size="sm">
                <Undo2 size={14} aria-hidden />
              </IconButton>
            </ToolbarButton>
            <ToolbarButton asChild>
              <IconButton label="Redo" size="sm" disabled>
                <Redo2 size={14} aria-hidden />
              </IconButton>
            </ToolbarButton>
            <ToolbarSeparator />
            <ToolbarToggleGroup type="single" defaultValue="left" aria-label="Align nodes">
              <ToolbarToggleItem value="left" aria-label="Align left">
                <AlignLeft size={14} aria-hidden />
              </ToolbarToggleItem>
              <ToolbarToggleItem value="center" aria-label="Align center">
                <AlignCenter size={14} aria-hidden />
              </ToolbarToggleItem>
              <ToolbarToggleItem value="right" aria-label="Align right">
                <AlignRight size={14} aria-hidden />
              </ToolbarToggleItem>
            </ToolbarToggleGroup>
            <ToolbarSeparator />
            <ToolbarButton asChild>
              <IconButton label="Fit graph to view" size="sm">
                <Maximize size={14} aria-hidden />
              </IconButton>
            </ToolbarButton>
          </Toolbar>
        </Specimen>
      </Grid>
    </Section>
  );
}
