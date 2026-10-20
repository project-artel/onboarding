import type { ReactNode } from "react";

export type ArchitectureLabels = {
  game: string;
  orchestration: string;
  agent: string;
  model: string;
  console: string;
  storage: string;
};

// Numbers on the arrows match the data flow list below the diagram, so the list explains the arrows instead of
// repeating them. Drawn as text, not an image, so each locale and the dark theme render it without a second asset.
const BOX_W = 200;
const BOX_H = 64;

function Box({
  x,
  y,
  label,
  accent,
}: {
  x: number;
  y: number;
  label: string;
  accent?: boolean;
}) {
  return (
    <g>
      <rect
        className={accent ? "arch__box arch__box--accent" : "arch__box"}
        height={BOX_H}
        rx="6"
        width={BOX_W}
        x={x}
        y={y}
      />
      <text
        className="arch__label"
        dominantBaseline="middle"
        textAnchor="middle"
        x={x + BOX_W / 2}
        y={y + BOX_H / 2}
      >
        {label}
      </text>
    </g>
  );
}

function Arrow({
  d,
  num,
  nx,
  ny,
}: {
  d: string;
  num: string;
  nx: number;
  ny: number;
}): ReactNode {
  return (
    <g>
      <path className="arch__edge" d={d} markerEnd="url(#arch-arrow)" />
      <text className="arch__num" textAnchor="middle" x={nx} y={ny}>
        {num}
      </text>
    </g>
  );
}

export function ArchitectureDiagram({
  labels,
  title,
}: {
  labels: ArchitectureLabels;
  title: string;
}) {
  return (
    <div className="arch">
      <svg
        aria-label={title}
        className="arch__svg"
        role="img"
        viewBox="0 0 900 300"
      >
        <defs>
          <marker
            id="arch-arrow"
            markerHeight="8"
            markerWidth="8"
            orient="auto-start-reverse"
            refX="7"
            refY="4"
            viewBox="0 0 8 8"
          >
            <path className="arch__head" d="M0 0 L8 4 L0 8 z" />
          </marker>
        </defs>

        <Box label={labels.game} x={10} y={20} />
        <Box accent label={labels.orchestration} x={350} y={20} />
        <Box label={labels.agent} x={690} y={20} />
        <Box label={labels.console} x={10} y={216} />
        <Box label={labels.storage} x={350} y={216} />
        <Box label={labels.model} x={690} y={216} />

        <Arrow d="M210 40 H346" num="1 · 4" nx={278} ny={32} />
        <Arrow d="M350 64 H214" num="3" nx={282} ny={82} />
        <Arrow d="M550 40 H686" num="2" nx={618} ny={32} />
        <Arrow d="M690 64 H554" num="2" nx={622} ny={82} />
        <Arrow d="M790 84 V212" num="2" nx={804} ny={152} />
        <Arrow d="M450 84 V212" num="5" nx={464} ny={152} />
        <Arrow d="M372 84 L214 214" num="5" nx={278} ny={140} />
      </svg>
    </div>
  );
}
