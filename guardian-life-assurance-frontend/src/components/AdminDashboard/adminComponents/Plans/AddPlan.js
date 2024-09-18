import React, { useEffect, useState } from "react";
import "./AddPlan.css";
import { addPlan } from "../../../../services/adminServices";
import {
  showToastSuccess,
  showToastError,
} from "../../../../utils/toast/Toast";
import { capitalizeWords } from "../../../../utils/helpers/CapitilizeData";
import { verifyAdmin } from "../../../../services/authServices";
import { useNavigate } from "react-router-dom";

const AddPlan = ({ setRefreshNavbar }) => {
  const navigate = useNavigate();
  const [planName, setPlanName] = useState("");
  const [isActive, setIsActive] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const verify = async () => {
      const response = await verifyAdmin();
      if (!response) {
        navigate("/login");
        return;
      } else {
        setIsAdmin(true);
      }
    };
    verify();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const planData = {
      planName: capitalizeWords(planName),
      active: isActive === "true",
    };

    try {
      const response = await addPlan(planData);
      showToastSuccess(response);
      setRefreshNavbar((prev) => !prev);
      setPlanName("");
      setIsActive("");
    } catch (error) {
      showToastError("Failed to add plan");
      console.error(error);
    }
  };

  return (
    <>
      {isAdmin && (
        <div className="add-plan-container">
          <h2>Add New Plan</h2>
          <form onSubmit={handleSubmit} className="add-plan-form">
            <div className="form-group">
              <label htmlFor="planName">Plan Name</label>
              <input
                type="text"
                id="planName"
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
                placeholder="Enter plan name"
                className="input-field"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="isActive">Active</label>
              <select
                id="isActive"
                value={isActive}
                onChange={(e) => setIsActive(e.target.value)}
                className="input-field"
                required
              >
                <option value="">Select status</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>

            <button type="submit" className="submit-button">
              Add Plan
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default AddPlan;
