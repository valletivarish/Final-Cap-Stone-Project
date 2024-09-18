import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { updatePlan } from "../../../../services/gaurdianLifeAssuranceServices";
import { showToastSuccess, showToastError } from "../../../../utils/toast/Toast";
import { Helper } from "../../../../utils/helpers/Helper";
import "./EditPlan.css";

const EditPlan = () => {
  const { planId } = useParams();
  const location = useLocation();
  const { data } = location.state;
  const [planName, setPlanName] = useState(data.planName);
  const [isActive, setIsActive] = useState(data.active);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedPlan = { planId: data.planId, planName, active: isActive };
      const response=await updatePlan(updatedPlan);
      showToastSuccess(response);
      navigate(getRoleLink("/plans"));
    } catch (error) {
      showToastError("Failed to update plan.");
    }
  };
  const getRoleLink = (link = "") => {
    return Helper.getRoleLink(localStorage.getItem("role"), null,link);
  };

  return (
    <div className="plan-container">
      <h2>Edit Plan</h2>
      <form onSubmit={handleSubmit} className="plan-form">
        <div className="form-group">
          <label htmlFor="planName">Plan Name</label>
          <input
            type="text"
            id="planName"
            value={planName}
            onChange={(e) => setPlanName(e.target.value)}
            className="input-field"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="isActive">Active</label>
          <select
            id="isActive"
            value={isActive ? "true" : "false"}
            onChange={(e) => setIsActive(e.target.value === "true")}
            className="input-field"
            required
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>

        <button type="submit" className="submit-button">
          Update Plan
        </button>
      </form>
    </div>
  );
};

export default EditPlan;
