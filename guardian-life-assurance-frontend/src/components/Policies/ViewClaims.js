import React, { useState, useEffect, useMemo, useCallback } from "react";
import { getAllClaims, approveClaim, rejectClaim } from "../../services/gaurdianLifeAssuranceServices";
import Table from "../../sharedComponents/Table/Table";
import { useSearchParams, useNavigate } from "react-router-dom";
import { showToastError, showToastSuccess } from "../../utils/toast/Toast";
import { sanitizeClaimData } from "../../utils/helpers/SanitizeData";
import './ViewClaims.css';
import { verifyAdmin, verifyEmployee } from "../../services/authServices";

const ViewClaims = () => {
  const navigate = useNavigate();
  const [claims, setClaims] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isVerified, setIsVerified] = useState(false);

  const page = useMemo(() => parseInt(searchParams.get("page")) || 0, [searchParams]);
  const size = useMemo(() => parseInt(searchParams.get("size")) || 5, [searchParams]);
  const sortBy = useMemo(() => searchParams.get("sortBy") || "claimId", [searchParams]);
  const direction = useMemo(() => searchParams.get("direction") || "asc", [searchParams]);

  const [status, setStatus] = useState(searchParams.get("status") || "");
  const [customerId, setCustomerId] = useState(searchParams.get("customerId") || "");
  const [policyNo, setPolicyNo] = useState(searchParams.get("policyNo") || "");
  const [sortField, setSortField] = useState(sortBy);
  const [sortDirection, setSortDirection] = useState(direction);

  const keysToBeIncluded = useMemo(() => [
    "claimId", "policyNo", "claimAmount", "claimReason",
    "claimDate", "status", "approvalDate", "rejectionDate"
  ], []);

  const fetchClaims = useCallback(async () => {
    if (!isVerified) return;
    try {
      const params = {
        page,
        size,
        sortBy: sortField,
        direction: sortDirection,
        status,
        customerId,
        policyNo,
      };

      const response = await getAllClaims(params);
      const sanitizedClaims = sanitizeClaimData(response, keysToBeIncluded, handleApprove, handleReject);
      setClaims(sanitizedClaims);
    } catch {
      showToastError("Failed to fetch claims");
    }
  }, [isVerified, page, size, sortField, sortDirection, status, customerId, policyNo, keysToBeIncluded]);



  useEffect(() => {
    const fetchRoleAndVerify = async () => {
      const role = localStorage.getItem("role");
      let verified = false;
      if (role === "admin") {
        verified = await verifyAdmin();
      } else if (role === "employee") {
        verified = await verifyEmployee();
      }
      setIsVerified(verified);
      if (!verified) {
        navigate("/login");
      }
    };
    fetchRoleAndVerify();
  }, [navigate]);

  useEffect(() => {
    fetchClaims();
  }, [fetchClaims]);

  const handleSearch = useCallback(() => {
    const currentParams = {
      page: page.toString(),
      size: size.toString(),
      sortBy: sortField,
      direction: sortDirection,
    };

    if (status) currentParams.status = status;
    if (customerId) currentParams.customerId = customerId;
    if (policyNo) currentParams.policyNo = policyNo;

    setSearchParams(currentParams);
  }, [searchParams]);

  const handleReset = useCallback(() => {
    setStatus("");
    setCustomerId("");
    setPolicyNo("");
    setSortField("claimId");
    setSortDirection("asc");
    setSearchParams({});
  }, [setSearchParams]);

  const handleApprove = useCallback(async (claimId) => {
    try {
      await approveClaim(claimId);
      showToastSuccess("Claim approved successfully");
      fetchClaims();
    } catch {
      showToastError("Failed to approve claim");
    }
  }, [fetchClaims]);

  const handleReject = useCallback(async (claimId) => {
    try {
      await rejectClaim(claimId);
      showToastSuccess("Claim rejected successfully");
      fetchClaims();
    } catch {
      showToastError("Failed to reject claim");
    }
  }, [fetchClaims]);

  return (
    <>
      {isVerified && (
        <div className="view-claims-container">
          <h1>View Claims</h1>

          <div className="view-claims-filters">
            <select
              value={status}
              onChange={(e) => {
                const value = e.target.value;
                setStatus(value);
                const currentParams = new URLSearchParams(searchParams);
                if (value) {
                  currentParams.set("status", value);
                } else {
                  currentParams.delete("status");
                }
                setSearchParams(currentParams);
              }}
            >
              <option value="">Select Status</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
            <input
              type="number"
              placeholder="Customer ID"
              value={customerId}
              onChange={(e) => {
                const value = e.target.value;
                setCustomerId(value);
                const currentParams = new URLSearchParams(searchParams);
                if (value) {
                  currentParams.set("customerId", value);
                } else {
                  currentParams.delete("customerId");
                }
                setSearchParams(currentParams);
              }}
            />
            <input
              type="number"
              placeholder="Policy Number"
              value={policyNo}
              onChange={(e) => {
                const value = e.target.value;
                setPolicyNo(value);
                const currentParams = new URLSearchParams(searchParams);
                if (value) {
                  currentParams.set("policyNo", value);
                } else {
                  currentParams.delete("policyNo");
                }
                setSearchParams(currentParams);
              }}
            />
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value)}
            >
              <option value="claimId">Claim ID</option>
              <option value="claimAmount">Claim Amount</option>
              <option value="policyNo">Policy Number</option>
            </select>
            <select
              value={sortDirection}
              onChange={(e) => setSortDirection(e.target.value)}
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
            <button onClick={handleSearch}>Search</button>
            <button onClick={handleReset}>Reset</button>
          </div>

          <Table
            data={claims}
            searchParams={searchParams}
            setSearchParams={setSearchParams}
          />
        </div>
      )}
    </>
  );
};

export default ViewClaims;
