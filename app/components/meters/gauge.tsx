"use client";

import { useEffect, useRef } from "react";
import { useElectionData } from "@/app/components/data/election-data-provider";
import type { CensusRegion } from "@/app/lib/constants/geography";

type VoteShareGaugeProps = {
  region: CensusRegion;
  caption?: string;
};

const CX = 210;
const CY = 212;
const OUTER_RADIUS = 190;
const INNER_RADIUS = 56;
const LABEL_RADIUS = 130;

// The center TOSSUP slice spans 3/7 to 4/7 of the vote.
const TOSSUP_MIN = 3 / 7;
const TOSSUP_MAX = 4 / 7;

const OPTION_A_COLOR = "var(--map-option-a, #4e79a7)";
const OPTION_B_COLOR = "var(--map-option-b, #f28e2b)";
const TIE_COLOR = "var(--map-tie, #999999)";

const SEGMENTS = [
  { label: "VERY LIKELY", fill: "#d8e8f5", color: "#315b80" },
  { label: "LIKELY", fill: "#e3eef7", color: "#315b80" },
  { label: "LEAN", fill: "#edf3f8", color: "#315b80" },
  { label: "TOSSUP", fill: "#f1f1f1", color: "#555555" },
  { label: "LEAN", fill: "#fbefeb", color: "#a84f30" },
  { label: "LIKELY", fill: "#f8e1dc", color: "#a84f30" },
  { label: "VERY LIKELY", fill: "#f4d1c8", color: "#a84f30" },
] as const;

function pointAt(radius: number, degrees: number) {
  const radians = (degrees * Math.PI) / 180;

  return {
    x: CX + radius * Math.cos(radians),
    y: CY - radius * Math.sin(radians),
  };
}

function segmentPath(startAngle: number, endAngle: number) {
  const outerStart = pointAt(OUTER_RADIUS, startAngle);
  const outerEnd = pointAt(OUTER_RADIUS, endAngle);
  const innerEnd = pointAt(INNER_RADIUS, endAngle);
  const innerStart = pointAt(INNER_RADIUS, startAngle);

  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${OUTER_RADIUS} ${OUTER_RADIUS} 0 0 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${INNER_RADIUS} ${INNER_RADIUS} 0 0 0 ${innerStart.x} ${innerStart.y}`,
    "Z",
  ].join(" ");
}

export default function VoteShareGauge({
  region,
  caption,
}: VoteShareGaugeProps) {
  const needleRef = useRef<SVGGElement>(null);
  const { data, loading, error } = useElectionData();

  const results = data?.states.filter(
    (result) =>
      result.geography.type === "state" &&
      result.geography.region === region
  );

  if (loading) {
    return <p role="status">Loading gauge…</p>;
  }

  if (error) {
    return <p role="alert">{error}</p>;
  }

  if (!results || results.length === 0) return null;

  const optionAName = results[0].candidates[0].name;
  const optionBName = results[0].candidates[1].name;

  const optionATotal = results.reduce(
    (total, result) => total + result.candidates[0].total,
    0
  );

  const optionBTotal = results.reduce(
    (total, result) => total + result.candidates[1].total,
    0
  );

  const totalVotes = optionATotal + optionBTotal;

  const optionAShare =
    totalVotes > 0 ? optionATotal / totalVotes : 0.5;

  const safeShare = Math.max(0, Math.min(1, optionAShare));
  const targetRotation = 90 - safeShare * 180;

  const isTossup =
    safeShare >= TOSSUP_MIN && safeShare <= TOSSUP_MAX;

  const isOptionALeading = safeShare > 0.5;

  const leaderColor = isTossup
    ? TIE_COLOR
    : isOptionALeading
      ? OPTION_A_COLOR
      : OPTION_B_COLOR;

  const resultCaption = caption ?? (
    isTossup
      ? "It's a tossup"
      : isOptionALeading
        ? `${optionAName} leads`
        : `${optionBName} leads`
  );

  useEffect(() => {
    const needle = needleRef.current;
    if (!needle) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const setRotation = (degrees: number) => {
      needle.setAttribute(
        "transform",
        `rotate(${degrees} ${CX} ${CY})`
      );
    };

    if (reducedMotion) {
      setRotation(targetRotation);
      return;
    }

    const startTime = performance.now();
    const introDuration = 1100;
    let frameId = 0;

    const animate = (now: number) => {
      const elapsed = now - startTime;

      if (elapsed < introDuration) {
        const progress = Math.min(
          elapsed / introDuration,
          1
        );

        const eased = 1 - Math.pow(1 - progress, 3);

        setRotation(targetRotation * eased);
      } else {
        const wobbleTime = (elapsed - introDuration) / 1000;

        const wobble =
          Math.sin(wobbleTime * Math.PI * 2 * 1.4) * 1.2;

        setRotation(targetRotation + wobble);
      }

      frameId = window.requestAnimationFrame(animate);
    };

    frameId = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [targetRotation]);

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 440,
        margin: "0 auto",
        color: "var(--map-tooltip-color, #333)",
        fontFamily: '"Libre Franklin", sans-serif',
      }}
    >
      <svg
        viewBox="0 0 420 250"
        role="img"
        aria-label={`Vote share gauge: ${optionAName} ${Math.round(
          safeShare * 100
        )}%, ${optionBName} ${Math.round(
          (1 - safeShare) * 100
        )}%.`}
        style={{
          display: "block",
          width: "100%",
          height: "auto",
          overflow: "visible",
        }}
      >
        {/* Gauge segments */}
        {SEGMENTS.map((segment, index) => {
          const segmentWidth = 180 / SEGMENTS.length;

          const startAngle = 180 - index * segmentWidth;
          const endAngle = 180 - (index + 1) * segmentWidth;

          const labelPoint = pointAt(
            LABEL_RADIUS,
            180 - (index + 0.5) * segmentWidth
          );

          return (
            <g key={`${segment.label}-${index}`}>
              <path
                d={segmentPath(startAngle, endAngle)}
                fill={segment.fill}
                stroke="#b8b8b8"
                strokeWidth="0.8"
                strokeLinejoin="round"
              />

              <text
                x={labelPoint.x}
                y={labelPoint.y + 4}
                textAnchor="middle"
                fontSize="9"
                letterSpacing="0.2"
                fill={segment.color}
              >
                {segment.label}
              </text>
            </g>
          );
        })}

        {/* Baseline */}
        <line
          x1="12"
          y1={CY}
          x2="408"
          y2={CY}
          stroke="#a8a8a8"
          strokeWidth="1"
        />

        {/* Animated needle */}
        <g
          ref={needleRef}
          transform={`rotate(0 ${CX} ${CY})`}
        >
          <path
            d={`M ${CX - 4.5} ${CY - 3} L ${CX} ${
              CY - 174
            } L ${CX + 4.5} ${CY - 3} Z`}
            fill={leaderColor}
          />

          {/* Needle pivot */}
          <circle
            cx={CX}
            cy={CY}
            r="10"
            fill={leaderColor}
            stroke="#ffffff"
            strokeWidth="1.5"
          />
        </g>
      </svg>

      {/* Result caption */}
      <div
        style={{
          marginTop: -16,
          textAlign: "center",
          color: leaderColor,
          fontSize: "21px",
          lineHeight: 1.2,
          fontWeight: 400,
        }}
      >
        {resultCaption}
      </div>

      {/* Raw vote totals */}
      <div
        style={{
          marginTop: 6,
          textAlign: "center",
          color: "var(--map-tooltip-muted, #777)",
          fontSize: 12,
        }}
      >
        {optionAName}: {optionATotal.toLocaleString()} votes
        {" · "}
        {optionBName}: {optionBTotal.toLocaleString()} votes
      </div>
    </div>
  );
}