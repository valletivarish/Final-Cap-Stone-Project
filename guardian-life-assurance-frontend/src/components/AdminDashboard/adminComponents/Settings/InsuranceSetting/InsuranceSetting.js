import React, { useState } from "react";
import "./InsuranceSetting.css";
import { createInsuranceSetting } from "../../../../../services/adminServices";
import { showToastError, showToastSuccess } from "../../../../../utils/toast/Toast";
import { verifyAdmin } from "../../../../../services/authServices";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const InsuranceSetting = () => {
  const [claimDeduction, setClaimDeduction] = useState("");
  const [penaltyAmount, setPenaltyAmount] = useState("");
  const navigate = useNavigate();
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

  const handleClaimDeductionChange = (e) => {
    setClaimDeduction(e.target.value);
  };

  const handlePenaltyAmountChange = (e) => {
    setPenaltyAmount(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(claimDeduction<=0){
      showToastError("Claim Deduction should be greater than 0");
      return;
    }
    if(penaltyAmount<=0){
      showToastError("Penalty Amount should be greater than 0");
      return;
      }

    try {
      const response = await createInsuranceSetting({
        claimDeduction,
        penaltyAmount,
      });
      showToastSuccess(response);
    } catch (error) {
      console.error("Error saving insurance setting:", error);
    }
  };

  return (
    <>
      {isAdmin && (
        <div className="insurance-settings-card">
          <h1 className="insurance-settings-header">Insurance Settings</h1>
          <form onSubmit={handleSubmit} className="insurance-settings-form">
            <div className="form-group">
              <label htmlFor="claimDeduction">Claim Deduction Percentage</label>
              <input
                type="number"
                id="claimDeduction"
                name="claimDeduction"
                value={claimDeduction}
                onChange={handleClaimDeductionChange}
                placeholder="Enter claim deduction percentage"
                className="form-input"
                min="0"
                step={0.1}
              />
            </div>
            <div className="form-group">
              <label htmlFor="penaltyAmount">Penalty Deduction Percentage</label>
              <input
                type="number"
                id="penaltyAmount"
                name="penaltyAmount"
                value={penaltyAmount}
                onChange={handlePenaltyAmountChange}
                placeholder="Enter penalty deduction percentage"
                className="form-input"
                min="0"
                step={0.1}
              />
            </div>
            <button type="submit" className="submit-button">
              Save
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default InsuranceSetting;
