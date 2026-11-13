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

export function ElectionDataProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [data, setData] = useState<ElectionResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadElectionData() {
      try {
        const results = await fetchElectionData();

        if (!cancelled) {
          setData(results);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load election data."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadElectionData();

    return () => {
      cancelled = true;
    };
  }, []);

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
          <p>Unable to load election results.</p>
          <p>{error}</p>
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
