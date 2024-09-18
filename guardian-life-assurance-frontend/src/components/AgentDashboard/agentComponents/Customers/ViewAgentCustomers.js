import React, { useState, useEffect } from "react";
import { getAllCustomersByAgent } from "../../../../services/agentServices"; 
import Table from "../../../../sharedComponents/Table/Table";
import { useSearchParams } from "react-router-dom";
import { showToastError } from "../../../../utils/toast/Toast";
import { sanitizeAgentCustomerData } from "../../../../utils/helpers/SanitizeData";
import '../../../Customers/ViewCustomers.css';


const ViewAgentCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [error, setError] = useState(null);

  const page = parseInt(searchParams.get("page")) || 0;
  const size = parseInt(searchParams.get("size")) || 10;
  const sortBy = searchParams.get("sortBy") || "customerId";
  const direction = searchParams.get("direction") || "ASC";

  const [name, setName] = useState(searchParams.get("name") || "");
  const [city, setCity] = useState(searchParams.get("city") || "");
  const [state, setState] = useState(searchParams.get("state") || "");
  const [isActive, setIsActive] = useState(searchParams.get("isActive") || "");
  const [sortField, setSortField] = useState(sortBy);
  const [sortDirection, setSortDirection] = useState(direction);

  const keysToBeIncluded = ["customerId", "firstName", "lastName", "email", "dateOfBirth", "city", "state"];

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const params = {
          page,
          size,
          sortBy: sortField,
          direction: sortDirection,
          name,
          city,
          state,
          isActive,
        };

        const response = await getAllCustomersByAgent(params); // Updated API call to fetch customers by agent
        const sanitizedCustomers = sanitizeAgentCustomerData(response, keysToBeIncluded);
        setCustomers(sanitizedCustomers);
      } catch (error) {
        setError("Failed to fetch customers");
        showToastError("Failed to fetch customers");
      }
    };

    fetchCustomers();
  }, [searchParams]); // Fetch customers when search params change



  const handleSearch = () => {
    setSearchParams({
      page: page.toString(),
      size: size.toString(),
      sortBy: sortField,
      direction: sortDirection,
      name,
      city,
      state,
      isActive: isActive.toString(),
    });
  };

  const handleReset = () => {
    setName("");
    setCity("");
    setState("");
    setIsActive("");
    setSortField("customerId");
    setSortDirection("ASC");
    setSearchParams({});
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="view-customers-container">
      <h1>View Customers</h1>

      <div className="view-customers-filters">
        <input
          type="text"
          placeholder="Customer Name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            const currentParams = Object.fromEntries(searchParams);
            if (e.target.value !== "") {
              currentParams.name = e.target.value;
            } else {
              delete currentParams.name;
            }
            setSearchParams(currentParams);
          }}
        />
        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => {
            setCity(e.target.value);
            const currentParams = Object.fromEntries(searchParams);
            if (e.target.value !== "") {
              currentParams.city = e.target.value;
            } else {
              delete currentParams.city;
            }
            setSearchParams(currentParams);
          }}
        />
        <input
          type="text"
          placeholder="State"
          value={state}
          onChange={(e) => {
            setState(e.target.value);
            const currentParams = Object.fromEntries(searchParams);
            if (e.target.value !== "") {
              currentParams.state = e.target.value;
            } else {
              delete currentParams.state;
            }
            setSearchParams(currentParams);
          }}
        />
        <select value={sortField} onChange={(e) => setSortField(e.target.value)}>
          <option value="customerId">Customer ID</option>
          <option value="firstName">First Name</option>
          <option value="lastName">Last Name</option>
          <option value="dateOfBirth">Date of Birth</option>
        </select>
        <select value={sortDirection} onChange={(e) => setSortDirection(e.target.value)}>
          <option value="ASC">Ascending</option>
          <option value="DESC">Descending</option>
        </select>
        <select value={isActive} onChange={(e) => setIsActive(e.target.value === "true")}>
          <option value="">Select Active Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
        <button onClick={handleSearch}>Search</button>
        <button onClick={handleReset}>Reset</button>
      </div>



      <Table data={customers} searchParams={searchParams} setSearchParams={setSearchParams} />
    </div>
  );
};

export default ViewAgentCustomers;
