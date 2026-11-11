
"use client";

import type { CensusRegion } from "@/app/lib/constants/geography";
import type { ElectionResult } from "@/app/lib/election-data";

import { MapVisualization } from "@/app/components/map/map-visualization";

export type StateMapProps = {
  /**
   * Omit for the national map.
   * Supply a Census region to display its individual states.
   */
  region?: CensusRegion;

  /**
   * Election results matching the selected geography.
   */
  results: ElectionResult[];

  /**
   * Maximum map width, expressed as a CSS length.
   * Examples: "60em", "900px", "100%".
   */
  maxSize?: string;

  /**
   * Minimum map width, expressed as a CSS length.
   * Examples: "60em", "900px", "100%".
   */
  minSize?: string;
};

export default function StateMap({
  region,
  results,
  maxSize = "60em",
  minSize = "10em",
}: StateMapProps) {
  return (
    <MapVisualization
      region={region}
      results={results}
      maxSize={maxSize}
      minSize={minSize}
    />
  );
}
