import React, { useState, useEffect } from "react";
import { updateAgent } from "../../../../services/gaurdianLifeAssuranceServices";
import { getAgentProfile } from "../../../../services/agentServices";

import "./AgentProfile.css";
import {
  showToastSuccess,
  showToastError,
} from "../../../../utils/toast/Toast";
import { verifyAgent } from "../../../../services/authServices";
import { useNavigate } from "react-router-dom";

const AgentProfile = () => {
  const [agentData, setAgentData] = useState({
    agentId: "",
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    houseNo: "",
    apartment: "",
    pincode: "",
  });
  const [loading, setLoading] = useState(true);
  const [isAgent, setIsAgent] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const verifyAgentAndNavigate = async () => {
      try {
        const response = await verifyAgent();
        if (!response) {
          navigate("/");
          return;
        } else {
          setIsAgent(true);
        }
      } catch (error) {
        navigate("/");
      }
    };
    verifyAgentAndNavigate();
  }, []);

  useEffect(() => {
    const fetchAgentData = async () => {
      try {
        const response = await getAgentProfile();
        setAgentData(response);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching agent data:", error);
        setLoading(false);
      }
    };

    fetchAgentData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAgentData({ ...agentData, [name]: value });
  };

  const handleSave = async () => {
    try {
      await updateAgent(agentData);
      showToastSuccess("Agent details updated successfully!");
    } catch (error) {
      showToastError("Failed to update agent details.");
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      {isAgent && (
        <div className="agent-profile-container">
          <h2>Agent Profile</h2>

          <div className="form-group">
            <label>Agent ID:</label>
            <input
              type="text"
              name="agentId"
              value={agentData.agentId}
              readOnly
            />
          </div>

          <div className="form-group">
            <label>First Name:</label>
            <input
              type="text"
              name="firstName"
              value={agentData.firstName || ""}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>Last Name:</label>
            <input
              type="text"
              name="lastName"
              value={agentData.lastName || ""}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={agentData.email || ""}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>Username:</label>
            <input
              type="text"
              name="username"
              value={agentData.username || ""}
              readOnly
            />
          </div>

          <div className="form-group">
            <label>House No:</label>
            <input
              type="text"
              name="houseNo"
              value={agentData.houseNo || ""}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>Apartment:</label>
            <input
              type="text"
              name="apartment"
              value={agentData.apartment || ""}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>Pincode:</label>
            <input
              type="text"
              name="pincode"
              value={agentData.pincode || ""}
              onChange={handleInputChange}
            />
          </div>

          <button className="button activate" onClick={handleSave}>
            Save
          </button>
        </div>
      )}
    </>
  );
};

export default AgentProfile;
