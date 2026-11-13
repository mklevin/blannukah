"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  fetchElectionData,
  type ElectionData as ElectionResults,
} from "@/app/lib/election-data";

type ElectionDataContextValue = {
  data: ElectionResults | null;
  loading: boolean;
  error: string | null;
};

const ElectionDataContext =
  createContext<ElectionDataContextValue | null>(null);

const FETCH_TIMEOUT = 10_000;

export function ElectionDataProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [data, setData] = useState<ElectionResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    const timeoutId = setTimeout(() => {
      controller.abort(
        new Error("Request timed out. Please try again.")
      );
    }, FETCH_TIMEOUT);

    async function loadElectionData() {
      setLoading(true);
      setError(null);

      try {
        const results = await fetchElectionData(
          undefined,
          undefined,
          controller.signal
        );

        if (!cancelled) {
          setData(results);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            controller.signal.aborted
              ? "Request timed out. Please try again."
              : err instanceof Error
                ? err.message
                : "Unable to load election data."
          );
        }
      } finally {
        clearTimeout(timeoutId);

        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadElectionData();

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [retryCount]);

  const contextValue: ElectionDataContextValue = {
    data,
    loading,
    error,
  };

  return (
    <ElectionDataContext.Provider value={contextValue}>
      {loading ? (
        <div className="page-loading" role="status">
          <div className="page-loading__spinner" />
          <p>Loading...</p>
        </div>
      ) : error ? (
        <div className="page-loading" role="alert">
          <p>Hanukkah is canceled :(</p>
          <p className="subtext">(there was a problem loading this page)</p>
          <button
            type="button"
            className="page-loading__retry"
            onClick={() => setRetryCount((count) => count + 1)}
          >
            Retry
          </button>
        </div>
      ) : (
        children
      )}
    </ElectionDataContext.Provider>
  );
}

export function useElectionData() {
  const context = useContext(ElectionDataContext);

  if (!context) {
    throw new Error(
      "useElectionData must be used within an ElectionDataProvider."
    );
  }

  return context;
}