"use client";

import StateMap from "@/app/components/map/state-map";
import { useElectionData } from "@/app/components/data/election-data-provider";

export default function MidwestElectionMap() {
  const { data, loading, error } = useElectionData();

  if (error) return <p role="alert">{error}</p>;

  if (loading || !data) {
    return <p role="status">Loading map…</p>;
  }

  const midwest = data.states.filter(
    (result) =>
      result.geography.type === "state" &&
      result.geography.region === "Midwest"
  );

  return (
    <StateMap
      region="Midwest"
      results={midwest}
      maxSize="20em"
      minSize="20em"
    />
  );
}