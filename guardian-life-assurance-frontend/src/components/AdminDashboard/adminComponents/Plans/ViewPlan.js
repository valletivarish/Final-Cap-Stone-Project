import React, { useState, useEffect, useCallback } from "react";
import {
  getAllPlans,
  activatePlan,
  deactivatePlan,
} from "../../../../services/gaurdianLifeAssuranceServices";
import Table from "../../../../sharedComponents/Table/Table";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  showToastError,
  showToastSuccess,
} from "../../../../utils/toast/Toast";
import { sanitizePlanData } from "../../../../utils/helpers/SanitizeData";
import { verifyAdmin, verifyEmployee } from "../../../../services/authServices";
import "./ViewPlan.css";
import { Helper } from "../../../../utils/helpers/Helper";

const ViewPlan = ({ setRefreshNavbar }) => {
  const [plans, setPlans] = useState([]);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isVerified, setIsVerified] = useState(false);

  const page = parseInt(searchParams.get("page")) || 0;
  const size = parseInt(searchParams.get("size")) || 10;

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

  const fetchPlans = async () => {
    try {
      if (!isVerified) return;
      const response = await getAllPlans({page, size});
      const sanitizedData = sanitizePlanData(response, handleEdit, handleToggleStatus);
      setPlans(sanitizedData);
    } catch (err) {
      setError("Failed to fetch plans");
      showToastError("Failed to fetch plans");
    }
  };

  useEffect(() => {
    fetchPlans();
  }, [searchParams, isVerified]);

  const getRoleLink = (link = "") => {
    return Helper.getRoleLink(localStorage.getItem("role"), null, link);
  };

  const handleEdit = (planId, data) => {
    const navigationLink = getRoleLink(`/plans/${planId}/edit`);
    navigate(navigationLink, { state: { data } });
  };

  const handleToggleStatus = async (planId, isActive) => {
    try {
      if (isActive) {
        const response = await deactivatePlan(planId);
        showToastSuccess(response);
      } else {
        const response = await activatePlan(planId);
        showToastSuccess(response);
      }
      setRefreshNavbar((prev) => !prev);
      fetchPlans();
    } catch (err) {
      console.log(err);
      showToastError(`Failed to ${isActive ? "deactivate" : "activate"} plan`);
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      {isVerified && (
        <div className="view-plans-container">
          <h1 className="view-plans-header">View Insurance Plans</h1>
          <Table
            data={plans || []}
            searchParams={searchParams}
            setSearchParams={setSearchParams}
          />
        </div>
      )}
    </>
  );
};

export default ViewPlan;
