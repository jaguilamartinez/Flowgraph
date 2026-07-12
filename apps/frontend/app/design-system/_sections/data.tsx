"use client";

import { Box, FileText, Layers, Settings2 } from "lucide-react";
import { useState, type KeyboardEvent } from "react";
import {
  Badge,
  StatusIndicator,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
  Tree,
  type TreeNode,
} from "@/design-system";
import { Grid, Section, Specimen } from "./specimen";

const outline: TreeNode[] = [
  {
    id: "model",
    label: "Model",
    icon: <Box size={14} />,
    children: [
      { id: "mdpa", label: "cantilever.mdpa", icon: <FileText size={14} /> },
      {
        id: "materials",
        label: "Materials",
        icon: <Layers size={14} />,
        children: [
          { id: "steel", label: "Structural steel S235" },
          {
            id: "legacy-mat",
            label: "legacy/composite_v1",
            status: "warning",
            statusLabel: "unsupported",
          },
        ],
      },
    ],
  },
  {
    id: "stages",
    label: "Analysis stages",
    icon: <Settings2 size={14} />,
    children: [
      {
        id: "static",
        label: "Static structural stage",
        children: [
          { id: "bc", label: "Fixed support — Structure.Inlet", status: "proposal", statusLabel: "proposed" },
          { id: "solver", label: "AMGCL solver", status: "danger", statusLabel: "2 errors" },
        ],
      },
      { id: "output", label: "VTK output process" },
    ],
  },
];

const simulations = [
  {
    id: "sim-0042",
    state: <StatusIndicator status="info" running>Running</StatusIndicator>,
    revision: "rev-0013",
    environment: "Kratos 10.4.3",
    duration: "—",
    started: "11 Jul 14:02",
    author: "J. Águila",
  },
  {
    id: "sim-0041",
    state: <StatusIndicator status="success">Completed</StatusIndicator>,
    revision: "rev-0012",
    environment: "Kratos 10.4.3",
    duration: "4 m 12 s",
    started: "11 Jul 11:30",
    author: "J. Águila",
  },
  {
    id: "sim-0040",
    state: <StatusIndicator status="danger">Failed</StatusIndicator>,
    revision: "rev-0012",
    environment: "Kratos 10.3.0",
    duration: "0 m 41 s",
    started: "10 Jul 17:26",
    author: "M. Rivera",
  },
  {
    id: "sim-0039",
    state: <StatusIndicator status="neutral">Canceled</StatusIndicator>,
    revision: "rev-0011",
    environment: "Kratos 10.3.0",
    duration: "12 m 03 s",
    started: "Jul 09 09:14",
    author: "M. Rivera",
  },
];

export function DataSection() {
  const [selectedNode, setSelectedNode] = useState<string>("solver");
  const [selectedRun, setSelectedRun] = useState<string>("sim-0041");

  function selectRunWithKeyboard(event: KeyboardEvent<HTMLTableRowElement>, id: string) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setSelectedRun(id);
    }
  }

  return (
    <Section
      id="data"
      title="Data"
      description="Tables support comparison with tabular numerals, consistent column labels, and selection indicated by both color and a visible edge. The graph outline supports arrow-key navigation and selection."
    >
      <Grid>
        <Specimen
          label="Table"
          note="Rows are selectable; wide content scrolls inside the table container."
        >
          <Table interactive>
            <TableCaption>Simulations for Cantilever beam study</TableCaption>
            <TableHeader>
              <tr>
                <TableHeaderCell>State</TableHeaderCell>
                <TableHeaderCell>Run</TableHeaderCell>
                <TableHeaderCell>Revision</TableHeaderCell>
                <TableHeaderCell>Environment</TableHeaderCell>
                <TableHeaderCell numeric>Duration</TableHeaderCell>
                <TableHeaderCell>Started</TableHeaderCell>
              </tr>
            </TableHeader>
            <TableBody>
              {simulations.map((run) => (
                <TableRow
                  key={run.id}
                  selected={run.id === selectedRun}
                  tabIndex={0}
                  onClick={() => setSelectedRun(run.id)}
                  onKeyDown={(event) => selectRunWithKeyboard(event, run.id)}
                  style={{ cursor: "pointer" }}
                >
                  <TableCell>{run.state}</TableCell>
                  <TableCell mono>{run.id}</TableCell>
                  <TableCell mono>{run.revision}</TableCell>
                  <TableCell>
                    <Badge status="info" mono>
                      {run.environment}
                    </Badge>
                  </TableCell>
                  <TableCell numeric>{run.duration}</TableCell>
                  <TableCell>{run.started}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Specimen>

        <Specimen
          label="Tree — graph outline"
          note="Arrow keys navigate and expand, Enter selects. Diagnostic markers pair an icon with text."
        >
          <div
            style={{
              maxWidth: 420,
              border: "1px solid var(--ds-border-default)",
              borderRadius: "var(--ds-radius-md)",
              background: "var(--ds-surface-default)",
            }}
          >
            <Tree
              aria-label="Graph outline"
              nodes={outline}
              selectedId={selectedNode}
              onSelect={(node) => setSelectedNode(node.id)}
              defaultExpandedIds={["model", "materials", "stages", "static"]}
            />
          </div>
        </Specimen>
      </Grid>
    </Section>
  );
}
