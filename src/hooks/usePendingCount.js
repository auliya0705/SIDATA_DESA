"use client";

import { useState, useEffect } from "react";
import { useProposal } from "./useProposal";

/**
 * Custom hook to get pending approvals count
 * Use this for navbar badge
 */
export function usePendingCount() {
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { getProposalList } = useProposal();

  const fetchPendingCount = async () => {
    try {
      setLoading(true);

      // Fetch only pending items
      const response = await getProposalList({
        status: "pending",
        per_page: 9999, // Get all pending items
      });

      if (response.data) {
        setPendingCount(response.data.length);
      } else {
        setPendingCount(0);
      }
    } catch (err) {
      console.error("Error fetching pending count:", err);
      // Don't throw, just set to 0
      setPendingCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch if we're in browser and backend is accessible
    if (typeof window === "undefined") return;

    // Try to fetch, but don't crash if fails
    fetchPendingCount().catch(() => {
      console.warn("usePendingCount: Backend not accessible, using count = 0");
    });

    // Refresh every 30 seconds (only if backend is accessible)
    const interval = setInterval(() => {
      fetchPendingCount().catch(() => {
        // Silently fail
      });
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return { pendingCount, loading, refresh: fetchPendingCount };
}
