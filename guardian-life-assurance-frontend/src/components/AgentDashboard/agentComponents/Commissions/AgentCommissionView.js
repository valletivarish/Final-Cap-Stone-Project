import React, { useState, useEffect, useCallback } from "react";
import { getAgentCommissions } from "../../../../services/agentServices";
import { getCommissionTypes } from "../../../../services/gaurdianLifeAssuranceServices";
import Table from "../../../../sharedComponents/Table/Table";
import { useNavigate, useSearchParams } from "react-router-dom";
import { debounce } from "../../../../utils/helpers/Debounce";
import { showToastError } from "../../../../utils/toast/Toast";
import "../../../Commissions/CommissionView.css";
import { sanitizeCommissionData } from "../../../../utils/helpers/SanitizeData";
import { verifyAgent } from "../../../../services/authServices";

const AgentCommissionView = () => {
  const [commissions, setCommissions] = useState([]);
  const [commissionTypes, setCommissionTypes] = useState([]);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get("page")) || 0;
  const size = parseInt(searchParams.get("size")) || 10;
  const sortBy = searchParams.get("sortBy") || "commissionId";
  const direction = searchParams.get("direction") || "ASC";
  const [commissionType, setCommissionType] = useState(searchParams.get("commissionType") || "");
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
      commissionType,
      fromDate: formattedFromDate,
      toDate: formattedToDate,
    };
    setSearchParams(params);
    debouncedFetchCommissions(params);
  };

  const handleReset = () => {
    setCommissionType("");
    setFromDate("");
    setToDate("");
    setSearchParams(new URLSearchParams());
    fetchCommissions({ page: 0, size: 10, sortBy: "commissionId", direction: "ASC" });
  };

  const fetchCommissions = async (params) => {
    if(!isAgent){
      return;
    }
    try {
      const response = await getAgentCommissions(params);
      const sanitizedData = sanitizeCommissionData(response, [
        "commissionId",
        "commissionType",
        "policyNo",
        "issueDate",
        "amount",
      ]);
      setCommissions(sanitizedData);
    } catch (error) {
      setError("Failed to fetch commissions");
      showToastError("Failed to fetch commissions");
    }
  };

  const debouncedFetchCommissions = useCallback(
    debounce((params) => fetchCommissions(params), 300),
    []
  );


  useEffect(() => {
    const params = {
      page,
      size,
      sortBy,
      direction,
      commissionType,
    };
    fetchCommissions(params);
  }, [page, size, sortBy, direction, commissionType,isAgent]);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="commission-container">
      <div className="commission-card">
        <h1 className="commission-header">Agent Commissions</h1>

        <div className="commission-filters">
          <select
            value={commissionType}
            onChange={(e) => handleFilterChange("commissionType", e.target.value)}
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



        <Table
          data={commissions || []}
          searchParams={searchParams}
          setSearchParams={setSearchParams}
        />
      </div>
    </div>
  );
};

export default AgentCommissionView;
