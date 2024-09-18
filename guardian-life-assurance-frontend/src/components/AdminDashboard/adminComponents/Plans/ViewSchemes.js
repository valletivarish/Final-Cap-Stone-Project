import React, { useState, useEffect, useCallback } from "react";
import Table from "../../../../sharedComponents/Table/Table";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getAllSchemes } from "../../../../services/gaurdianLifeAssuranceServices";
import { sanitizeSchemeData } from "../../../../utils/helpers/SanitizeData";
import { debounce } from "../../../../utils/helpers/Debounce";
import "./ViewScheme.css";
import { Helper } from "../../../../utils/helpers/Helper";
import {verifyAdmin,verifyEmployee} from "../../../../services/authServices"

const ViewSchemes = () => {
  const [schemes, setSchemes] = useState({});
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isVerified, setIsVerified] = useState(false);

  const page = parseInt(searchParams.get("page")) || 0;
  const size = parseInt(searchParams.get("size")) || 5;
  const sortBy = searchParams.get("sortBy") || "schemeName";
  const direction = searchParams.get("direction") || "ASC";
  const planId = searchParams.get("planId") || "";
  const schemeName = searchParams.get("schemeName") || "";

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

  const debouncedFetchSchemes = useCallback(
    debounce(async (params) => {
      try {
        const response = await getAllSchemes(params);
        const sanitizedData = sanitizeSchemeData(response, [
          "schemeId", "schemeName", "planName", "active", "minAmount", "maxAmount", "schemeImage"
        ], handleShowMore);
        setSchemes(sanitizedData);
      } catch (err) {
        setError("Failed to fetch schemes");
      }
    }, 300),
    []
  );

  useEffect(() => {
    const params = {
      page, size, sortBy, direction, planId, schemeName,
    };
    debouncedFetchSchemes(params);
  }, [page, size, sortBy, direction, planId, schemeName, debouncedFetchSchemes]);

  const handleSearchChange = (key, value) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
      return newParams;
    });
  };
  const getRoleLink = (link = "") => {
    return Helper.getRoleLink(localStorage.getItem("role"),null, link);
  };

  const handleShowMore = (schemeId) => {
    const roleBasedLink = getRoleLink(`/schemes/${schemeId}/details`);
    console.log("Navigating to: ", roleBasedLink);
    navigate(roleBasedLink);
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="view-schemes-container">
      <div className="view-schemes-card">
        <h1 className="view-schemes-header">View Schemes</h1>
        <div className="view-scheme-filters">
          <input
            type="text"
            placeholder="Plan ID"
            value={planId}
            onChange={(e) => handleSearchChange("planId", e.target.value)}
          />
          <input
            type="text"
            placeholder="Scheme Name"
            value={schemeName}
            onChange={(e) => handleSearchChange("schemeName", e.target.value)}
          />
        </div>
        <Table data={schemes || []} searchParams={searchParams} setSearchParams={setSearchParams}/>
      </div>
    </div>
  );
};

export default ViewSchemes;
