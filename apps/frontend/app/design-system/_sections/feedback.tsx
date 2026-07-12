"use client";

import { FolderOpen, Plus, RotateCcw } from "lucide-react";
import {
  Badge,
  Banner,
  Button,
  EmptyState,
  ErrorState,
  InlineAlert,
  Progress,
  Skeleton,
  StatusIndicator,
  StatusMessage,
  useToast,
} from "@/design-system";
import { Grid, Row, Section, Specimen, Stack } from "./specimen";

export function FeedbackSection() {
  const { toast } = useToast();

  return (
    <Section
      id="feedback"
      title="Feedback and status"
      description="Persistence, validation, compilation, and simulation are independent dimensions — never one green/red light. Toasts are transient confirmations; details always live in a persistent surface."
    >
      <Grid>
        <Specimen
          label="StatusMessage"
          note="Quiet header states. announce renders a polite live region (WCAG 4.1.3)."
        >
          <Row>
            <StatusMessage status="neutral" busy announce>
              Saving…
            </StatusMessage>
            <StatusMessage status="success">Saved</StatusMessage>
            <StatusMessage status="warning">Validation out of date</StatusMessage>
            <StatusMessage status="danger">3 validation errors</StatusMessage>
            <StatusMessage status="neutral">Not checked</StatusMessage>
          </Row>
          <Row>
            <span style={{ color: "var(--ds-text-secondary)", fontSize: "var(--ds-text-sm)" }}>
              Composed header state:
            </span>
            <StatusMessage status="success">Saved</StatusMessage>
            <span aria-hidden style={{ color: "var(--ds-text-muted)" }}>
              ·
            </span>
            <StatusMessage status="warning">Validation out of date</StatusMessage>
            <span aria-hidden style={{ color: "var(--ds-text-muted)" }}>
              ·
            </span>
            <StatusMessage status="neutral">Configuration not generated</StatusMessage>
          </Row>
        </Specimen>

        <Specimen label="StatusIndicator" note="Run lifecycle states; the running dot pulses unless reduced motion is set.">
          <Row>
            <StatusIndicator status="neutral">Queued</StatusIndicator>
            <StatusIndicator status="info" running>
              Running
            </StatusIndicator>
            <StatusIndicator status="success" detail="4 m 12 s">
              Completed
            </StatusIndicator>
            <StatusIndicator status="warning">Completed with warnings</StatusIndicator>
            <StatusIndicator status="danger">Failed</StatusIndicator>
            <StatusIndicator status="proposal">Proposed</StatusIndicator>
          </Row>
        </Specimen>

        <Specimen label="Badge">
          <Row>
            <Badge>Draft</Badge>
            <Badge status="info" mono>
              Kratos 10.4.3
            </Badge>
            <Badge status="success">Valid</Badge>
            <Badge status="warning">2 warnings</Badge>
            <Badge status="danger">3 errors</Badge>
            <Badge status="proposal">Proposed</Badge>
            <Badge mono>rev-0012</Badge>
          </Row>
        </Specimen>

        <Specimen label="Progress" note="Use determinate progress when the operation exposes measurable work.">
          <Stack>
            <Progress value={62} label="Generating configuration" />
            <Progress value={100} label="Staging input assets" valueText="Done" />
          </Stack>
        </Specimen>

        <Specimen label="InlineAlert">
          <Stack wide>
            <InlineAlert status="info" title="Proposal based on Draft 12">
              The assistant assumed a linear elastic material because none was specified.
            </InlineAlert>
            <InlineAlert status="success">Configuration compiled for Kratos 10.4.3.</InlineAlert>
            <InlineAlert status="warning" title="1 warning">
              Output interval 0.001 s will produce roughly 12 GB of results.
            </InlineAlert>
            <InlineAlert
              status="danger"
              title="The selected solver requires LinearSolversApplication"
              actions={
                <>
                  <Button size="sm" variant="secondary">
                    Focus node
                  </Button>
                  <Button size="sm" variant="ghost">
                    Explain
                  </Button>
                </>
              }
            >
              Choose a core solver or switch the target environment to one that includes the
              application. <span style={{ fontFamily: "var(--ds-font-mono)", fontSize: "var(--ds-text-xs)" }}>FG-ENV-014</span>
            </InlineAlert>
            <InlineAlert status="proposal" title="Proposed change">
              Add fixed support to Structure.Inlet — not applied until you review it.
            </InlineAlert>
          </Stack>
        </Specimen>

        <Specimen label="Banner" note="Persistent workspace-level conditions. Blocking states are not dismissible.">
          <Stack wide>
            <Banner
              status="warning"
              action={
                <Button size="sm" variant="secondary">
                  Reconnect
                </Button>
              }
            >
              <strong>Offline.</strong> Edits are kept locally and will sync when the
              connection returns.
            </Banner>
            <Banner status="info" onDismiss={() => {}}>
              This project targets the local Kratos 10.4.3 environment.
            </Banner>
          </Stack>
        </Specimen>

        <Specimen label="Toast" note="Fired from useToast(). Auto-dismisses; swipe or Esc to close.">
          <Row>
            <Button
              variant="secondary"
              onClick={() =>
                toast({
                  status: "success",
                  title: "Revision created",
                  description: "rev-0013 · Validated for Kratos 10.4.3",
                })
              }
            >
              Success toast
            </Button>
            <Button
              variant="secondary"
              onClick={() =>
                toast({
                  status: "danger",
                  title: "Compilation failed",
                  description: "See Problems for 2 blocking diagnostics.",
                })
              }
            >
              Failure toast
            </Button>
            <Button
              variant="ghost"
              onClick={() => toast({ title: "Layout reset", status: "neutral" })}
            >
              Neutral toast
            </Button>
          </Row>
        </Specimen>

        <Specimen label="Skeleton" note="Only where the final shape is stable.">
          <Stack>
            <Row>
              <Skeleton shape="circle" width={28} height={28} />
              <div style={{ flex: 1, display: "grid", gap: "var(--ds-space-2)" }}>
                <Skeleton shape="text" width="60%" />
                <Skeleton shape="text" width="40%" />
              </div>
            </Row>
            <Skeleton height={72} />
          </Stack>
        </Specimen>

        <Specimen label="EmptyState" note="Answers: what belongs here, why it’s empty, what to do next.">
          <div style={{ border: "1px solid var(--ds-border-default)", borderRadius: "var(--ds-radius-md)" }}>
            <EmptyState
              icon={<FolderOpen size={20} />}
              title="No simulations yet"
              description="Generate a valid configuration before running a simulation. Results and provenance will appear here."
              actions={
                <>
                  <Button variant="primary" iconStart={<Plus size={14} aria-hidden />}>
                    Generate configuration
                  </Button>
                  <Button variant="ghost">Open documentation</Button>
                </>
              }
            />
          </div>
        </Specimen>

        <Specimen label="ErrorState" note="What happened, what’s affected, what to do — plus a stable support code.">
          <div style={{ border: "1px solid var(--ds-border-default)", borderRadius: "var(--ds-radius-md)" }}>
            <ErrorState
              title="Simulation failed to start"
              description="The execution environment did not become ready. Your configuration may still be valid — retrying is safe."
              actions={
                <>
                  <Button variant="primary" iconStart={<RotateCcw size={14} aria-hidden />}>
                    Retry simulation
                  </Button>
                  <Button variant="ghost">View logs</Button>
                </>
              }
              supportCode="trace_8f41c2"
            />
          </div>
        </Specimen>
      </Grid>
    </Section>
  );
}
