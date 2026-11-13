import Papa from "papaparse";

import {
  CENSUS_REGIONS,
  GEOGRAPHY_NICKNAMES,
  STATE_FIPS,
  type CensusRegion,
} from "@/app/lib/constants/geography";

// -----------------------------------------------------------------------------
// Spreadsheet URLs
// -----------------------------------------------------------------------------

const ELECTION_OPTIONS_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSNeiMncTFwe-g1VXNRRUrznZrgjEUH0c4aS_DYK9qUXc5oWLd-PiDdXVr0bZ6x8cilPM6sbELDE5et/pub?gid=859553188&single=true&output=csv";

const ELECTION_RESULTS_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSNeiMncTFwe-g1VXNRRUrznZrgjEUH0c4aS_DYK9qUXc5oWLd-PiDdXVr0bZ6x8cilPM6sbELDE5et/pub?gid=2008483097&single=true&output=csv";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type ElectionRace = "National" | CensusRegion;

export type CandidateResult = {
  name: string;
  percentage: number;
  total: number;
};

export type CandidateNames = {
  optionA: string;
  optionB: string;
};

export type ElectionOptionNames = Record<
  ElectionRace,
  CandidateNames
>;

export type ElectionGeography =
  | {
      type: "region";
      id: CensusRegion;
      name: CensusRegion;
    }
  | {
      type: "state";
      fips: string;
      name: string;
      region: CensusRegion;
    };

export type ElectionResult = {
  geography: ElectionGeography;
  coolName: string;
  candidates: [CandidateResult, CandidateResult];
};

export type NationalElectionSummary = {
  candidates: [CandidateResult, CandidateResult];
};

export type ElectionData = {
  states: ElectionResult[];
  regions: ElectionResult[];
  national: NationalElectionSummary;
  lastUpdated: string;
};

// -----------------------------------------------------------------------------
// CSV parsing
// -----------------------------------------------------------------------------

type CSVRow = Record<string, string>;

function parseCSV(csv: string): CSVRow[] {
  const result = Papa.parse<CSVRow>(csv, {
    header: true,
    skipEmptyLines: "greedy",
    dynamicTyping: false,
    transformHeader: (header) =>
      header.replace(/^\uFEFF/, "").trim().toLowerCase(),
  });

  if (result.errors.length > 0) {
    const error = result.errors[0];

    throw new Error(
      `Unable to parse election CSV: ${error.message}`
    );
  }

  if (result.meta.renamedHeaders) {
    throw new Error(
      "The election CSV contains duplicate column headers."
    );
  }

  if (!result.meta.fields || result.meta.fields.length === 0) {
    throw new Error("The election CSV is missing its header row.");
  }

  if (result.data.length === 0) {
    throw new Error("The election CSV contains no data.");
  }

  // Papa Parse stores fields beyond the header row in __parsed_extra.
  // Reject those rows rather than silently ignoring unexpected columns.
  for (const row of result.data) {
    if ("__parsed_extra" in row) {
      throw new Error(
        "The election CSV contains a row with more columns than its header."
      );
    }
  }

  return result.data;
}

function validateColumns(
  rows: CSVRow[],
  requiredColumns: string[]
): void {
  if (rows.length === 0) {
    throw new Error("The election CSV contains no data.");
  }

  const availableColumns = Object.keys(rows[0]);

  for (const column of requiredColumns) {
    if (!availableColumns.includes(column)) {
      throw new Error(
        `Missing required spreadsheet column: ${column}`
      );
    }
  }
}

async function fetchCSV(
  url: string,
  signal?: AbortSignal
): Promise<CSVRow[]> {
  const response = await fetch(url, {
    cache: "no-store",
    signal,
  });

  if (!response.ok) {
    throw new Error(
      `Unable to load election data (${response.status}).`
    );
  }

  return parseCSV(await response.text());
}

// -----------------------------------------------------------------------------
// General helpers
// -----------------------------------------------------------------------------

function parseVotes(
  value: string | undefined,
  candidate: string,
  geography: string
): number {
  if (value === undefined || value.trim() === "") {
    throw new Error(
      `Missing vote total for ${candidate} in ${geography}.`
    );
  }

  const votes = Number(value);

  if (!Number.isSafeInteger(votes) || votes < 0) {
    throw new Error(
      `Invalid vote total for ${candidate} in ${geography}: ${value}`
    );
  }

  return votes;
}

function parseLatestTimestamp(rows: CSVRow[]): string {
  const timestamps = rows
    .map((row) => row.latest_timestamp?.trim())
    .filter((value): value is string => Boolean(value));

  if (timestamps.length === 0) {
    throw new Error(
      "The results spreadsheet contains no populated latest_timestamp values."
    );
  }

  const parsedTimestamps = timestamps.map((timestamp) => {
    // Google Sheets format: M/D/YYYY H:MM:SS
    const match = timestamp.match(
      /^(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{2}):(\d{2})$/
    );

    if (!match) {
      throw new Error(
        `Invalid latest_timestamp in results spreadsheet: ${timestamp}`
      );
    }

    const [, month, day, year, hour, minute, second] = match;

    const date = new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hour),
      Number(minute),
      Number(second)
    );

    // Validate the date components to catch invalid dates.
    if (
      date.getFullYear() !== Number(year) ||
      date.getMonth() !== Number(month) - 1 ||
      date.getDate() !== Number(day) ||
      date.getHours() !== Number(hour) ||
      date.getMinutes() !== Number(minute) ||
      date.getSeconds() !== Number(second)
    ) {
      throw new Error(
        `Invalid latest_timestamp in results spreadsheet: ${timestamp}`
      );
    }

    return { timestamp, time: date.getTime() };
  });

  return parsedTimestamps.reduce((latest, current) =>
    current.time > latest.time ? current : latest
  ).timestamp;
}

function createCandidateResults(
  optionNames: CandidateNames,
  optionATotal: number,
  optionBTotal: number
): [CandidateResult, CandidateResult] {
  const totalVotes = optionATotal + optionBTotal;

  return [
    {
      name: optionNames.optionA,
      total: optionATotal,
      percentage:
        totalVotes === 0 ? 0 : (optionATotal / totalVotes) * 100,
    },
    {
      name: optionNames.optionB,
      total: optionBTotal,
      percentage:
        totalVotes === 0 ? 0 : (optionBTotal / totalVotes) * 100,
    },
  ];
}

function getOptionNames(
  optionNames: ElectionOptionNames,
  race: ElectionRace
): CandidateNames {
  const names = optionNames[race];

  if (!names) {
    throw new Error(`Missing option names for ${race}.`);
  }

  return names;
}

function getRace(value: string): ElectionRace {
  if (value === "National") {
    return value;
  }

  if (CENSUS_REGIONS.includes(value as CensusRegion)) {
    return value as CensusRegion;
  }

  throw new Error(`Unknown election: ${value}`);
}

// Build the reverse lookup used by National results, whose geography IDs
// are the nicknames rather than the canonical Census region names.
const REGION_BY_NICKNAME = Object.fromEntries(
  Object.entries(GEOGRAPHY_NICKNAMES).map(([region, nickname]) => [
    nickname,
    region,
  ])
) as Record<string, CensusRegion>;

// -----------------------------------------------------------------------------
// Candidate names
// -----------------------------------------------------------------------------

/**
 * Parses candidate names from the options spreadsheet.
 *
 * Required columns:
 * election, option_a, option_b
 */
function parseElectionOptionNames(
  rows: CSVRow[]
): ElectionOptionNames {
  validateColumns(rows, [
    "election",
    "option_a",
    "option_b",
  ]);

  const options: Partial<ElectionOptionNames> = {};

  for (const row of rows) {
    const raceValue = row.election?.trim();
    const optionA = row.option_a?.trim();
    const optionB = row.option_b?.trim();

    if (!raceValue) continue;

    const race = getRace(raceValue);

    if (!optionA || !optionB) {
      throw new Error(
        `Missing candidate names for ${race}.`
      );
    }

    if (options[race]) {
      throw new Error(
        `Duplicate options spreadsheet entry for ${race}.`
      );
    }

    options[race] = {
      optionA,
      optionB,
    };
  }

  const missingRaces = [
    "National",
    ...CENSUS_REGIONS,
  ].filter((race) => !options[race as ElectionRace]);

  if (missingRaces.length > 0) {
    throw new Error(
      `Missing candidate names for: ${missingRaces.join(", ")}.`
    );
  }

  return options as ElectionOptionNames;
}

/**
 * Loads candidate names from the options spreadsheet.
 */
export async function fetchElectionOptionNames(
  csvUrl: string = ELECTION_OPTIONS_CSV_URL,
  signal?: AbortSignal
): Promise<ElectionOptionNames> {
  const rows = await fetchCSV(csvUrl, signal);

  return parseElectionOptionNames(rows);
}

// -----------------------------------------------------------------------------
// Election results
// -----------------------------------------------------------------------------

type GeographyTotals = {
  geography: ElectionGeography;
  coolName: string;
  optionATotal: number;
  optionBTotal: number;
};

/**
 * Parses and transforms the normalized results spreadsheet.
 *
 * Required columns:
 * election, geography_type, geography_id, candidate, votes, latest_timestamp
 *
 * National rows use Census-region nicknames as geography IDs.
 * Regional-election rows use state names as geography IDs.
 */
function parseElectionResults(
  rows: CSVRow[],
  optionNames: ElectionOptionNames
): ElectionData {
  validateColumns(rows, [
    "election",
    "geography_type",
    "geography_id",
    "candidate",
    "votes",
    "latest_timestamp",
  ]);

  const lastUpdated = parseLatestTimestamp(rows);

  const geographyTotals = new Map<
    string,
    GeographyTotals
  >();

  const seenCandidates = new Set<string>();

  for (const row of rows) {
    const raceValue = row.election?.trim();
    const geographyType = row.geography_type?.trim().toLowerCase();
    const geographyId = row.geography_id?.trim();
    const candidate = row.candidate?.trim();

    if (!raceValue || !geographyId || !candidate) {
      throw new Error(
        "The results spreadsheet contains a row with missing required values."
      );
    }

    const race = getRace(raceValue);
    const names = getOptionNames(optionNames, race);

    let geography: ElectionGeography;
    let coolName: string;

    if (race === "National") {
      if (geographyType !== "region") {
        throw new Error(
          `National results must use region geography: ${geographyId}.`
        );
      }

      const region = REGION_BY_NICKNAME[geographyId];

      if (!region) {
        throw new Error(
          `Unknown National geography nickname: ${geographyId}.`
        );
      }

      geography = {
        type: "region",
        id: region,
        name: region,
      };

      coolName = geographyId;
    } else {
      if (geographyType !== "state") {
        throw new Error(
          `${race} results must use state geography: ${geographyId}.`
        );
      }

      const fips = STATE_FIPS[geographyId];

      if (!fips) {
        throw new Error(
          `Unknown state in results spreadsheet: ${geographyId}.`
        );
      }

      geography = {
        type: "state",
        fips,
        name: geographyId,
        region: race,
      };

      coolName = GEOGRAPHY_NICKNAMES[race];
    }

    let candidateIndex: 0 | 1;

    if (candidate === names.optionA) {
      candidateIndex = 0;
    } else if (candidate === names.optionB) {
      candidateIndex = 1;
    } else {
      throw new Error(
        `Unknown candidate "${candidate}" for ${race}.`
      );
    }

    const geographyKey =
      `${race}:${geographyType}:${geographyId}`;

    const candidateKey = `${geographyKey}:${candidate}`;

    if (seenCandidates.has(candidateKey)) {
      throw new Error(
        `Duplicate result for ${candidate} in ${geographyId} (${race}).`
      );
    }

    seenCandidates.add(candidateKey);

    const votes = parseVotes(
      row.votes,
      candidate,
      geographyId
    );

    let totals = geographyTotals.get(geographyKey);

    if (!totals) {
      totals = {
        geography,
        coolName,
        optionATotal: 0,
        optionBTotal: 0,
      };

      geographyTotals.set(geographyKey, totals);
    }

    if (candidateIndex === 0) {
      totals.optionATotal = votes;
    } else {
      totals.optionBTotal = votes;
    }
  }

  // Every geography must have a row for both candidates, including
  // candidates who received zero votes.
  const resultsByRace = new Map<
    ElectionRace,
    ElectionResult[]
  >();

  for (const [key, totals] of geographyTotals) {
    const race = key.split(":")[0] as ElectionRace;
    const names = getOptionNames(optionNames, race);

    const geographyKey =
      key.split(":").slice(1).join(":");

    const candidateNames = [
      names.optionA,
      names.optionB,
    ];

    for (const candidate of candidateNames) {
      if (!seenCandidates.has(`${race}:${geographyKey}:${candidate}`)) {
        throw new Error(
          `Missing result for ${candidate} in ${geographyKey} (${race}).`
        );
      }
    }

    const result: ElectionResult = {
      geography: totals.geography,
      coolName: totals.coolName,
      candidates: createCandidateResults(
        names,
        totals.optionATotal,
        totals.optionBTotal
      ),
    };

    const raceResults = resultsByRace.get(race) ?? [];

    raceResults.push(result);
    resultsByRace.set(race, raceResults);
  }

  const regions = resultsByRace.get("National") ?? [];

  if (regions.length !== CENSUS_REGIONS.length) {
    throw new Error(
      `Expected ${CENSUS_REGIONS.length} National region results, but found ${regions.length}.`
    );
  }

  const missingRegions = CENSUS_REGIONS.filter(
    (region) =>
      !regions.some(
        (result) =>
          result.geography.type === "region" &&
          result.geography.id === region
      )
  );

  if (missingRegions.length > 0) {
    throw new Error(
      `Missing National results for: ${missingRegions.join(", ")}.`
    );
  }

  const states = CENSUS_REGIONS.flatMap(
    (region) => resultsByRace.get(region) ?? []
  );

  if (states.length === 0) {
    throw new Error("The results spreadsheet contains no state results.");
  }

  return {
    states,
    regions,
    national: summarizeElectionResults(
      regions,
      getOptionNames(optionNames, "National")
    ),
    lastUpdated,
  };
}

/**
 * Loads and transforms the normalized results spreadsheet.
 */
export async function fetchElectionResults(
  csvUrl: string,
  optionNames: ElectionOptionNames,
  signal?: AbortSignal
): Promise<ElectionData> {
  const rows = await fetchCSV(csvUrl, signal);

  return parseElectionResults(rows, optionNames);
}

// -----------------------------------------------------------------------------
// Summaries
// -----------------------------------------------------------------------------

export function summarizeElectionResults(
  results: ElectionResult[],
  names: CandidateNames
): NationalElectionSummary {
  const optionATotal = results.reduce(
    (sum, result) => sum + result.candidates[0].total,
    0
  );

  const optionBTotal = results.reduce(
    (sum, result) => sum + result.candidates[1].total,
    0
  );

  return {
    candidates: createCandidateResults(
      names,
      optionATotal,
      optionBTotal
    ),
  };
}

// -----------------------------------------------------------------------------
// Main data loader
// -----------------------------------------------------------------------------

export async function fetchElectionData(
  optionsCsvUrl: string = ELECTION_OPTIONS_CSV_URL,
  resultsCsvUrl: string = ELECTION_RESULTS_CSV_URL,
  signal?: AbortSignal
): Promise<ElectionData> {
  // Use an internal controller so a failure in either request also
  // cancels the other request.
  const controller = new AbortController();

  const abortFromExternalSignal = () => {
    controller.abort(signal?.reason);
  };

  if (signal?.aborted) {
    abortFromExternalSignal();
  } else {
    signal?.addEventListener("abort", abortFromExternalSignal, {
      once: true,
    });
  }

  try {
    // Both CSVs are independent network requests, so fetch them together.
    const [optionsRows, resultsRows] = await Promise.all([
      fetchCSV(optionsCsvUrl, controller.signal),
      fetchCSV(resultsCsvUrl, controller.signal),
    ]);

    // The results parser needs the candidate names, so parsing happens
    // after both requests have completed.
    const optionNames = parseElectionOptionNames(optionsRows);

    return parseElectionResults(resultsRows, optionNames);
  } catch (error) {
    // If either request or parser fails, stop any remaining work.
    controller.abort(error);

    throw error;
  } finally {
    signal?.removeEventListener(
      "abort",
      abortFromExternalSignal
    );
  }
}