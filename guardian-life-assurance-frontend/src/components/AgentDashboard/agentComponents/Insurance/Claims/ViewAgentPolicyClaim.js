import React, { useState, useEffect } from "react";
import { getAgentPolicyClaims } from "../../../../../services/agentServices";
import Table from "../../../../../sharedComponents/Table/Table";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  showToastError,
  showToastSuccess,
} from "../../../../../utils/toast/Toast";
import { sanitizeAgentPolicyClaimData } from "../../../../../utils/helpers/SanitizeData";
import "../../../../Policies/ViewClaims.css";
import { verifyAgent } from "../../../../../services/authServices";

const ViewAgentPolicyClaims = () => {
  const [claims, setClaims] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [error, setError] = useState(null);

  const page = parseInt(searchParams.get("page")) || 0;
  const size = parseInt(searchParams.get("size")) || 5;
  const sortBy = searchParams.get("sortBy") || "claimId";
  const direction = searchParams.get("direction") || "asc";

  const [status, setStatus] = useState(searchParams.get("status") || "");
  const [policyNo, setPolicyNo] = useState(searchParams.get("policyNo") || "");
  const [sortField, setSortField] = useState(sortBy);
  const [sortDirection, setSortDirection] = useState(direction);

  const keysToBeIncluded = [
    "claimId",
    "policyNo",
    "claimAmount",
    "claimReason",
    "claimDate",
    "status",
    "approvalDate",
    "rejectionDate",
  ];

  const [isAgent, setIsAgent] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const verifyAgentAndNavigate = async () => {
      try {
        const response = await verifyAgent();
        if (!response) {
          navigate("/");
          return;
        } else {
          setIsAgent(true);
        }
      } catch (error) {
        navigate("/");
      }
    };
    verifyAgentAndNavigate();
  }, []);

  const fetchAgentClaims = async () => {
    try {
      const params = {
        page,
        size,
        sortBy: sortField,
        direction: sortDirection,
        status,
        policyNo,
      };

      const response = await getAgentPolicyClaims(params);
      const sanitizedClaims = sanitizeAgentPolicyClaimData(
        response,
        keysToBeIncluded
      );
      setClaims(sanitizedClaims);
    } catch (error) {
      setError("Failed to fetch claims");
      showToastError("Failed to fetch claims");
    }
  };

  useEffect(() => {
    if(!isAgent) {
      return
    };
    fetchAgentClaims();
  }, [page, size, sortBy, direction, status, policyNo,isAgent]);

  const handleSearch = () => {
    const currentParams = Object.fromEntries(searchParams);
    currentParams.sortBy = sortField;
    currentParams.direction = sortDirection;
    currentParams.page = page.toString();
    currentParams.size = size.toString();
    currentParams.status = status;
    currentParams.policyNo = policyNo;
    setSearchParams(currentParams);
  };

  const handleReset = () => {
    setStatus("");
    setPolicyNo("");
    setSortField("claimId");
    setSortDirection("asc");
    setSearchParams({});
  };

  return (
    <>
      {isAgent && (
        <div className="view-claims-container">
          <h1>View Agent Policy Claims</h1>

          <div className="view-claims-filters">
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">Select Status</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
            <input
              type="number"
              placeholder="Policy Number"
              value={policyNo}
              onChange={(e) => setPolicyNo(e.target.value)}
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

export default ViewAgentPolicyClaims;
