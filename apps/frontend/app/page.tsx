"use client";

import { ArrowRight, ExternalLink } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/design-system";
import styles from "./home.module.css";

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
const flowgraphUrl = process.env.NEXT_PUBLIC_FLOWGRAPH_URL ?? "http://localhost:8182";
const temporalUiUrl = process.env.NEXT_PUBLIC_TEMPORAL_UI_URL ?? "http://localhost:8233";

type Run = { id: string; state: string; log?: string };
type ServiceState = "checking" | "online" | "offline" | "not-checked";

interface ReadinessResponse {
  checks?: Record<string, { status?: string }>;
}

const workflowSteps = [
  {
    number: "01",
    title: "Describe the case",
    description:
      "Capture the analysis intent, model assumptions, constraints, and target Kratos environment in plain engineering language.",
  },
  {
    number: "02",
    title: "Review proposed changes",
    description:
      "Inspect each proposed node and parameter change in the graph before accepting it into the working draft.",
  },
  {
    number: "03",
    title: "Validate and generate",
    description:
      "Apply deterministic schema, compatibility, and graph checks before producing configuration artifacts.",
  },
] as const;

export default function Home() {
  const [run, setRun] = useState<Run | null>(null);
  const [busy, setBusy] = useState(false);
  const [apiState, setApiState] = useState<ServiceState>("checking");
  const [flowgraphState, setFlowgraphState] = useState<ServiceState>("checking");
  const [redisState, setRedisState] = useState<ServiceState>("checking");
  const [temporalState, setTemporalState] = useState<ServiceState>("checking");
  const runController = useRef<AbortController | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function checkServices() {
      const [api, flowgraph] = await Promise.allSettled([
        fetch(`${apiUrl}/health/ready`, {
          cache: "no-store",
          signal: controller.signal,
        }),
        fetch(flowgraphUrl, {
          cache: "no-store",
          mode: "cors",
          signal: controller.signal,
        }),
      ]);

      if (controller.signal.aborted) return;

      if (api.status === "fulfilled") {
        setApiState("online");
        try {
          const readiness = (await api.value.json()) as ReadinessResponse;
          setRedisState(readiness.checks?.redis?.status === "ok" ? "online" : "offline");
          setTemporalState(
            readiness.checks?.temporal?.status === "ok" ? "online" : "offline",
          );
        } catch {
          setRedisState("offline");
          setTemporalState("offline");
        }
      } else {
        setApiState("offline");
        setRedisState("offline");
        setTemporalState("offline");
      }

      setFlowgraphState(
        flowgraph.status === "fulfilled" && flowgraph.value.ok ? "online" : "offline",
      );
    }

    void checkServices();
    return () => controller.abort();
  }, []);

  useEffect(() => () => runController.current?.abort(), []);

  async function smokeTest() {
    runController.current?.abort();
    const controller = new AbortController();
    runController.current = controller;
    setBusy(true);
    setRun(null);

    try {
      const response = await fetch(`${apiUrl}/api/runs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project_parameters: {} }),
        signal: controller.signal,
      });
      if (!response.ok) throw new Error(`The API returned HTTP ${response.status}.`);

      const created = (await response.json()) as Run;
      setRun(created);

      for (let attempt = 0; attempt < 120; attempt += 1) {
        await new Promise((resolve) => window.setTimeout(resolve, 1000));
        if (controller.signal.aborted) return;

        const pollResponse = await fetch(`${apiUrl}/api/runs/${created.id}`, {
          cache: "no-store",
          signal: controller.signal,
        });
        if (!pollResponse.ok) {
          throw new Error(`The API returned HTTP ${pollResponse.status}.`);
        }

        const current = (await pollResponse.json()) as Run;
        setRun(current);
        if (["completed", "failed", "canceled"].includes(current.state)) return;
      }

      throw new Error("The runtime check did not finish within two minutes.");
    } catch (error) {
      if (controller.signal.aborted) return;
      setRun({
        id: "request",
        state: "failed",
        log: error instanceof Error ? error.message : "The runtime check failed.",
      });
    } finally {
      if (runController.current === controller) {
        runController.current = null;
        setBusy(false);
      }
    }
  }

  const runnerState: ServiceState = !run
    ? "not-checked"
    : run.state === "completed"
      ? "online"
      : ["failed", "canceled"].includes(run.state)
        ? "offline"
        : "checking";

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.siteHeader}>
          <a className={styles.wordmark} href="/" aria-label="Flowgraph AI home">
            Flowgraph AI
          </a>
          <nav className={styles.navigation} aria-label="Primary navigation">
            <a href="/design-system">Design system</a>
            <a href="#environment">Environment</a>
          </nav>
          <span className={styles.environmentLabel}>Local development</span>
        </header>

        <section className={styles.hero} aria-labelledby="page-title">
          <p className={styles.eyebrow}>Product direction</p>
          <h1 id="page-title">From engineering intent to a reviewable simulation graph.</h1>
          <p className={styles.lede}>
            Flowgraph AI is being built to create Kratos configuration files through
            guided conversation. Proposed changes remain visible in Flowgraph and pass
            deterministic checks before they become runnable artifacts.
          </p>
          <div className={styles.heroActions}>
            <a className={styles.primaryLink} href="/design-system">
              View the interface system
              <ArrowRight size={15} aria-hidden />
            </a>
            <a
              className={styles.secondaryLink}
              href={flowgraphUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Open legacy Flowgraph in a new tab"
            >
              Open legacy Flowgraph
              <ExternalLink size={14} aria-hidden />
            </a>
          </div>
        </section>

        <section className={styles.workflow} aria-labelledby="workflow-title">
          <div className={styles.sectionIntroduction}>
            <p className={styles.sectionLabel}>Planned workflow</p>
            <div>
              <h2 id="workflow-title">Conversation proposes. The graph stays authoritative.</h2>
              <p>
                The product separates probabilistic assistance from deterministic engineering
                checks. Nothing is accepted, generated, or executed without an explicit state
                transition.
              </p>
            </div>
          </div>
          <ol className={styles.workflowList}>
            {workflowSteps.map((step) => (
              <li key={step.number}>
                <span className={styles.stepNumber}>{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id="environment" className={styles.environment} aria-labelledby="environment-title">
          <div className={styles.sectionIntroduction}>
            <p className={styles.sectionLabel}>Development environment</p>
            <div>
              <h2 id="environment-title">Local services</h2>
              <p>
                Live status from the Docker Compose stack. These tools support development;
                they are not the finished product workspace.
              </p>
            </div>
          </div>

          <div className={styles.environmentGrid}>
            <section className={styles.servicesPanel} aria-labelledby="services-title">
              <div className={styles.panelHeading}>
                <h3 id="services-title">Service status</h3>
                <span>Docker Compose</span>
              </div>
              <ServiceRow
                name="Legacy Flowgraph"
                address="localhost:8182"
                state={flowgraphState}
                href={flowgraphUrl}
              />
              <ServiceRow
                name="Application API"
                address="localhost:8000"
                state={apiState}
                href={`${apiUrl}/docs`}
              />
              <ServiceRow
                name="Temporal"
                address="localhost:8233"
                state={temporalState}
                href={temporalUiUrl}
              />
              <ServiceRow name="Redis" address="internal" state={redisState} />
              <ServiceRow name="Kratos runtime" address="internal" state={runnerState} />
            </section>

            <section className={styles.checkPanel} aria-labelledby="check-title">
              <div className={styles.panelHeading}>
                <h3 id="check-title">Kratos runtime check</h3>
                <span>10.4.3</span>
              </div>
              <p>
                Submit a minimal local job to verify the API, shared job volume, runner,
                and Kratos Python import.
              </p>
              <Button variant="primary" onClick={smokeTest} disabled={busy} loading={busy}>
                {busy ? "Running check" : "Run runtime check"}
              </Button>
              {run ? (
                <div className={styles.runResult} aria-live="polite">
                  <div className={styles.runSummary}>
                    <span className={`${styles.statusDot} ${styles[runnerState]}`} aria-hidden />
                    <strong>{formatRunState(run.state)}</strong>
                    <code>{run.id}</code>
                  </div>
                  <pre>{run.log || "Waiting for runner output…"}</pre>
                </div>
              ) : (
                <p className={styles.emptyResult}>No runtime check in this browser session.</p>
              )}
            </section>
          </div>
        </section>

        <footer className={styles.footer}>
          <span>Flowgraph AI</span>
          <span>Engineering workspace · local stack</span>
        </footer>
      </div>
    </main>
  );
}

function ServiceRow({
  name,
  address,
  state,
  href,
}: {
  name: string;
  address: string;
  state: ServiceState;
  href?: string;
}) {
  const content = (
    <>
      <span className={`${styles.statusDot} ${styles[state]}`} aria-hidden />
      <strong>{name}</strong>
      <code>{address}</code>
      <span className={styles.serviceState}>{formatServiceState(state)}</span>
      {href && <ExternalLink size={13} aria-hidden />}
    </>
  );

  return href ? (
    <a
      className={styles.serviceRow}
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={`${name}: ${formatServiceState(state)}. Open in a new tab.`}
    >
      {content}
    </a>
  ) : (
    <div className={styles.serviceRow}>{content}</div>
  );
}

function formatServiceState(state: ServiceState) {
  if (state === "not-checked") return "Not checked";
  return state.charAt(0).toUpperCase() + state.slice(1);
}

function formatRunState(state: string) {
  return state.replaceAll("_", " ");
}
