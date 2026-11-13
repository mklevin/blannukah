"use client";

import { useElectionData } from "@/app/components/data/election-data-provider";
import { fromZonedTime, formatInTimeZone } from "date-fns-tz";

type LiveProps = {
  isLive?: boolean;
};

function formatLastUpdated(timestamp: string): string {
  const match = timestamp.match(
    /^(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{2}):(\d{2})$/
  );

  if (!match) return timestamp;

  const [, month, day, year, hour, minute, second] = match;

  const easternDate = fromZonedTime(
    `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}T${hour.padStart(2, "0")}:${minute}:${second}`,
    "America/New_York"
  );

  const browserTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const formatted = formatInTimeZone(
    easternDate,
    browserTimeZone,
    "MMM dd h:mma"
  );

  const timezoneLabels: Record<string, string> = {
    "America/New_York": "ET",
    "America/Chicago": "CT",
    "America/Denver": "MT",
    "America/Los_Angeles": "PT",
  };

  const timezone =
    timezoneLabels[browserTimeZone] ??
    formatInTimeZone(easternDate, browserTimeZone, "zzz");

  return `${formatted.replace(/AM|PM/, (value) => value.toLowerCase())} ${timezone}`;
}

export default function LiveIndicator({
  isLive = true,
}: LiveProps) {
  const { data, loading, error } = useElectionData();

  if (loading || !data || error) {
    return null;
  }

  return (
    <div className="live-indicator">
      <span className="live-text">
        {isLive ? "LIVE" : "ENDED"}
      </span>
      <span className="last-updated">
        Last updated: {formatLastUpdated(data.lastUpdated)}
      </span>
    </div>
  );
}