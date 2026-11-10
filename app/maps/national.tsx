"use client";

import { useEffect, useState } from "react";
import StateMap from "@/app/components/state-map";
import {
  fetchRegionElectionResults,
  type ElectionResult,
} from "@/app/lib/election-data";

const NATIONAL_ELECTION_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSNeiMncTFwe-g1VXNRRUrznZrgjEUH0c4aS_DYK9qUXc5oWLd-PiDdXVr0bZ6x8cilPM6sbELDE5et/pub?gid=0&single=true&output=csv";

export default function NationalElectionMap() {
  const [results, setResults] = useState<ElectionResult[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRegionElectionResults(NATIONAL_ELECTION_CSV_URL)
      .then(setResults)
      .catch((err: unknown) => {
        setError(
          err instanceof Error ? err.message : "Unable to load results."
        );
      });
  }, []);

  if (error) return <p role="alert">{error}</p>;
  if (!results) return <p role="status">Loading map…</p>;

  return <StateMap results={results} />;
}