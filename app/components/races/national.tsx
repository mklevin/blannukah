"use client";

import StateMap from "@/app/components/map/state-map";
import { useElectionData } from "@/app/components/data/election-data-provider";

export default function NationalElectionMap() {
  const { data, loading, error } = useElectionData();

  if (error) return <p role="alert">{error}</p>;

  if (loading || !data) {
    return <p role="status">Loading map…</p>;
  }

  return <StateMap results={data.regions} />;
}
