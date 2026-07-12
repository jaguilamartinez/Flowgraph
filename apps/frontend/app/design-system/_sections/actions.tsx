"use client";

import { Copy, Play, Plus, Trash2 } from "lucide-react";
import { Button, IconButton, Link, Tooltip } from "@/design-system";
import { Grid, Row, Section, Specimen } from "./specimen";

export function ActionsSection() {
  return (
    <Section
      id="actions"
      title="Actions"
      description="Use verb-first labels from the product vocabulary: Apply proposal, Generate configuration, Run simulation. Limit each view to one primary action; danger styling is reserved for destructive commands."
    >
      <Grid>
        <Specimen label="Button — variants">
          <Row>
            <Button variant="primary">Generate configuration</Button>
            <Button variant="secondary">Validate</Button>
            <Button variant="ghost">Compare</Button>
            <Button variant="danger">Delete draft</Button>
          </Row>
        </Specimen>

        <Specimen label="Button — sizes and icons">
          <Row>
            <Button variant="primary" iconStart={<Play size={14} aria-hidden />}>
              Run simulation
            </Button>
            <Button size="sm" variant="secondary" iconStart={<Plus size={14} aria-hidden />}>
              Add node
            </Button>
            <Button size="sm" variant="ghost">
              Cancel
            </Button>
          </Row>
        </Specimen>

        <Specimen
          label="Button — loading and disabled"
          note="Loading buttons retain their dimensions and set aria-busy. Spinner animation is disabled when reduced motion is requested."
        >
          <Row>
            <Button variant="primary" loading>
              Generating…
            </Button>
            <Button variant="secondary" disabled>
              Validate
            </Button>
            <Button variant="danger" disabled>
              Delete draft
            </Button>
          </Row>
        </Specimen>

        <Specimen
          label="IconButton"
          note="Icon-only actions require an accessible name. Add a Tooltip when the visible context does not explain the action."
        >
          <Row>
            <Tooltip content="Duplicate node">
              <IconButton label="Duplicate node">
                <Copy size={16} aria-hidden />
              </IconButton>
            </Tooltip>
            <Tooltip content="Delete node">
              <IconButton label="Delete node" variant="secondary">
                <Trash2 size={16} aria-hidden />
              </IconButton>
            </Tooltip>
            <IconButton label="Add node" variant="primary" size="sm">
              <Plus size={16} aria-hidden />
            </IconButton>
            <IconButton label="Delete node" disabled>
              <Trash2 size={16} aria-hidden />
            </IconButton>
          </Row>
        </Specimen>

        <Specimen label="Link">
          <Row>
            <Link href="#actions">Revision rev-0012</Link>
            <Link href="#actions" quiet>
              Quiet link
            </Link>
            <Link href="https://kratosmultiphysics.github.io/" external>
              Kratos documentation
            </Link>
          </Row>
          <p style={{ margin: 0, color: "var(--ds-text-secondary)" }}>
            Links appear in running text — <Link href="#actions">focus the affected node</Link>{" "}
            — and inherit the surrounding size.
          </p>
        </Specimen>
      </Grid>
    </Section>
  );
}
