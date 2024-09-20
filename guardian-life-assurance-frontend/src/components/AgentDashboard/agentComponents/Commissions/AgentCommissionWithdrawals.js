import React, { useState, useEffect, useCallback } from "react";
import { getAgentCommissionWithdrawals } from "../../../../services/agentServices";
import { getWithdrawalStatus } from "../../../../services/gaurdianLifeAssuranceServices";
import Table from "../../../../sharedComponents/Table/Table";
import { useNavigate, useSearchParams } from "react-router-dom";
import { debounce } from "../../../../utils/helpers/Debounce";
import { showToastError, showToastSuccess } from "../../../../utils/toast/Toast";
import "../../../Commissions/CommissionWithdrawals.css";
import { sanitizeAgentWithdrawalData } from "../../../../utils/helpers/SanitizeData";
import { verifyAgent } from "../../../../services/authServices";


const AgentCommissionWithdrawals = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get("page")) || 0;
  const size = parseInt(searchParams.get("size")) || 10;
  const sortBy = searchParams.get("sortBy") || "withdrawalRequestId";
  const direction = searchParams.get("direction") || "ASC";
  const [status, setStatus] = useState(searchParams.get("status") || "");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const navigate=useNavigate();
  const [isAgent, setIsAgent] = useState(false);
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

  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const response = await getWithdrawalStatus();
        setStatuses(response);
      } catch (error) {
        console.error("Failed to fetch withdrawal statuses:", error);
      }
    };
    fetchStatuses();
  }, []);

  const handleFilterChange = (key, value) => {
    switch (key) {
      case "status":
        setStatus(value);
        setSearchParams((prevParams) => {
          const newParams = new URLSearchParams(prevParams);
          if (value) {
            newParams.set(key, value);
          } else {
            newParams.delete(key);
          }
          return newParams;
        });
        break;
      default:
        break;
    }
  };



  const handleSearch = () => {

    const params = {
      page,
      size,
      sortBy,
      direction,
      status,
      fromDate,
      toDate,
    };
    setSearchParams(params);
    debouncedFetchWithdrawals(params);
  };

  const handleReset = () => {
    setStatus("");
    setFromDate("");
    setToDate("");
    setSearchParams(new URLSearchParams());
    fetchWithdrawals({ page: 0, size: 10, sortBy: "withdrawalRequestId", direction: "ASC" });
  };

  const fetchWithdrawals = async (params) => {
    try {
      if(!isAgent){
        return;
      }
      const response = await getAgentCommissionWithdrawals(params);
      if (response) {
        const sanitizedWithdrawals = sanitizeAgentWithdrawalData(response, [
          "withdrawalRequestId", "requestType", "amount", "status", "requestDate", "approvedAt"
        ]);
        setWithdrawals(sanitizedWithdrawals);
      } else {
        setWithdrawals([]);
      }
    } catch (error) {
      setError("Failed to fetch withdrawals");
      showToastError("Failed to fetch withdrawals");
    }
  };



  const debouncedFetchWithdrawals = useCallback(
    debounce((params) => fetchWithdrawals(params), 300),
    []
  );

  useEffect(() => {
    const params = {
      page,
      size,
      sortBy,
      direction,
      status,
    };
    fetchWithdrawals(params);
  }, [page, size, sortBy, direction, status,isAgent]);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="commission-withdrawals-container">
      <div className="commission-withdrawals-card">
        <h1 className="commission-withdrawals-header">Agent Commission Withdrawals</h1>

        <div className="commission-withdrawals-filters">
          <select
            value={status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
          >
            <option value="">Select Status</option>
            {statuses.map((status, index) => (
              <option key={index} value={status}>
                {status}
              </option>
            ))}
          </select>
          <input
            type="date"
            placeholder="From Date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
          <input
            type="date"
            placeholder="To Date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
          <button onClick={handleReset}>Reset</button>
        </div>


        <Table
          data={withdrawals || []}
          searchParams={searchParams}
          setSearchParams={setSearchParams}
        />
      </div>
    </div>
  );
};

export default AgentCommissionWithdrawals;
