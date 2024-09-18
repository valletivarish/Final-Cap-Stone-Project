import React, { useState, useEffect, useMemo } from "react";
import { getAllPayments, downloadPaymentReport } from "../../services/gaurdianLifeAssuranceServices"; 
import Table from "../../sharedComponents/Table/Table";
import { useSearchParams } from "react-router-dom";
import { showToastError } from "../../utils/toast/Toast";
import { sanitizePaymentData } from "../../utils/helpers/SanitizeData";
import './ViewPayments.css';
import PdfDownloadButton from "../../sharedComponents/Button/PdfDownloadButton";
import { verifyAdmin, verifyEmployee } from "../../services/authServices";
import { useNavigate } from "react-router-dom";

const ViewPayments = () => {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [error, setError] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  
  const page = parseInt(searchParams.get("page")) || 0;
  const size = parseInt(searchParams.get("size")) || 5;
  const sortBy = searchParams.get("sortBy") || "paymentId";
  const direction = searchParams.get("direction") || "asc";

  const [minAmount, setMinAmount] = useState(searchParams.get("minAmount") || "");
  const [maxAmount, setMaxAmount] = useState(searchParams.get("maxAmount") || "");
  const [startDate, setStartDate] = useState(searchParams.get("startDate") || "");
  const [endDate, setEndDate] = useState(searchParams.get("endDate") || "");
  const [sortField, setSortField] = useState(sortBy);
  const [sortDirection, setSortDirection] = useState(direction);

  const keysToBeIncluded =useMemo(()=>[
    "paymentId", "policyNo", "amount", "paymentDate", 
    "status", 
  ],[]);

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
    const fetchPayments = async () => {
      if (!isVerified) return;
      try {
        const params = {
          page,
          size,
          sortBy: sortField,
          direction: sortDirection,
          minAmount,
          maxAmount,
          startDate,
          endDate,
        };

        const response = await getAllPayments(params);
        const sanitizedPayments = sanitizePaymentData(response, keysToBeIncluded);
        setPayments(sanitizedPayments);
      } catch (error) {
        setError("Failed to fetch payments");
        showToastError("Failed to fetch payments");
      }
    };

    fetchPayments();
  }, [isVerified, searchParams, sortField, sortDirection, minAmount, maxAmount, startDate, endDate, page, size, keysToBeIncluded]);

  const handleSearch = () => {
    const currentParams = new URLSearchParams(searchParams);

    currentParams.set("page", page.toString());
    currentParams.set("size", size.toString());
    currentParams.set("sortBy", sortField);
    currentParams.set("direction", sortDirection);
    if (minAmount) currentParams.set("minAmount", minAmount);
    else currentParams.delete("minAmount");

    if (maxAmount) currentParams.set("maxAmount", maxAmount);
    else currentParams.delete("maxAmount");

    if (startDate) currentParams.set("startDate", startDate);
    else currentParams.delete("startDate");

    if (endDate) currentParams.set("endDate", endDate);
    else currentParams.delete("endDate");

    setSearchParams(currentParams);
  };

  const handleReset = () => {
    setMinAmount("");
    setMaxAmount("");
    setStartDate("");
    setEndDate("");
    setSortField("paymentId");
    setSortDirection("asc");
    setSearchParams({});
  };

  const handleDownloadReport = () => {
    downloadPaymentReport(startDate, endDate);
  };
  if(error){
    return <div>error</div>
  }

  return (
    <div className="view-payments-container">
      <h1>View Payments</h1>

      <div className="view-payments-filters">
        <input
          type="number"
          placeholder="Min Amount"
          value={minAmount}
          onChange={(e) => {
            const value = e.target.value;
            setMinAmount(value);
            const currentParams = new URLSearchParams(searchParams);
            if (value) currentParams.set("minAmount", value);
            else currentParams.delete("minAmount");
            setSearchParams(currentParams);
          }}
        />
        <input
          type="number"
          placeholder="Max Amount"
          value={maxAmount}
          onChange={(e) => {
            const value = e.target.value;
            setMaxAmount(value);
            const currentParams = new URLSearchParams(searchParams);
            if (value) currentParams.set("maxAmount", value);
            else currentParams.delete("maxAmount");
            setSearchParams(currentParams);
          }}
        />
        <input
          type="date"
          placeholder="Start Date"
          value={startDate}
          onChange={(e) => {
            const value = e.target.value;
            setStartDate(value);
          }}
        />
        <input
          type="date"
          placeholder="End Date"
          value={endDate}
          onChange={(e) => {
            const value = e.target.value;
            setEndDate(value);
          }}
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
      <PdfDownloadButton action={handleDownloadReport} />

      <Table
        data={payments}
        searchParams={searchParams}
        setSearchParams={setSearchParams}
      />
    </div>
  );
};

export default ViewPayments;
