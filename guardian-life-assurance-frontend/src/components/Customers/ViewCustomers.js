import React, { useState, useEffect } from "react";
import { getAllCustomers } from "../../services/gaurdianLifeAssuranceServices";
import Table from "../../sharedComponents/Table/Table";
import { useSearchParams } from "react-router-dom";
import { showToastError, showToastSuccess } from "../../utils/toast/Toast";
import { sanitizeCustomerData } from "../../utils/helpers/SanitizeData";
import './ViewCustomers.css'
import PdfDownloadButton from "../../sharedComponents/Button/PdfDownloadButton";
import { downloadCustomerReport } from "../../services/gaurdianLifeAssuranceServices";
import { deactivateCustomer,activateCustomer } from "../../services/gaurdianLifeAssuranceServices";
import { useNavigate } from "react-router-dom";
import { verifyAdmin,verifyEmployee } from "../../services/authServices";

const ViewCustomers = () => {
  const navigate=useNavigate();
  const [customers, setCustomers] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [error, setError] = useState(null);

  const page = parseInt(searchParams.get("page")) || 0;
  const size = parseInt(searchParams.get("size")) || 10;
  const sortBy = searchParams.get("sortBy") || "customerId";
  const direction = searchParams.get("direction") || "ASC";

  const [isVerified, setIsVerified] = useState(false);
  const [name, setName] = useState(searchParams.get("name") || "");
  const [city, setCity] = useState(searchParams.get("city") || "");
  const [state, setState] = useState(searchParams.get("state") || "");
  const [isActive, setIsActive] = useState(searchParams.get("isActive")|| "");
  const [sortField, setSortField] = useState(sortBy);
  const [sortDirection, setSortDirection] = useState(direction);

  const keysToBeIncluded = ["customerId", "firstName", "lastName", "email", "dateOfBirth", "city", "state"];
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

        const response = await getAllCustomers(params);
        const sanitizedCustomers = sanitizeCustomerData(response, keysToBeIncluded,handleDeactivate,handleActivate);
        setCustomers(sanitizedCustomers);
      } catch (error) {
        setError("Failed to fetch customers");
        showToastError("Failed to fetch customers");
      }
    };

    fetchCustomers();
  }, [searchParams]); 

  const handleDownloadReport = () => {
    downloadCustomerReport({page,size,sortBy,direction,name,city,state,isActive});
  };

  const handleDeactivate=async(customerId)=>{
    try{
      const response=await deactivateCustomer(customerId);
      console.log(response)
      showToastSuccess(response);
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

        const response = await getAllCustomers(params);
        const sanitizedCustomers = sanitizeCustomerData(response, keysToBeIncluded,handleDeactivate,handleActivate);
        setCustomers(sanitizedCustomers);
      } catch (error) {
        setError("Failed to fetch customers");
        showToastError("Failed to fetch customers");
      }
    }
    catch(error){
      showToastError(error.message);
    }

  }
  const handleActivate=async(customerId)=>{
    try{
      const response=await activateCustomer(customerId);
      showToastSuccess(response);
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

        const response = await getAllCustomers(params);
        const sanitizedCustomers = sanitizeCustomerData(response, keysToBeIncluded,handleDeactivate,handleActivate);
        setCustomers(sanitizedCustomers);
      } catch (error) {
        showToastError(error.message);
      }
    }
    catch(error){
      showToastError(error.message);
    }
  }
  

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
    <>
      {isVerified && (
        <div className="view-customers-container">
        <h1>View Customers</h1>
  
        <div className="view-customers-filters">
          <input
            type="text"
            placeholder="Customer Name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              const currentParams=Object.fromEntries(searchParams);
              if(e.target.value!==""){
                currentParams.name=e.target.value;
              }
              else{
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
              const currentParams=Object.fromEntries(searchParams);
              if(e.target.value!==""){
                currentParams.city=e.target.value;
              }
              else{
                delete currentParams.city;
              }
              setSearchParams(currentParams)
            }}
          />
          <input
            type="text"
            placeholder="State"
            value={state}
            onChange={(e) => {
              setState(e.target.value);
              const currentParams=Object.fromEntries(searchParams);
              if(e.target.value!==""){
                currentParams.state=e.target.value;
                }
                else{
                  delete currentParams.state;
                }
                setSearchParams(currentParams)
            }}
          />
          <select
            value={sortField}
            onChange={(e) => setSortField(e.target.value)}
          >
            <option value="customerId">Customer ID</option>
            <option value="firstName">First Name</option>
            <option value="lastName">Last Name</option>
            <option value="dateOfBirth">Date of Birth</option>
          </select>
          <select
            value={sortDirection}
            onChange={(e) => setSortDirection(e.target.value)}
          >
            <option value="ASC">Ascending</option>
            <option value="DESC">Descending</option>
          </select>
          <select
            value={isActive}
            onChange={(e) => setIsActive(e.target.value === "true")}
          >
            <option value="">Select Active Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
          <button onClick={handleSearch}>Search</button>
          <button onClick={handleReset}>Reset</button>
        </div>
        <PdfDownloadButton action={handleDownloadReport} />
        
  
        <Table
          data={customers}
          searchParams={searchParams}
          setSearchParams={setSearchParams}
        />
      </div>
      )}
    </>
  );
};

export default ViewCustomers;