"use client";

import StateMap from "@/app/components/map/state-map";
import { useElectionData } from "@/app/components/data/election-data-provider";

export default function SouthElectionMap() {
  const { data, loading, error } = useElectionData();

  if (error) return <p role="alert">{error}</p>;

  if (loading || !data) {
    return <p role="status">Loading map…</p>;
  }

  const south = data.states.filter(
    (result) =>
      result.geography.type === "state" &&
      result.geography.region === "South"
  );

  return (
    <StateMap
      region="South"
      results={south}
      maxSize="20em"
      minSize="20em"
    />
  );
}