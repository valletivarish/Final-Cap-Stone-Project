import React, { useState, useEffect } from "react";
import {
  createWithdrawalRequest,
  getTotalCommission,
} from "../../../../services/agentServices";
import { verifyAgent } from "../../../../services/authServices";
import {
  showToastSuccess,
  showToastError,
} from "../../../../utils/toast/Toast";
import "./CommissionWithdrawal.css";
import { useNavigate } from "react-router-dom";

const CommissionWithdrawal = () => {
  const navigate = useNavigate();
  const [totalCommission, setTotalCommission] = useState(0);
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [isAgent, setIsAgent] = useState(false);
  useEffect(() => {
    const verify = async () => {
      const response = await verifyAgent();
      if (!response) {
        navigate("/login");
      } else {
        setIsAgent(true);
      }
    };
    verify();
  }, []);

  useEffect(() => {
    if(!isAgent){
      return;
    }
    fetchTotalCommission();
  }, [isAgent]);

  const fetchTotalCommission = async () => {
    try {
      const commission = await getTotalCommission();
      setTotalCommission(commission);
    } catch (error) {
      showToastError("Failed to fetch total commission.");
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawalAmount || withdrawalAmount <= 0) {
      showToastError("Please enter a valid withdrawal amount.");
      return;
    }

    if (withdrawalAmount > totalCommission) {
      showToastError("Withdrawal amount exceeds total commission.");
      return;
    }

    try {
      await createWithdrawalRequest(withdrawalAmount);
      showToastSuccess("Withdrawal request created successfully.");
      setWithdrawalAmount("");
      fetchTotalCommission();
    } catch (error) {
      showToastError("Failed to create withdrawal request.");
    }
  };

  return (
    <>
      {isAgent && (
        <div className="commission-withdrawal-container">
          <h2>Commission Withdrawal</h2>
          <p>
            Total Commission: <strong>₹{totalCommission}</strong>
          </p>
          <div className="form-group">
            <label>Withdrawal Amount</label>
            <input
              type="number"
              className="form-control"
              value={withdrawalAmount}
              onChange={(e) => setWithdrawalAmount(e.target.value)}
              placeholder="Enter amount to withdraw"
            />
          </div>
          <button className="button withdraw-button" onClick={handleWithdraw}>
            Withdraw
          </button>
        </div>
      )}
    </>
  );
};

export default CommissionWithdrawal;
