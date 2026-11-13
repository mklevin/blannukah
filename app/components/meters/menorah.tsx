
"use client";
import { useElectionData } from "@/app/components/data/election-data-provider";

type VoteShareMenorahProps = {
  optionAShare: number;
  optionATotal: number;
  optionBTotal: number;
  optionAName: string;
  optionBName: string;
};

const OPTION_A_COLOR = "var(--map-option-a, #4e79a7)";
const OPTION_B_COLOR = "var(--map-option-b, #f28e2b)";
const TIE_COLOR = "var(--map-tie, #999999)";
const MUTED_COLOR = "#d5d5d5";
const STRUCTURE_COLOR = "#da9100";

const BRANCHES = [36, 147, 256, 365, 535, 644, 753, 860];

const FLAME_PATH = `
  m78.734 34.484
  c-0.32812-0.57812-0.98438-0.89062-1.6406-0.78125
  s-1.1719 0.64062-1.2656 1.2969
  c-1.375 8.5781-5.4688 11.406-7.8906 12.344
  3.0156-32.391-21.609-43.969-21.875-44.078
  -0.51562-0.23438-1.1094-0.17188-1.5625 0.15625
  s-0.70312 0.875-0.64062 1.4375
  c2.4844 23.078-7.1406 31.797-10.641 34.156
  -0.70312-1.8438-0.98438-5.1875-0.95312-7.4531
  0-0.67188-0.40625-1.2656-1.0312-1.5
  s-1.3281-0.03125-1.75 0.5
  c-12.797 16.031-17.391 30.312-13.656 42.469
  5.2812 17.188 25.156 23.516 25.984 23.766
  0.15625 0.046875 0.3125 0.0625 0.45312 0.0625
  0.60938 0 1.1719-0.35938 1.4219-0.92188
  0.32812-0.71875 0.046875-1.5781-0.625-1.9844
  -0.53125-0.3125-12.188-7.4844-9.0781-25.297
  0.76562 0.92188 1.7188 1.8906 2.8125 2.5938
  0.39062 0.25 0.85938 0.3125 1.2969 0.1875
  1.8438-0.54688 3.7812-4.6875 5.5938-12
  0.9375-3.8125 1.5625-6.3594 1.9375-8.0938
  3.6562 2.8438 10.984 10.141 9 21.688
  -0.10938 0.64062 0.1875 1.2656 0.73438 1.5938
  s1.25 0.29688 1.75-0.09375
  c0.20312-0.15625 4.1094-3.1875 6.0625-8.0625
  1.6562 3.75 3.6406 9.9219 2.2969 15.969
  -1.0469 4.6719-3.9531 8.5625-8.625 11.531
  -0.60938 0.39062-0.875 1.1562-0.64062 1.8281
  0.23438 0.6875 0.92188 1.1094 1.6406 1.0469
  0.25-0.03125 25.547-3.1094 27.359-35.234
  0-0.0625 0-0.14062 0.015625-0.20312
  0.17188-14.828-6.2344-26.453-6.5-26.938z
`;


function Flame({
  x,
  y,
  color,
  active,
}: {
  x: number;
  y: number;
  color: string;
  active: boolean;
}) {
  const flameScale = active ? 1.2 : 1;

  return (
    <svg
      x={x - 40 * flameScale}
      y={y - 35 * flameScale}
      width={80 * flameScale}
      height={80 * flameScale}
      viewBox="-5 -10 110 135"
      preserveAspectRatio="xMidYMid meet"
      overflow="visible"
      aria-hidden="true"
    >
      <path
        d={FLAME_PATH}
        fill={active ? color : MUTED_COLOR}
        style={{
          transformBox: "fill-box",
          transformOrigin: "center bottom",
          transition: "fill 350ms ease",
        }}
      >
        {active && (
          <>
            <animateTransform
              attributeName="transform"
              type="scale"
              values="1 1; 0.96 1.04; 1.03 0.97; 0.98 1.03; 1 1"
              dur="1.4s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="1; 0.88; 1; 0.93; 1"
              dur="1.1s"
              repeatCount="indefinite"
            />
          </>
        )}
      </path>
    </svg>
  );
}


function CandidateLabel({
  name,
  total,
  color,
  align,
}: {
  name: string;
  total: number;
  color: string;
  align: "left" | "right";
}) {
  return (
    <div
      className={`min-w-0 ${
        align === "left" ? "text-left" : "text-right"
      }`}
      style={{ fontFamily: '"Libre Franklin", sans-serif' }}
    >
      <div
        className="break-words text-sm font-bold leading-tight"
        style={{ color }}
      >
        {name}
      </div>

      <div className="mt-1 whitespace-nowrap text-xs text-gray-500">
        {total.toLocaleString()} votes
      </div>
    </div>
  );
}

export default function VoteShareMenorah() {
  const { data, loading, error } = useElectionData();

  if (loading) {
    return <p role="status">Loading Menorah…</p>;
  }

  if (error) {
    return <p role="alert">{error}</p>;
  }

  const national = data?.national;

  if (!national) {
    return null;
  }

  const optionAName = national.candidates[0].name;
  const optionBName = national.candidates[1].name;

  const optionATotal = national.candidates[0].total;
  const optionBTotal = national.candidates[1].total;

  const totalVotes = optionATotal + optionBTotal;

  const optionAShare =
    totalVotes > 0 ? optionATotal / totalVotes : 0.5;

  const safeShare = Math.max(0, Math.min(1, optionAShare));

  // 100% Option A = leftmost branch.
  // 100% Option B = rightmost branch.
  const isTossup = safeShare === 0.5;
  const activeIndex = isTossup ? -1 : Math.round((1 - safeShare) * 7);
  const isOptionALeading = safeShare > 0.5;

  const leaderColor = isTossup
    ? TIE_COLOR
    : isOptionALeading
      ? OPTION_A_COLOR
      : OPTION_B_COLOR;

  return (
    <div
      className="mx-auto grid w-full max-w-5xl grid-cols-2 items-center gap-x-2 sm:grid-cols-[minmax(6rem,1fr)_minmax(0,5fr)_minmax(6rem,1fr)] sm:gap-x-1"
      style={{ fontFamily: '"Libre Franklin", sans-serif' }}
    >
      {/* Candidate A */}
      <div className="min-w-0 sm:col-start-1 sm:row-start-1">
        <CandidateLabel
          name={optionAName}
          total={optionATotal}
          color={OPTION_A_COLOR}
          align="left"
        />
      </div>

      {/* Candidate B */}
      <div className="min-w-0 sm:col-start-3 sm:row-start-1">
        <CandidateLabel
          name={optionBName}
          total={optionBTotal}
          color={OPTION_B_COLOR}
          align="right"
        />
      </div>

      {/* Menorah */}
      <div className="col-span-2 min-w-0 sm:col-span-1 sm:col-start-2 sm:row-start-1">
        <svg
          viewBox="0 -65 900 210"
          width="100%"
          className="block h-auto w-full"
          style={{ aspectRatio: "900 / 210" }}
          role="img"
          aria-label={`${Math.round(
            safeShare * 100
          )}% for ${optionAName}.`}
        >
          {/* Base */}
          <path
            d="M 365 130 H 535 M 385 107 M 450 115 V 94"
            fill="none"
            stroke={STRUCTURE_COLOR}
            strokeWidth="24"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Horizontal support */}
          <path
            d="M 30 94 H 865"
            fill="none"
            stroke={STRUCTURE_COLOR}
            strokeWidth="24"
            strokeLinecap="round"
          />

          {/* Shamash support */}
          <path
            d="M 450 90 V 34"
            fill="none"
            stroke={STRUCTURE_COLOR}
            strokeWidth="24"
            strokeLinecap="round"
          />

          {/* Eight outer candles */}
          {BRANCHES.map((x, index) => {
            const active = index === activeIndex;

            return (
              <g key={x}>
                {/* Vertical branch */}
                <path
                  d={`M ${x} 88 V 61`}
                  fill="none"
                  stroke={STRUCTURE_COLOR}
                  strokeWidth="36"
                  strokeLinecap="round"
                />

                {/* Candle holder */}
                <path
                  d={`M ${x - 20} 61 H ${x + 20}`}
                  stroke={STRUCTURE_COLOR}
                  strokeWidth="20"
                  strokeLinecap="round"
                />

                {/* Flame */}
                <Flame
                  x={x}
                  y={15}
                  color={leaderColor}
                  active={active}
                />
              </g>
            );
          })}

          {/* Raised central shamash */}
          <path
            d="M 450 36 V 22"
            fill="none"
            stroke={STRUCTURE_COLOR}
            strokeWidth="24"
            strokeLinecap="round"
          />

          <path
            d="M 430 22 H 470"
            stroke={STRUCTURE_COLOR}
            strokeWidth="20"
            strokeLinecap="round"
          />

          <Flame
            x={450}
            y={-20}
            color={TIE_COLOR}
            active={isTossup}
          />
        </svg>
      </div>
    </div>
  );
}
