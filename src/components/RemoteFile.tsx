import { useState } from "react";
import { useCopy } from "../i18n/useCopy";
import { CodeBlock } from "./CodeBlock";

type Load =
  { state: "idle" | "loading" | "failed" } | { state: "loaded"; text: string };

// The file lives in the artel repository and the page keeps no copy of it, so showing and copying both fetch
// it when the reader asks.
async function fetchText(url: string): Promise<string> {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.text();
}

// Safari drops clipboard writes that happen after an await. A ClipboardItem given the pending fetch keeps the
// write inside the click; writeText is the fallback where ClipboardItem is missing.
async function copyFromUrl(url: string): Promise<void> {
  if (typeof ClipboardItem !== "undefined" && navigator.clipboard.write) {
    const blob = fetchText(url).then(
      (text) => new Blob([text], { type: "text/plain" }),
    );
    await navigator.clipboard.write([
      new ClipboardItem({ "text/plain": blob }),
    ]);
    return;
  }
  await navigator.clipboard.writeText(await fetchText(url));
}

export function RemoteFile({
  url,
  viewUrl,
  showLabel,
  copyLabel,
}: {
  url: string;
  viewUrl: string;
  showLabel: string;
  copyLabel: string;
}) {
  const { t } = useCopy();
  const copy = t.selfHosting.remoteFile;
  const [load, setLoad] = useState<Load>({ state: "idle" });
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">(
    "idle",
  );
  // Open, the shown file carries its own copy button, so this one steps aside.
  const [open, setOpen] = useState(false);

  async function show(open: boolean) {
    if (!open || load.state === "loading" || load.state === "loaded") return;
    setLoad({ state: "loading" });
    try {
      setLoad({ state: "loaded", text: await fetchText(url) });
    } catch {
      setLoad({ state: "failed" });
    }
  }

  async function copyFile() {
    try {
      await copyFromUrl(url);
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }
    window.setTimeout(() => setCopyState("idle"), 1600);
  }

  return (
    <div className="remote-file">
      <details
        className="advanced remote-file__details"
        onToggle={(event) => {
          setOpen(event.currentTarget.open);
          void show(event.currentTarget.open);
        }}
      >
        <summary>{showLabel}</summary>
        {load.state === "loading" ? (
          <p className="advanced__note">{copy.loading}</p>
        ) : null}
        {load.state === "loaded" ? <CodeBlock code={load.text} /> : null}
        {load.state === "failed" ? (
          <p className="advanced__note">
            {copy.failed}{" "}
            <a href={viewUrl} rel="noreferrer noopener" target="_blank">
              {copy.openOnGitHub}
            </a>
          </p>
        ) : null}
      </details>
      {open ? null : (
        <button
          className="btn btn--ghost btn--sm remote-file__copy"
          onClick={() => void copyFile()}
          type="button"
        >
          {copyState === "copied"
            ? t.sdk.copied
            : copyState === "failed"
              ? copy.failed
              : copyLabel}
        </button>
      )}
    </div>
  );
}
