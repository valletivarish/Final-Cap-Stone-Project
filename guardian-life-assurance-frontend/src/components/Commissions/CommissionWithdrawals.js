import React, { useState, useEffect, useCallback } from "react";
import {
  approveWithdrawal,
  downloadCommissionWithdrawalReport,
  getAllWithdrawals,
  getWithdrawalStatus,
  rejectWithdrawal,
} from "../../services/gaurdianLifeAssuranceServices";
import Table from "../../sharedComponents/Table/Table";
import { useSearchParams } from "react-router-dom";
import { debounce } from "../../utils/helpers/Debounce";
import { showToastError, showToastSuccess } from "../../utils/toast/Toast";
import "./CommissionWithdrawals.css";
import { sanitizeWithdrawalData } from "../../utils/helpers/SanitizeData";
import PdfDownloadButton from "../../sharedComponents/Button/PdfDownloadButton";
import { verifyAdmin, verifyEmployee } from "../../services/authServices";
import { useNavigate } from "react-router-dom";

const CommissionWithdrawals = () => {
  const navigate = useNavigate();
  const [withdrawals, setWithdrawals] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isVerified, setIsVerified] = useState(false);

  const page = parseInt(searchParams.get("page")) || 0;
  const size = parseInt(searchParams.get("size")) || 5;
  const sortBy = searchParams.get("sortBy") || "withdrawalRequestId";
  const direction = searchParams.get("direction") || "ASC";

  const [agentId, setAgentId] = useState(searchParams.get("agentId") || "");
  const [status, setStatus] = useState(searchParams.get("status") || "");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
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
      case "agentId":
        setAgentId(value);
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
      page:parseInt(searchParams.get("page")) || 0,
      size:parseInt(searchParams.get("size")) || 5,
      sortBy:searchParams.get("sortBy") || "",
      direction:searchParams.get("direction") || "",
      agentId:searchParams.get("agentId") || "",
      status,
      fromDate:searchParams.get("fromDate") || "",
      toDate:searchParams.get("toDate") || "",
    };
    setSearchParams(params);
    debouncedFetchWithdrawals(params);
  };

  const handleReset = () => {
    setAgentId("");
    setStatus("");
    setFromDate("");
    setToDate("");
    setSearchParams(new URLSearchParams());
    fetchWithdrawals({
      page: 0,
      size: 10,
      sortBy: "withdrawalRequestId",
      direction: "ASC",
    });
  };

  const fetchWithdrawals = async (params) => {
    try {
      if(!isVerified) return;
      const response = await getAllWithdrawals(params);
      if (response) {
        const sanitizedWithdrawals = sanitizeWithdrawalData(
          response,
          [
            "withdrawalRequestId",
            "requestType",
            "amount",
            "status",
            "agentId",
            "agentName",
            "requestDate",
            "approvedAt",
          ],
          handleApprove,
          handleReject
        );
        setWithdrawals(sanitizedWithdrawals);
      } else {
        setWithdrawals([]);
      }
    } catch (error) {
      setError("Failed to fetch withdrawals");
      showToastError("Failed to fetch withdrawals");
    }
  };
  const handleDownloadReport = () => {
    downloadCommissionWithdrawalReport(searchParams);
  };

  const debouncedFetchWithdrawals = useCallback(
    debounce((params) => fetchWithdrawals(params), 300),
    []
  );

  const handleApprove = async (withdrawalId) => {
    try {
      const response = await approveWithdrawal(withdrawalId);
      fetchWithdrawals(searchParams);
      showToastSuccess(response);
    } catch (error) {
      showToastError("Failed to approve withdrawal");
    }
  };
  const handleReject = async (withdrawalId) => {
    try {
      const response = await rejectWithdrawal(withdrawalId);
      fetchWithdrawals(searchParams);
      showToastSuccess(response);
    } catch (error) {
      showToastError("Failed to reject withdrawal");
    }
  };

  useEffect(() => {
    const params = {
      page,
      size,
      sortBy,
      direction,
      agentId,
      status,
      fromDate,
      toDate,
    };
    fetchWithdrawals(params);
  }, [searchParams,isVerified]);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      {isVerified && (
        <div className="commission-withdrawals-container">
          <div className="commission-withdrawals-card">
            <h1 className="commission-withdrawals-header">
              Commission Withdrawals
            </h1>

            <div className="commission-withdrawals-filters">
              <input
                type="number"
                placeholder="Agent ID"
                value={agentId}
                onChange={(e) => handleFilterChange("agentId", e.target.value)}
              />
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
            <PdfDownloadButton action={handleDownloadReport} />

            <Table
              data={withdrawals || []}
              searchParams={searchParams}
              setSearchParams={setSearchParams}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default CommissionWithdrawals;
