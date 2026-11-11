
import * as topojson from "topojson-client";
import us from "@/app/resources/states-10m.json";
import type { CensusRegion } from "@/app/lib/constants/geography";

export const REGION_FIPS: Record<CensusRegion, string[]> = {
  Northeast: [
    "09", "23", "25", "33", "44", "50", "34", "36", "42",
  ],
  Midwest: [
    "17", "18", "26", "39", "55", "19", "20", "27", "29",
    "31", "38", "46",
  ],
  South: [
    "10", "11", "12", "13", "24", "37", "45", "51", "54",
    "01", "21", "28", "47", "05", "22", "40", "48",
  ],
  West: [
    "04", "08", "16", "30", "32", "35", "49", "56", "02",
    "06", "15", "41", "53",
  ],
};

const topology = us as any;
const stateObject = topology.objects.states;
const stateGeometries = stateObject.geometries;

const allStateFeatures = topojson.feature(
  topology,
  stateObject
) as any;

export function getFips(geometry: any): string {
  return String(geometry.id).padStart(2, "0");
}

export const REGION_BY_FIPS = new globalThis.Map<string, CensusRegion>();

Object.entries(REGION_FIPS).forEach(([region, fipsCodes]) => {
  fipsCodes.forEach((fips) => {
    REGION_BY_FIPS.set(fips, region as CensusRegion);
  });
});

export type MapFeature = {
  type: "Feature";
  id?: string | number;
  properties: {
    name: string;
    fips?: string;
  };
  geometry: any;
};

export function getStateFeatures(
  region?: CensusRegion
): MapFeature[] {
  return allStateFeatures.features
    .filter((feature: any) => {
      if (!region) return true;

      const fips = getFips(feature);
      return REGION_FIPS[region].includes(fips);
    })
    .map((feature: any) => ({
      ...feature,
      properties: {
        ...feature.properties,
        name: feature.properties?.name ?? getFips(feature),
        fips: getFips(feature),
      },
    }));
}

export function getRegionFeatures(
  region?: CensusRegion
): MapFeature[] {
  const regions = region
    ? [region]
    : (Object.keys(REGION_FIPS) as CensusRegion[]);

  return regions.map((name) => ({
    type: "Feature",
    properties: { name },
    geometry: topojson.merge(
      topology,
      stateGeometries.filter((geometry: any) =>
        REGION_FIPS[name].includes(getFips(geometry))
      )
    ),
  }));
}

/**
 * Returns region exterior outlines and borders between regions.
 */
export function getRegionBoundaryFeatures(
  region?: CensusRegion
): MapFeature[] {
  const regions = region
    ? [region]
    : (Object.keys(REGION_FIPS) as CensusRegion[]);

  return regions.map((name) => ({
    type: "Feature",
    properties: { name },
    geometry: topojson.mesh(
      topology,
      stateObject,
      (a: any, b: any) => {
        const aRegion = REGION_BY_FIPS.get(getFips(a));
        const bRegion = b
          ? REGION_BY_FIPS.get(getFips(b))
          : undefined;

        if (a === b) return aRegion === name;

        return (
          aRegion !== bRegion &&
          (aRegion === name || bRegion === name)
        );
      }
    ),
  }));
}

/**
 * Returns state boundaries. For a regional map, only boundaries
 * between states within that region are included.
 */
export function getStateMesh(region?: CensusRegion) {
  return topojson.mesh(
    topology,
    stateObject,
    (a: any, b: any) => {
      if (a === b) return false;

      if (!region) return true;

      const aFips = getFips(a);
      const bFips = getFips(b);

      return (
        REGION_FIPS[region].includes(aFips) &&
        REGION_FIPS[region].includes(bFips)
      );
    }
  );
}
