
"use client";

import { useEffect, useId, useRef, useState } from "react";
import * as Plot from "@observablehq/plot";
import { geoAlbersUsa } from "d3";

import type { CensusRegion } from "@/app/lib/constants/geography";
import type { ElectionResult } from "@/app/lib/election-data";

import {
  REGION_FIPS,
  getFips,
  getRegionFeatures,
  getStateFeatures,
  getStateMesh,
  type MapFeature,
} from "@/app/lib/map-geography";

import { createLegend } from "@/app/components/map/map-legend";
import {
  createTooltip,
  populateTooltip,
} from "@/app/components/map/map-tooltip";

type MapVisualizationProps = {
  region?: CensusRegion;
  results: ElectionResult[];
  maxSize: string;
  minSize: string;
};

const OPTION_COLORS = {
  "Option A": "var(--map-option-a)",
  Tie: "var(--map-tie)",
  "Option B": "var(--map-option-b)",
};

type MapCategory = keyof typeof OPTION_COLORS;

function getMapCategory(result: ElectionResult): MapCategory {
  const [optionA, optionB] = result.candidates;

  if (optionA.total === optionB.total) return "Tie";

  return optionA.total > optionB.total ? "Option A" : "Option B";
}

function getCssColor(
  element: HTMLElement,
  variable: string,
  fallback: string
): string {
  return (
    getComputedStyle(element)
      .getPropertyValue(variable)
      .trim() || fallback
  );
}

function getResultKey(result: ElectionResult): string {
  if (result.geography.type === "region") {
    return result.geography.id;
  }

  return result.geography.fips;
}

function getResultDisplayName(
  result: ElectionResult,
  feature: MapFeature
): string {
  if (result.geography.type === "region") {
    return result.geography.name;
  }

  return result.geography.name || feature.properties.name;
}

function validateResults(
  results: ElectionResult[],
  region?: CensusRegion
): string | null {
  const expectedType = region ? "state" : "region";

  const wrongType = results.find(
    (result) => result.geography.type !== expectedType
  );

  if (wrongType) {
    return region
      ? "A regional map requires state-level election results."
      : "The national map requires Census-region election results.";
  }

  const seen = new Set<string>();

  for (const result of results) {
    const key = getResultKey(result);

    if (seen.has(key)) {
      return `Duplicate election result for ${key}.`;
    }

    seen.add(key);
  }

  if (!region) {
    const expected = Object.keys(REGION_FIPS);

    const missing = expected.filter((name) => !seen.has(name));

    if (missing.length > 0) {
      return `Missing Census-region results: ${missing.join(", ")}.`;
    }

    const unexpected = [...seen].filter(
      (name) => !expected.includes(name)
    );

    if (unexpected.length > 0) {
      return `Unexpected Census-region results: ${unexpected.join(", ")}.`;
    }

    return null;
  }

  const expectedFips = REGION_FIPS[region];
  const missing = expectedFips.filter((fips) => !seen.has(fips));

  const unexpected = [...seen].filter(
    (fips) => !expectedFips.includes(fips)
  );

  if (missing.length > 0) {
    return `Missing state results for FIPS: ${missing.join(", ")}.`;
  }

  if (unexpected.length > 0) {
    return `State results include FIPS codes outside ${region}: ${unexpected.join(", ")}.`;
  }

  return null;
}

export function MapVisualization({
  region,
  results,
  maxSize,
  minSize,
}: MapVisualizationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipId = useId();

  const [renderError, setRenderError] = useState<string | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const validationError = validateResults(results, region);

    if (validationError) {
      setRenderError(validationError);
      return;
    }

    setRenderError(null);

    // The geographic features shown on the map.
    const stateFeatures = getStateFeatures(region);

    // National map: regions are interactive.
    // Regional map: individual states are interactive.
    const targetFeatures: MapFeature[] = region
      ? stateFeatures
      : getRegionFeatures();

    const stateMesh = getStateMesh(region);

    const resultsByGeography = new globalThis.Map(
      results.map((result) => [getResultKey(result), result])
    );

    const colors = {
      optionA: getCssColor(container, "--map-option-a", "#4e79a7"),
      tie: getCssColor(container, "--map-tie", "#999999"),
      optionB: getCssColor(container, "--map-option-b", "#f28e2b"),
    };

    const chartWidth = Math.max(container.clientWidth, 1);
    const chartHeight = chartWidth * (610 / 975);

    // Fit the projection to the geography being displayed. This keeps a
    // regional map centered and scaled to its own states instead of leaving
    // those states in their positions on the national map.
    const projection = geoAlbersUsa().fitSize(
      [chartWidth, chartHeight],
      {
        type: "FeatureCollection",
        features: stateFeatures,
      }
    );

    const chart = Plot.plot({
      width: chartWidth,
      height: chartHeight,
      projection,

      color: {
        type: "ordinal",
        domain: ["Option A", "Tie", "Option B"],
        range: [
          colors.optionA,
          colors.tie,
          colors.optionB,
        ],
        legend: false,
      },

      marks: [
        // State fills.
        Plot.geo(stateFeatures, {
          fill: (feature: any) => {
            let result: ElectionResult | undefined;

            if (region) {
              result = resultsByGeography.get(getFips(feature));
            } else {
              const fips = getFips(feature);

              // Each state's fill comes from its Census region result.
              const regionName = Object.entries(REGION_FIPS).find(
                ([, codes]) => codes.includes(fips)
              )?.[0];

              result = regionName
                ? resultsByGeography.get(regionName)
                : undefined;
            }

            return result ? getMapCategory(result) : null;
          },
        }),

        // State boundaries.
        Plot.geo(stateMesh, {
          stroke: "var(--map-state-boundary)",
          strokeWidth: 0.8,
        }),

        // Active-region/state highlight overlay.
        Plot.geo(targetFeatures, {
          className: "map-highlight",
          fill: "transparent",
          stroke: "transparent",
          strokeWidth: 0,
          pointerEvents: "none",
        }),

        // Transparent interactive targets.
        Plot.geo(targetFeatures, {
          className: "map-hit-area",
          fill: "transparent",
          stroke: "transparent",
          pointerEvents: "all",
        }),
      ],
    });

    chart.style.display = "block";
    chart.style.width = "100%";
    chart.style.height = "auto";
    container.appendChild(chart);

    const legend = createLegend(results[0].candidates);
    legend.style.marginTop = "1.5rem";
    container.appendChild(legend);

    const tooltip = createTooltip(tooltipId);
    container.appendChild(tooltip);

    const hitPaths = Array.from(
      chart.querySelectorAll<SVGPathElement>(".map-hit-area path")
    );

    const highlightPaths = Array.from(
      chart.querySelectorAll<SVGPathElement>(".map-highlight path")
    );

    let activeIndex: number | null = null;
    let pinnedIndex: number | null = null;

    function positionTooltipAt(x: number, y: number) {
      const bounds = container!.getBoundingClientRect();

      const tooltipWidth = tooltip.offsetWidth;
      const tooltipHeight = tooltip.offsetHeight;

      let left = x - bounds.left + 14;
      let top = y - bounds.top + 14;

      if (left + tooltipWidth > bounds.width) {
        left = x - bounds.left - tooltipWidth - 14;
      }

      if (top + tooltipHeight > bounds.height) {
        top = y - bounds.top - tooltipHeight - 14;
      }

      tooltip.style.left = `${Math.max(0, left)}px`;
      tooltip.style.top = `${Math.max(0, top)}px`;
    }

    function positionTooltipAtFeature(index: number) {
      const bounds = hitPaths[index].getBoundingClientRect();

      positionTooltipAt(
        bounds.left + bounds.width / 2,
        bounds.top + bounds.height / 2
      );
    }

    function setActive(
      index: number | null,
      event?: PointerEvent
    ) {
      activeIndex = index;

      highlightPaths.forEach((path, i) => {
        path.style.fill =
          i === index ? "var(--map-highlight)" : "transparent";

        path.style.stroke =
          i === index ? "var(--map-active-outline)" : "transparent";

        path.style.strokeWidth = i === index ? "1.5" : "0";
      });

      if (index === null) {
        tooltip.style.display = "none";
        return;
      }

      const feature = targetFeatures[index];
      const result = region
        ? resultsByGeography.get(feature.properties.fips!)
        : resultsByGeography.get(feature.properties.name);

      if (!result) {
        tooltip.style.display = "none";
        return;
      }

      populateTooltip(
        tooltip,
        result,
        getResultDisplayName(result, feature)
      );

      tooltip.style.display = "block";

      if (event) {
        positionTooltipAt(event.clientX, event.clientY);
      } else {
        positionTooltipAtFeature(index);
      }
    }

    const cleanupListeners: (() => void)[] = [];

    hitPaths.forEach((path, index) => {
      const feature = targetFeatures[index];

      const displayName = region
        ? feature.properties.name
        : feature.properties.name;

      // These are informational controls, not navigation links.
      path.style.cursor = "pointer";
      path.style.outline = "none";
      path.setAttribute("tabindex", "0");
      path.setAttribute("role", "button");
      path.setAttribute(
        "aria-label",
        `Show election results for ${displayName}`
      );
      path.setAttribute("aria-describedby", tooltipId);

      const handlePointerEnter = (event: PointerEvent) => {
        setActive(index, event);
      };

      const handlePointerMove = (event: PointerEvent) => {
        if (activeIndex === index) {
          positionTooltipAt(event.clientX, event.clientY);
        }
      };

      const handlePointerLeave = () => {
        if (
          activeIndex === index &&
          document.activeElement !== path &&
          pinnedIndex !== index
        ) {
          setActive(null);
        }
      };

      const handleFocus = () => setActive(index);

      const handleBlur = () => setActive(null);

      const handleClick = () => {
        if (pinnedIndex === index) {
            pinnedIndex = null;

            if (document.activeElement !== path) {
            setActive(null);
            }
        } else {
            pinnedIndex = index;
            setActive(index);
        }
      };

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          setActive(activeIndex === index ? null : index);
        }

        if (event.key === "Escape") {
          pinnedIndex = null;
          setActive(null);
          path.blur();
        }
      };

      path.addEventListener("pointerenter", handlePointerEnter);
      path.addEventListener("pointermove", handlePointerMove);
      path.addEventListener("pointerleave", handlePointerLeave);
      path.addEventListener("focus", handleFocus);
      path.addEventListener("blur", handleBlur);
      path.addEventListener("click", handleClick);
      path.addEventListener("keydown", handleKeyDown);

      cleanupListeners.push(() => {
        path.removeEventListener("pointerenter", handlePointerEnter);
        path.removeEventListener("pointermove", handlePointerMove);
        path.removeEventListener("pointerleave", handlePointerLeave);
        path.removeEventListener("focus", handleFocus);
        path.removeEventListener("blur", handleBlur);
        path.removeEventListener("click", handleClick);
        path.removeEventListener("keydown", handleKeyDown);
      });
    });

    return () => {
      cleanupListeners.forEach((cleanup) => cleanup());
      tooltip.remove();
      legend.remove();
      chart.remove();
    };
  }, [region, results, tooltipId]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        minWidth: minSize,
        maxWidth: maxSize,
        margin: "0 auto",
      }}
    >
      {renderError && (
        <p
          role="alert"
          style={{
            textAlign: "center",
            padding: "2rem",
            color: "#b42318",
          }}
        >
          Unable to display map: {renderError}
        </p>
      )}
    </div>
  );
}
