"use client";

import { useEffect, useState } from "react";
import StateMap from "@/app/components/state-map";
import {
  fetchStateElectionResults,
  type ElectionResult,
} from "@/app/lib/election-data";

const MIDWEST_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSNeiMncTFwe-g1VXNRRUrznZrgjEUH0c4aS_DYK9qUXc5oWLd-PiDdXVr0bZ6x8cilPM6sbELDE5et/pub?gid=1007396965&single=true&output=csv";

export default function MidwestElectionMap() {
  const [results, setResults] = useState<ElectionResult[] | null>(null);

  useEffect(() => {
    fetchStateElectionResults(MIDWEST_CSV_URL).then(setResults);
  }, []);

  if (!results) return <p role="status">Loading map…</p>;

  return (
    <StateMap
      region="Midwest"
      results={results}
      maxSize="20em"
      minSize="20em"
    />
  );
}