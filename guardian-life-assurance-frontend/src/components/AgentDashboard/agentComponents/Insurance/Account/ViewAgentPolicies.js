import React, { useState, useEffect } from "react";
import { getAgentPolicies } from "../../../../../services/agentServices"; 
import Table from "../../../../../sharedComponents/Table/Table";
import { useSearchParams } from "react-router-dom";
import { showToastError } from "../../../../../utils/toast/Toast";
import { sanitizePolicyData } from "../../../../../utils/helpers/SanitizeData";
import '../../../../Policies/ViewPolicies.css'


const ViewAgentPolicies = () => { 
  const [policies, setPolicies] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [error, setError] = useState(null);
  const page = parseInt(searchParams.get("page")) || 0;
  const size = parseInt(searchParams.get("size")) || 5;
  const sortBy = searchParams.get("sortBy") || "policyNo";
  const direction = searchParams.get("direction") || "asc";

  const [customerName, setCustomerName] = useState(searchParams.get("customerName") || "");
  const [city, setCity] = useState(searchParams.get("city") || "");
  const [state, setState] = useState(searchParams.get("state") || "");
  const [sortField, setSortField] = useState(sortBy);
  const [sortDirection, setSortDirection] = useState(direction);
  const keysToBeIncluded = [
    "customerName", "customerCity", "customerState", 
    "policyNo", "insurancePlan", "insuranceScheme", 
    "maturityDate", "premiumType", "premiumAmount", 
    "sumAssured", "profitRatio", "policyStatus"
  ];

  useEffect(() => {
    const fetchPolicies = async () => {
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

        const response = await getAgentPolicies(params);
        console.log("view agent policies",response)
        const sanitizedPolicies = sanitizePolicyData(response, keysToBeIncluded);
        setPolicies(sanitizedPolicies);
      } catch (error) {
        setError("Failed to fetch policies");
        showToastError("Failed to fetch policies");
      }
    };

    fetchPolicies();
  }, [searchParams]);

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

  return (
    <div className="view-policies-container"> {/* Updated container class */}
      <h1>View Agent Policies</h1>

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


      <Table
        data={policies}
        searchParams={searchParams}
        setSearchParams={setSearchParams}
      />
    </div>
  );
};

export default ViewAgentPolicies; 
