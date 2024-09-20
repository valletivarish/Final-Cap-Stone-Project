import React, { useState, useEffect } from "react";
import { getAgentEarnings } from "../../../../services/agentServices";
import Table from "../../../../sharedComponents/Table/Table";
import { useNavigate, useSearchParams } from "react-router-dom";
import { showToastError } from "../../../../utils/toast/Toast";
import { sanitizeAgentEarningsData } from "../../../../utils/helpers/SanitizeData";
import "./ViewAgentEarnings.css";
import { verifyAgent } from "../../../../services/authServices";
const ViewAgentEarnings = () => {
  const [earnings, setEarnings] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [error, setError] = useState(null);

  const page = parseInt(searchParams.get("page")) || 0;
  const size = parseInt(searchParams.get("size")) || 10;
  const [sortBy, setSortBy] = useState(
    searchParams.get("sortBy") || "withdrawalDate"
  );
  const [direction, setDirection] = useState(
    searchParams.get("direction") || "ASC"
  );
  const [minAmount, setMinAmount] = useState(
    searchParams.get("minAmount") || ""
  );
  const [maxAmount, setMaxAmount] = useState(
    searchParams.get("maxAmount") || ""
  );
  const [fromDate, setFromDate] = useState(searchParams.get("fromDate") || "");
  const [toDate, setToDate] = useState(searchParams.get("toDate") || "");

  const keysToBeIncluded = ["id", "amount", "withdrawalDate"];

  const navigate = useNavigate();
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
    if (!isAgent) {
      return;
    }
    const fetchEarnings = async () => {
      try {
        const params = {
          page,
          size,
          sortBy,
          direction,
          minAmount,
          maxAmount,
          fromDate,
          toDate,
        };
        const response = await getAgentEarnings(params);
        const sanitizedEarnings = sanitizeAgentEarningsData(
          response,
          keysToBeIncluded
        );
        setEarnings(sanitizedEarnings);
      } catch (error) {
        setError("Failed to fetch agent earnings");
        showToastError("Failed to fetch agent earnings");
      }
    };

    fetchEarnings();
  }, [searchParams, isAgent]);

  const handleSearch = () => {
    setSearchParams({
      page: page.toString(),
      size: size.toString(),
      sortBy,
      direction,
      minAmount,
      maxAmount,
      fromDate,
      toDate,
    });
  };

  const handleReset = () => {
    setMinAmount("");
    setMaxAmount("");
    setFromDate("");
    setToDate("");
    setSearchParams({});
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="view-agent-earnings-container">
      <h1>View Agent Earnings</h1>

      <div className="view-agent-earnings-filters">
        <input
          type="number"
          placeholder="Min Amount"
          value={minAmount}
          onChange={(e) => {
            const currentSearchParams = Object.fromEntries(searchParams);
            if (e.target.value !== "") {
              currentSearchParams.minAmount = e.target.value;
            } else {
              delete currentSearchParams.minAmount;
            }
            setSearchParams(currentSearchParams);
            setMinAmount(e.target.value);
          }}
        />
        <input
          type="number"
          placeholder="Max Amount"
          value={maxAmount}
          onChange={(e) => {
            const currentSearchParams = Object.fromEntries(searchParams);
            if (e.target.value !== "") {
              currentSearchParams.maxAmount = e.target.value;
            } else {
              delete currentSearchParams.maxAmount;
            }
            setSearchParams(currentSearchParams);
            setMaxAmount(e.target.value);
          }}
        />
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
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="withdrawalDate">Withdrawal Date</option>
          <option value="amount">Amount</option>
        </select>
        <select
          value={direction}
          onChange={(e) => setDirection(e.target.value)}
        >
          <option value="ASC">Ascending</option>
          <option value="DESC">Descending</option>
        </select>
        <button onClick={handleSearch}>Search</button>
        <button onClick={handleReset}>Reset</button>
      </div>

      <Table
        data={earnings}
        searchParams={searchParams}
        setSearchParams={setSearchParams}
      />
    </div>
  );
};

export default ViewAgentEarnings;
