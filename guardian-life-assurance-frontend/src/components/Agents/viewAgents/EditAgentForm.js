import React, { useState, useEffect } from "react";
import { getAgentById, updateAgent } from "../../../services/gaurdianLifeAssuranceServices";
import { useParams, useNavigate } from "react-router-dom";
import './EditAgentForm.css'
import { Helper } from "../../../utils/helpers/Helper";
import BackButton from "../../../sharedComponents/Button/BackButton"

const EditAgentForm = () => {
  const { agentId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    agentId: agentId,
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    houseNo: "",
    apartment: "",
    pincode: "",
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAgentData = async () => {
      try {
        const data = await getAgentById(agentId);
        setFormData({
          agentId: agentId,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          username: data.username,
          houseNo: data.houseNo,
          apartment: data.apartment,
          pincode: data.pincode,
        });
      } catch (error) {
        setError("Failed to load agent data");
      }
    };

    fetchAgentData();
  }, [agentId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const getRoleLink = (link = "") => {
    return Helper.getRoleLink(localStorage.getItem("role"), null,link);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateAgent(formData);
      const roleBasedLink = getRoleLink(`/agents`);
        navigate(roleBasedLink);
    } catch (error) {
      setError("Failed to update agent details");
    }
  };

  return (
    <div className="agent-container">
      <div className="agent-card">
        <BackButton/>
        <h1 className="agent-header">Edit Agent</h1>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className="agent-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className="agent-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="agent-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="agent-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="houseNo">House No</label>
            <input
              type="text"
              id="houseNo"
              name="houseNo"
              value={formData.houseNo}
              onChange={handleInputChange}
              className="agent-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="apartment">Apartment</label>
            <input
              type="text"
              id="apartment"
              name="apartment"
              value={formData.apartment}
              onChange={handleInputChange}
              className="agent-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="pincode">Pincode</label>
            <input
              type="text"
              id="pincode"
              name="pincode"
              value={formData.pincode}
              onChange={handleInputChange}
              className="agent-input"
            />
          </div>

          <div className="center">
            <button type="submit" className="agent-button">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAgentForm;
