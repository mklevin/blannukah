"use client";

import StateMap from "@/app/components/map/state-map";
import { useElectionData } from "@/app/components/data/election-data-provider";

export default function NortheastElectionMap() {
  const { data, loading, error } = useElectionData();

  if (error) return <p role="alert">{error}</p>;

  if (loading || !data) {
    return <p role="status">Loading map…</p>;
  }

  const northeast = data.states.filter(
    (result) =>
      result.geography.type === "state" &&
      result.geography.region === "Northeast"
  );

  return (
    <StateMap
      region="Northeast"
      results={northeast}
      maxSize="20em"
      minSize="20em"
    />
  );
}