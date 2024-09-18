import React, { useState, useEffect, useCallback } from "react";
import { deleteEmployee, getAllEmployees } from "../../services/employeeServices"; 
import Table from "../../sharedComponents/Table/Table"; 
import { useSearchParams, useNavigate } from "react-router-dom";
import { debounce } from "../../utils/helpers/Debounce";
import { showToastError, showToastSuccess } from "../../utils/toast/Toast";
import { sanitizeEmployeeData } from "../../utils/helpers/SanitizeData"; 
import { verifyAdmin,verifyEmployee } from "../../services/authServices";
import { Helper } from "../../utils/helpers/Helper";
import "./ViewEmployees.css";

const ViewEmployees = () => {
  const [employees, setEmployees] = useState({});
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isVerified, setIsVerified] = useState(false);

  const page = parseInt(searchParams.get("page")) || 0;
  const size = parseInt(searchParams.get("size")) || 10;
  const sortBy = searchParams.get("sortBy") || "employeeId";
  const direction = searchParams.get("direction") || "ASC";
  const name = searchParams.get("name") || "";
  const isActive = searchParams.get("isActive") === "true"
    ? true
    : searchParams.get("isActive") === "false"
    ? false
    : null;

  const debouncedFetchEmployees = useCallback(
    debounce(async (params) => {
      try {
        if(!isVerified) return;
        const response = await getAllEmployees(params);
        const sanitizedData = sanitizeEmployeeData(response, [
          "employeeId", "firstName", "lastName", "email", "username", "active"
        ], handleDelete, handleEdit);
        setEmployees(sanitizedData);
      } catch (err) {
        setError("Failed to fetch employees");
        showToastError("Failed to fetch employees");
      }
    }, 300),
    [isVerified]
  );

  const getRoleLink = (link = "") => {
    return Helper.getRoleLink(localStorage.getItem("role"), null, link);
  };
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
    const params = {
      page, size, sortBy, direction, name, isActive,
    };
    debouncedFetchEmployees(params);
  }, [page, size, sortBy, direction, name, isActive, debouncedFetchEmployees]);

  const handleSearchChange = (key, value) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      if (value !== null && value !== '') {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
      return newParams;
    });
  };

  const handleEdit = (employeeId) => {
    navigate(getRoleLink(`/employees/${employeeId}/edit`));
  };

  const handleDelete = async (employeeId) => {
    try {
      await deleteEmployee(employeeId); 
      debouncedFetchEmployees({ page, size, sortBy, direction, name, isActive });
      showToastSuccess("Employee deleted successfully");
    } catch (error) {
      setError("Failed to delete employee. Please try again.");
      showToastError("Failed to delete employee. Please try again.");
    }
  };

  const handleSortChange = (e) => {
    handleSearchChange("sortBy", e.target.value);
  };

  const handleDirectionChange = (e) => {
    handleSearchChange("direction", e.target.value);
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="view-all-employees-container">
      <div className="view-all-employees-card">
        <h1 className="view-all-employees-header">View All Employees</h1>
        <div className="view-employees-filters">
          <input
            type="text"
            placeholder="Search by Name"
            value={name}
            onChange={(e) => handleSearchChange("name", e.target.value)}
          />
          <select
            value={isActive !== null ? isActive : ""}
            onChange={(e) => handleSearchChange("isActive", e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
          <select
            value={sortBy}
            onChange={handleSortChange}
          >
            <option value="employeeId">Sort by Employee ID</option>
            <option value="firstName">Sort by First Name</option>
            <option value="lastName">Sort by Last Name</option>
          </select>
          <select
            value={direction}
            onChange={handleDirectionChange}
          >
            <option value="ASC">Ascending</option>
            <option value="DESC">Descending</option>
          </select>
        </div>
        <Table
          data={employees}
          searchParams={searchParams}
          setSearchParams={setSearchParams}
          paginationData={employees} 
        />
      </div>
    </div>
  );
};

export default ViewEmployees;
