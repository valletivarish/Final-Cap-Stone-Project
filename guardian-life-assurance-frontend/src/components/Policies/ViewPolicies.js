import React, { useState, useEffect, useCallback } from "react";
import { getAllPolicies } from "../../services/gaurdianLifeAssuranceServices";
import Table from "../../sharedComponents/Table/Table";
import { useSearchParams, useNavigate } from "react-router-dom";
import { showToastError } from "../../utils/toast/Toast";
import { sanitizePolicyData } from "../../utils/helpers/SanitizeData";
import './ViewPolicies.css';
import PdfDownloadButton from "../../sharedComponents/Button/PdfDownloadButton";
import { downloadCustomerReport } from "../../services/gaurdianLifeAssuranceServices";
import { verifyAdmin, verifyEmployee } from "../../services/authServices";
import { useMemo } from "react";

const ViewPolicies = () => {
  const navigate = useNavigate();
  const [policies, setPolicies] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [error, setError] = useState(null);
  const [isVerified, setIsVerified] = useState(false);

  const page = parseInt(searchParams.get("page")) || 0;
  const size = parseInt(searchParams.get("size")) || 5;
  const sortBy = searchParams.get("sortBy") || "policyNo";
  const direction = searchParams.get("direction") || "asc";

  const [customerName, setCustomerName] = useState(searchParams.get("customerName") || "");
  const [city, setCity] = useState(searchParams.get("city") || "");
  const [state, setState] = useState(searchParams.get("state") || "");
  const [sortField, setSortField] = useState(sortBy);
  const [sortDirection, setSortDirection] = useState(direction);

  const keysToBeIncluded = useMemo(() => [
    "customerName", "customerCity", "customerState", 
    "policyNo", "insurancePlan", "insuranceScheme", 
    "maturityDate", "premiumType", "premiumAmount", 
    "sumAssured", "profitRatio", "policyStatus"
  ],[]);

  const handleDownloadReport = useCallback(() => {
    downloadCustomerReport();
  }, []);

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
    const fetchPolicies = async () => {
      if (!isVerified) return;
      try {
        const params = {
          page,
          size,
          sortBy: sortField,
          direction: sortDirection,
          customerName,
          city,
          state,
        };

        const response = await getAllPolicies(params);
        const sanitizedPolicies = sanitizePolicyData(response, keysToBeIncluded);
        setPolicies(sanitizedPolicies);
      } catch (error) {
        setError("Failed to fetch policies");
        showToastError("Failed to fetch policies");
      }
    };

    fetchPolicies();
  }, [isVerified, searchParams, sortField, sortDirection, customerName, city, state, page, size, keysToBeIncluded]);

  const handleSearch = () => {
    const currentParams = Object.fromEntries(searchParams);
    currentParams.sortBy = sortField;
    currentParams.direction = sortDirection;
    currentParams.page = page.toString();
    currentParams.size = size.toString();
    setSearchParams(currentParams);
  };

  const handleReset = () => {
    setCustomerName("");
    setCity("");
    setState("");
    setSortField("policyNo");
    setSortDirection("asc");
    setSearchParams({});
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      {isVerified && (
        <div className="view-policies-container">
          <h1>View Policies</h1>

          <div className="view-policies-filters">
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value)}
            >
              <option value="policyNo">Policy Number</option>
              <option value="maturityDate">Maturity Date</option>
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
            data={policies}
            searchParams={searchParams}
            setSearchParams={setSearchParams}
          />
        </div>
      )}
    </>
  );
};

export default ViewPolicies;
