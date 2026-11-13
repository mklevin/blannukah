"use client";

import StateMap from "@/app/components/map/state-map";
import { useElectionData } from "@/app/components/data/election-data-provider";

export default function WestElectionMap() {
  const { data, loading, error } = useElectionData();

  if (error) return <p role="alert">{error}</p>;

  if (loading || !data) {
    return <p role="status">Loading map…</p>;
  }

  const west = data.states.filter(
    (result) =>
      result.geography.type === "state" &&
      result.geography.region === "West"
  );

  return (
    <StateMap
      region="West"
      results={west}
      maxSize="20em"
      minSize="20em"
    />
  );
}