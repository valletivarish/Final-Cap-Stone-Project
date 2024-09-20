import React, { useState, useEffect } from "react";
import { getAgentPolicyPayments } from "../../../../../services/agentServices"; 
import Table from "../../../../../sharedComponents/Table/Table";
import { useNavigate, useSearchParams } from "react-router-dom";
import { showToastError } from "../../../../../utils/toast/Toast";
import { sanitizePaymentData } from "../../../../../utils/helpers/SanitizeData";
import '../../../../Policies/ViewPayments.css';
import { verifyAgent } from "../../../../../services/authServices";


const ViewAgentPoliciesPayments = () => {
  const [payments, setPayments] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [error, setError] = useState(null);

  const page = parseInt(searchParams.get("page")) || 0;
  const size = parseInt(searchParams.get("size")) || 5;
  const sortBy = searchParams.get("sortBy") || "paymentId";
  const direction = searchParams.get("direction") || "asc";

  const [startDate, setStartDate] = useState(searchParams.get("startDate") || "");
  const [endDate, setEndDate] = useState(searchParams.get("endDate") || "");
  const [sortField, setSortField] = useState(sortBy);
  const [sortDirection, setSortDirection] = useState(direction);

  const keysToBeIncluded = [
    "paymentId", "policyNo", "amount", "paymentDate", 
    "status",
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

  useEffect(() => {
    if(!isAgent){
      return;
    }
    const fetchPayments = async () => {
      try {
        const params = {
          page,
          size,
          sortBy: sortField,
          direction: sortDirection,
          fromDate:startDate,
          toDate:endDate,
        };

        const response = await getAgentPolicyPayments(params);
        const sanitizedPayments = sanitizePaymentData(response, keysToBeIncluded);
        setPayments(sanitizedPayments);
      } catch (error) {
        setError("Failed to fetch payments");
        showToastError("Failed to fetch payments");
      }
    };

    fetchPayments();
  }, [searchParams,isAgent]);

  const handleSearch = () => {
    const currentParams = new URLSearchParams(searchParams);

    currentParams.set("page", page.toString());
    currentParams.set("size", size.toString());
    currentParams.set("sortBy", sortField);
    currentParams.set("direction", sortDirection);

    if (startDate) currentParams.set("startDate", startDate);
    else currentParams.delete("startDate");

    if (endDate) currentParams.set("endDate", endDate);
    else currentParams.delete("endDate");

    setSearchParams(currentParams);
  };

  const handleReset = () => {
    setStartDate("");
    setEndDate("");
    setSortField("paymentId");
    setSortDirection("asc");
    setSearchParams({});
  };

  return (
    <div className="view-payments-container">
      <h1>View Agent Payments</h1>

      <div className="view-payments-filters">
        <input
          type="date"
          placeholder="Start Date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          type="date"
          placeholder="End Date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <select
          value={sortField}
          onChange={(e) => setSortField(e.target.value)}
        >
          <option value="paymentId">Payment ID</option>
          <option value="amount">Amount</option>
          <option value="paymentDate">Payment Date</option>
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
        data={payments}
        searchParams={searchParams}
        setSearchParams={setSearchParams}
      />
    </div>
  );
};

export default ViewAgentPoliciesPayments;
