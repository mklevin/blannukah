"use client";

import { useEffect, useState } from "react";
import StateMap from "@/app/components/state-map";
import {
  fetchStateElectionResults,
  type ElectionResult,
} from "@/app/lib/election-data";

const NORTHEAST_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSNeiMncTFwe-g1VXNRRUrznZrgjEUH0c4aS_DYK9qUXc5oWLd-PiDdXVr0bZ6x8cilPM6sbELDE5et/pub?gid=962697077&single=true&output=csv";

export default function NortheastElectionMap() {
  const [results, setResults] = useState<ElectionResult[] | null>(null);

  useEffect(() => {
    fetchStateElectionResults(NORTHEAST_CSV_URL).then(setResults);
  }, []);

  if (!results) return <p role="status">Loading map…</p>;

  return (
    <StateMap
      region="Northeast"
      results={results}
      maxSize="20em"
      minSize="20em"
    />
  );
}