"use client";

import { useEffect, useState } from "react";

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
const flowgraphUrl = process.env.NEXT_PUBLIC_FLOWGRAPH_URL ?? "http://localhost:8182";

type Run = { id: string; state: string; log?: string };
type ServiceState = "checking" | "online" | "offline";

export default function Home() {
  const [run, setRun] = useState<Run | null>(null);
  const [busy, setBusy] = useState(false);
  const [apiState, setApiState] = useState<ServiceState>("checking");
  const [flowgraphState, setFlowgraphState] = useState<ServiceState>("checking");

  useEffect(() => {
    async function checkServices() {
      const [api, flowgraph] = await Promise.allSettled([
        fetch(`${apiUrl}/health`),
        fetch(flowgraphUrl, { mode: "cors" }),
      ]);
      setApiState(api.status === "fulfilled" && api.value.ok ? "online" : "offline");
      setFlowgraphState(
        flowgraph.status === "fulfilled" && flowgraph.value.ok ? "online" : "offline",
      );
    }
    void checkServices();
  }, []);

  async function smokeTest() {
    setBusy(true);
    setRun(null);
    try {
      const response = await fetch(`${apiUrl}/api/runs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project_parameters: {} }),
      });
      if (!response.ok) throw new Error(`API returned ${response.status}`);
      const created: Run = await response.json();
      setRun(created);
      const timer = window.setInterval(async () => {
        const current = await fetch(`${apiUrl}/api/runs/${created.id}`).then((result) => {
          if (!result.ok) throw new Error(`API returned ${result.status}`);
          return result.json() as Promise<Run>;
        });
        setRun(current);
        if (["completed", "failed"].includes(current.state)) {
          window.clearInterval(timer);
          setBusy(false);
        }
      }, 1000);
    } catch (error) {
      setRun({ id: "request", state: "failed", log: String(error) });
      setBusy(false);
    }
  }

  return (
    <main>
      <header>
        <a className="wordmark" href="/">Flowgraph AI</a>
        <span className="environment">local development</span>
      </header>

      <div className="intro">
        <p className="kicker">Flowgraph AI</p>
        <h1>AI tools for Flowgraph</h1>
        <p>Create and manage Flowgraph projects for Kratos from a single workspace.</p>
      </div>

      <div className="workspace-grid">
        <section className="services-panel">
          <div className="section-heading">
            <h2>Services</h2>
            <span>Docker Compose</span>
          </div>

          <ServiceRow name="Flowgraph editor" address="localhost:8182" state={flowgraphState} href={flowgraphUrl} />
          <ServiceRow name="FastAPI" address="localhost:8000" state={apiState} href={`${apiUrl}/docs`} />
          <ServiceRow name="Kratos runner" address="internal worker" state={apiState} />
        </section>

        <section className="runner-panel">
          <div className="section-heading">
            <h2>Runner check</h2>
            <span>Kratos 10.4.3</span>
          </div>
          <p>Submit a minimal job to verify the API, shared volume, and Kratos Python runtime.</p>
          <button onClick={smokeTest} disabled={busy}>
            {busy ? "Running check…" : "Run smoke test"}
          </button>
          {run ? (
            <div className="run-result">
              <div>
                <span className={`status-dot ${run.state}`} />
                <strong>{run.state}</strong>
                <code>{run.id}</code>
              </div>
              <pre>{run.log || "Waiting for runner output…"}</pre>
            </div>
          ) : (
            <p className="empty-state">No check has been run in this session.</p>
          )}
        </section>
      </div>

      <footer>
        <span>flowgraph-ai</span>
        <span>Flowgraph · AI · Kratos</span>
      </footer>
    </main>
  );
}

function ServiceRow({ name, address, state, href }: { name: string; address: string; state: ServiceState; href?: string }) {
  const content = (
    <>
      <span className={`status-dot ${state}`} />
      <strong>{name}</strong>
      <code>{address}</code>
      <span className="service-state">{state}</span>
      {href && <span aria-hidden="true">↗</span>}
    </>
  );
  return href ? <a className="service-row" href={href} target="_blank" rel="noreferrer">{content}</a> : <div className="service-row">{content}</div>;
}
