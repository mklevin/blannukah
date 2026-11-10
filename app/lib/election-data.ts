export type CensusRegion =
  | "Northeast"
  | "Midwest"
  | "South"
  | "West";

export type CandidateResult = {
  name: "Option A" | "Option B";
  percentage: number;
  total: number;
};

export type ElectionGeography =
  | {
      type: "region";
      id: CensusRegion;
      name: CensusRegion;
    }
  | {
      type: "state";
      fips: string;
      name?: string;
    };

export type ElectionResult = {
  geography: ElectionGeography;
  value: number;
  lean: string;
  coolName: string;
  candidates: [CandidateResult, CandidateResult];
};

const EXPECTED_REGIONS: CensusRegion[] = [
  "Northeast",
  "Midwest",
  "South",
  "West",
];

// Valid state and DC FIPS codes. Territories are intentionally excluded.
const VALID_STATE_FIPS = new Set([
  "01", "02", "04", "05", "06", "08", "09", "10", "11",
  "12", "13", "15", "16", "17", "18", "19", "20", "21",
  "22", "23", "24", "25", "26", "27", "28", "29", "30",
  "31", "32", "33", "34", "35", "36", "37", "38", "39",
  "40", "41", "42", "44", "45", "46", "47", "48", "49",
  "50", "51", "53", "54", "55", "56",
]);

function parseCSV(csv: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < csv.length; i++) {
    const char = csv[i];

    if (inQuotes) {
      if (char === '"') {
        if (csv[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      row.push(field.trim());
      field = "";
    } else if (char === "\n" || char === "\r") {
      if (char === "\r" && csv[i + 1] === "\n") {
        i++;
      }

      row.push(field.trim());
      field = "";

      if (row.some((value) => value !== "")) {
        rows.push(row);
      }

      row = [];
    } else {
      field += char;
    }
  }

  row.push(field.trim());

  if (row.some((value) => value !== "")) {
    rows.push(row);
  }

  return rows;
}

function parseNumber(
  value: string | undefined,
  column: string,
  geography: string
): number {
  if (value === undefined || value.trim() === "") {
    throw new Error(`Missing ${column} value for ${geography}.`);
  }

  const number = Number(value);

  if (!Number.isFinite(number)) {
    throw new Error(
      `Invalid ${column} value for ${geography}: ${value}`
    );
  }

  return number;
}

function parseCandidates(
  row: string[],
  getValue: (row: string[], column: string) => string,
  geography: string
): [CandidateResult, CandidateResult] {
  const aShare = parseNumber(
    getValue(row, "A_SHARE"),
    "A_SHARE",
    geography
  );

  const bShare = parseNumber(
    getValue(row, "B_SHARE"),
    "B_SHARE",
    geography
  );

  const aTotal = parseNumber(
    getValue(row, "A_TOTAL"),
    "A_TOTAL",
    geography
  );

  const bTotal = parseNumber(
    getValue(row, "B_TOTAL"),
    "B_TOTAL",
    geography
  );

  if (
    aShare < 0 ||
    aShare > 100 ||
    bShare < 0 ||
    bShare > 100
  ) {
    throw new Error(`Invalid percentage values for ${geography}.`);
  }

  if (aTotal < 0 || bTotal < 0) {
    throw new Error(`Invalid vote totals for ${geography}.`);
  }

  return [
    {
      name: "Option A",
      percentage: aShare,
      total: aTotal,
    },
    {
      name: "Option B",
      percentage: bShare,
      total: bTotal,
    },
  ];
}

function createColumnGetter(headers: string[]) {
  const columnIndex = new globalThis.Map(
    headers.map((header, index) => [header, index])
  );

  const requiredColumns = [
    "VALUE",
    "LEAN",
    "COOL_NAME",
    "A_SHARE",
    "B_SHARE",
    "A_TOTAL",
    "B_TOTAL",
  ];

  for (const column of requiredColumns) {
    if (!columnIndex.has(column)) {
      throw new Error(
        `Missing required spreadsheet column: ${column}`
      );
    }
  }

  return {
    has: (column: string) => columnIndex.has(column),

    get: (row: string[], column: string): string => {
      const index = columnIndex.get(column);
      return index === undefined ? "" : (row[index] ?? "").trim();
    },
  };
}

async function fetchCSV(url: string): Promise<string[][]> {
  const response = await fetch(url, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(
      `Unable to load election data (${response.status}).`
    );
  }

  const rows = parseCSV(await response.text());

  if (rows.length < 2) {
    throw new Error("The election spreadsheet contains no data.");
  }

  return rows;
}

function createResult(
  row: string[],
  getValue: (row: string[], column: string) => string,
  geography: ElectionGeography
): ElectionResult {
  const label =
    geography.type === "region"
      ? geography.name
      : geography.name ?? geography.fips;

  return {
    geography,
    value: parseNumber(
      getValue(row, "VALUE"),
      "VALUE",
      label
    ),
    lean: getValue(row, "LEAN"),
    coolName: getValue(row, "COOL_NAME"),
    candidates: parseCandidates(row, getValue, label),
  };
}

/**
 * Loads a CSV containing one result per Census region.
 *
 * Required geographic column: CENSUS_REG_NAME
 */
export async function fetchRegionElectionResults(
  csvUrl: string
): Promise<ElectionResult[]> {
  const rows = await fetchCSV(csvUrl);
  const headers = rows[0].map((header) => header.trim());
  const columns = createColumnGetter(headers);

  if (!headers.includes("CENSUS_REG_NAME")) {
    throw new Error(
      "Missing required spreadsheet column: CENSUS_REG_NAME"
    );
  }

  const results: ElectionResult[] = [];
  const seen = new Set<CensusRegion>();

  for (const row of rows.slice(1)) {
    const region = columns.get(row, "CENSUS_REG_NAME");

    if (!region) continue;

    if (!EXPECTED_REGIONS.includes(region as CensusRegion)) {
      throw new Error(`Unknown Census region: ${region}`);
    }

    const regionId = region as CensusRegion;

    if (seen.has(regionId)) {
      throw new Error(`Duplicate spreadsheet entry for ${region}.`);
    }

    seen.add(regionId);

    results.push(
      createResult(row, columns.get, {
        type: "region",
        id: regionId,
        name: regionId,
      })
    );
  }

  const missing = EXPECTED_REGIONS.filter(
    (region) => !seen.has(region)
  );

  if (missing.length > 0) {
    throw new Error(`Missing region data: ${missing.join(", ")}`);
  }

  return results;
}

/**
 * Loads a CSV containing one result per state.
 *
 * Required geographic column: FIPS
 *
 * FIPS values are normalized to two digits.
 */
export async function fetchStateElectionResults(
  csvUrl: string
): Promise<ElectionResult[]> {
  const rows = await fetchCSV(csvUrl);
  const headers = rows[0].map((header) => header.trim());
  const columns = createColumnGetter(headers);

  if (!headers.includes("FIPS")) {
    throw new Error("Missing required spreadsheet column: FIPS");
  }

  const results: ElectionResult[] = [];
  const seen = new Set<string>();

  for (const row of rows.slice(1)) {
    const rawFips = columns.get(row, "FIPS");

    if (!rawFips) continue;

    if (!/^\d{1,2}$/.test(rawFips)) {
      throw new Error(`Invalid FIPS code: ${rawFips}`);
    }

    const fips = rawFips.padStart(2, "0");

    if (!VALID_STATE_FIPS.has(fips)) {
      throw new Error(`Unknown state FIPS code: ${fips}`);
    }

    if (seen.has(fips)) {
      throw new Error(`Duplicate spreadsheet entry for FIPS ${fips}.`);
    }

    seen.add(fips);

    results.push(
      createResult(row, columns.get, {
        type: "state",
        fips,
      })
    );
  }

  if (results.length === 0) {
    throw new Error("The state spreadsheet contains no state data.");
  }

  return results;
}
