"use client";

import { useState } from "react";
import { apiGet, apiPost } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/config";

/**
 * Custom hook for Proposal/Approval operations (Kepala Desa only)
 */
export function useProposal() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Get all proposals/approvals
   */
  const getProposalList = async (params = {}) => {
    setLoading(true);
    setError(null);

    try {
      const queryString = new URLSearchParams(params).toString();
      const endpoint = queryString
        ? `${API_ENDPOINTS.PROPOSAL.LIST}?${queryString}`
        : API_ENDPOINTS.PROPOSAL.LIST;

      console.log("🔍 Fetching approvals from:", endpoint);

      const data = await apiGet(endpoint);

      console.log("✅ Approvals fetched successfully:", {
        data_length: data.data?.length || 0,
        total: data.total,
        current_page: data.current_page,
      });

      return data;
    } catch (err) {
      console.error("❌ Error fetching approvals:", err.message);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get single proposal by ID
   */
  const getProposalById = async (id) => {
    setLoading(true);
    setError(null);

    try {
      const endpoint = API_ENDPOINTS.PROPOSAL.SHOW(id);
      console.log("🔍 Fetching approval by ID:", endpoint);

      const data = await apiGet(endpoint);
      return data;
    } catch (err) {
      console.error("❌ Error fetching approval:", err.message);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Approve proposal
   */
  const approveProposal = async (id, note = "") => {
    setLoading(true);
    setError(null);

    try {
      const payload = note ? { note } : {};
      const endpoint = API_ENDPOINTS.PROPOSAL.APPROVE(id);

      console.log("🔍 Approving proposal:", endpoint);

      const data = await apiPost(endpoint, payload);

      console.log("✅ Proposal approved successfully");

      return data;
    } catch (err) {
      console.error("❌ Error approving proposal:", err.message);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Reject proposal
   */
  const rejectProposal = async (id, reason) => {
    setLoading(true);
    setError(null);

    try {
      const endpoint = API_ENDPOINTS.PROPOSAL.REJECT(id);

      console.log("🔍 Rejecting proposal:", endpoint);

      const data = await apiPost(endpoint, { reason });

      console.log("✅ Proposal rejected successfully");

      return data;
    } catch (err) {
      console.error("❌ Error rejecting proposal:", err.message);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    getProposalList,
    getProposalById,
    approveProposal,
    rejectProposal,
  };
}
