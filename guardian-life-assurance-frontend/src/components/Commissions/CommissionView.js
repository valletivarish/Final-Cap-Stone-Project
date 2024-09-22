import React, { useState, useEffect, useCallback } from "react";
import {
  downloadCommissionReport,
  getAllCommissions,
  getCommissionTypes,
} from "../../services/gaurdianLifeAssuranceServices";
import Table from "../../sharedComponents/Table/Table";
import { useSearchParams } from "react-router-dom";
import { debounce } from "../../utils/helpers/Debounce";
import { showToastError } from "../../utils/toast/Toast";
import "./CommissionView.css";
import PdfDownloadButton from "../../sharedComponents/Button/PdfDownloadButton";
import { verifyAdmin, verifyEmployee } from "../../services/authServices";
import { sanitizeCommissionData } from "../../utils/helpers/SanitizeData";
import { useNavigate } from "react-router-dom";

const CommissionView = () => {
  const navigate = useNavigate();
  const [commissions, setCommissions] = useState([]);
  const [commissionTypes, setCommissionTypes] = useState([]);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get("page")) || 0;
  const size = parseInt(searchParams.get("size")) || 10;
  const sortBy = searchParams.get("sortBy") || "commissionId";
  const direction = searchParams.get("direction") || "ASC";
  const [isVerified, setIsVerified] = useState(false);
  const [agentId, setAgentId] = useState(searchParams.get("agentId") || "");
  const [commissionType, setCommissionType] = useState(
    searchParams.get("commissionType") || ""
  );
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
    const fetchCommissionTypes = async () => {
      try {
        const response = await getCommissionTypes();
        setCommissionTypes(response);
      } catch (error) {
        console.error("Failed to fetch commission types:", error);
      }
    };
    fetchCommissionTypes();
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
      case "commissionType":
        setCommissionType(value);
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
  const convertDateToDDMMYYYY = (dateString) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
  };

  const handleSearch = () => {
    const formattedFromDate = convertDateToDDMMYYYY(fromDate);
    const formattedToDate = convertDateToDDMMYYYY(toDate);
    const params = {
      page,
      size,
      sortBy,
      direction,
      agentId,
      commissionType,
      fromDate: formattedFromDate,
      toDate: formattedToDate,
    };
    setSearchParams(params);
    debouncedFetchCommissions(params);
  };

  const handleReset = () => {
    setAgentId("");
    setCommissionType("");
    setFromDate("");
    setToDate("");
    setSearchParams(new URLSearchParams());
    fetchCommissions({
      page: 0,
      size: 10,
      sortBy: "commissionId",
      direction: "ASC",
    });
  };

  const fetchCommissions = async (params) => {
    try {
      if(!isVerified) return;
      const response = await getAllCommissions(params);
      const sanitizeData = sanitizeCommissionData(response, [
        "commissionId",
        "commissionType",
        "issueDate",
        "amount",
        "policyNo",
        "agentId",
        "agentName",
      ]);
      setCommissions(sanitizeData);
    } catch (error) {
      setError("Failed to fetch commissions");
      showToastError("Failed to fetch commissions");
    }
  };

  const debouncedFetchCommissions = useCallback(
    debounce((params) => fetchCommissions(params), 300),
    []
  );
  const handleDownloadReport = () => {
    downloadCommissionReport(searchParams);
  };

  useEffect(() => {
    const params = {
      page,
      size,
      sortBy,
      direction,
      agentId,
      commissionType,
      fromDate,
      toDate,
    };
    fetchCommissions(params);
  }, [searchParams,isVerified]);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      {isVerified && (
        <div className="commission-container">
          <div className="commission-card">
            <h1 className="commission-header">Commissions</h1>

            {/* Filters */}
            <div className="commission-filters">
              <input
                type="number"
                placeholder="Agent ID"
                value={agentId}
                onChange={(e) => handleFilterChange("agentId", e.target.value)}
              />
              <select
                value={commissionType}
                onChange={(e) =>
                  handleFilterChange("commissionType", e.target.value)
                }
              >
                <option value="">Select Commission Type</option>
                {commissionTypes.map((type, index) => (
                  <option key={index} value={type}>
                    {type}
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
              data={commissions || []}
              searchParams={searchParams}
              setSearchParams={setSearchParams}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default CommissionView;
