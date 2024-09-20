import React, { useState, useEffect } from "react";
import {
  getPlanCount,
  getSchemesByPlanId,
} from "../../../../services/insuranceManagementServices";
import { getAllPlans } from "../../../../services/gaurdianLifeAssuranceServices";
import { getCustomerById } from "../../../../services/customerServices";
import { useNavigate, useParams } from "react-router-dom";
import "./RecommendPlan.css";
import { sendRecommendationEmail } from "../../../../services/agentServices";
import {
  showToastSuccess,
  showToastError,
} from "../../../../utils/toast/Toast";
import { verifyAgent } from "../../../../services/authServices";

const RecommendPlan = () => {
  const { customerId } = useParams();
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [schemes, setSchemes] = useState([]);
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [schemeDetails, setSchemeDetails] = useState(null);
  const [customerDetails, setCustomerDetails] = useState(null);
  const [referralLink, setReferralLink] = useState("");
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
    const fetchPlans = async () => {
      try {
        const count = await getPlanCount();
        const response = await getAllPlans({ size: count });
        setPlans(response.content);
      } catch (error) {
        console.error("Error fetching plans:", error);
      }
    };
    fetchPlans();
  }, []);

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      try {
        const customer = await getCustomerById(customerId);
        setCustomerDetails(customer);
      } catch (error) {
        console.error("Error fetching customer details:", error);
      }
    };
    fetchCustomerDetails();
  }, [customerId]);

  const handlePlanChange = async (event) => {
    const planId = event.target.value;
    setSelectedPlan(planId);
    try {
      const response = await getSchemesByPlanId(planId);
      setSchemes(response);
      setReferralLink(
        `http://localhost:3000/customer-dashboard/${customerId}/plans/${planId}`
      );
    } catch (error) {
      console.error("Error fetching schemes:", error);
    }
  };

  const handleSchemeChange = (event) => {
    const schemeId = parseInt(event.target.value);
    const scheme = schemes.find((scheme) => scheme.schemeId === schemeId);
    setSelectedScheme(schemeId);
    setSchemeDetails(scheme);
  };
  const recommendPlan = async () => {
    try {
      await sendRecommendationEmail({
        customerId: customerId,
        recipientEmail: customerDetails.email,
        referralLink: referralLink,
        schemeId: selectedScheme,
      });
      showToastSuccess("Recommendation email sent successfully!");
    } catch (error) {
      showToastError("Failed to send recommendation email.");
    }
  };
  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  return (
    <>
      {isAgent && (
        <div className="recommend-plan-container">
          <h1 className="recommend-plan-header">Recommend a Plan</h1>

          <div className="card">
            {customerDetails && (
              <div className="customer-details">
                <h3>Customer Details</h3>
                <p>
                  <strong>Name:</strong> {customerDetails.firstName}{" "}
                  {customerDetails.lastName}
                </p>
                <p>
                  <strong>Email:</strong> {customerDetails.email}
                </p>
                <p>
                  <strong>Age:</strong>{" "}
                  {calculateAge(customerDetails.dateOfBirth)}
                </p>
                <p>
                  <strong>City:</strong> {customerDetails.city}
                </p>
              </div>
            )}
          </div>

          <div className="card">
            <label htmlFor="planSelect">Select Plan:</label>
            <select
              id="planSelect"
              value={selectedPlan}
              onChange={handlePlanChange}
              className="plan-selection-inputs"
            >
              <option value="">-- Select a Plan --</option>
              {plans.map((plan) => (
                <option key={plan.planId} value={plan.planId}>
                  {plan.planName}
                </option>
              ))}
            </select>

            {selectedPlan && (
              <>
                <label htmlFor="schemeSelect">Select Scheme:</label>
                <select
                  id="schemeSelect"
                  value={selectedScheme}
                  onChange={handleSchemeChange}
                  className="plan-selection-inputs"
                >
                  <option value="">-- Select a Scheme --</option>
                  {schemes.map((scheme) => (
                    <option key={scheme.schemeId} value={scheme.schemeId}>
                      {scheme.schemeName}
                    </option>
                  ))}
                </select>
              </>
            )}
          </div>

          {schemeDetails && (
            <div className="scheme-details-container">
              <h3 className="scheme-details-header">Scheme Details</h3>
              <p className="scheme-details-text">
                <strong>Name:</strong> {schemeDetails.schemeName}
              </p>
              <div
                className="scheme-description"
                dangerouslySetInnerHTML={{
                  __html: schemeDetails.detailDescription,
                }}
              />
              <p className="scheme-details-text">
                <strong>Min Amount:</strong> ₹{schemeDetails.minAmount}
              </p>
              <p className="scheme-details-text">
                <strong>Max Amount:</strong> ₹{schemeDetails.maxAmount}
              </p>
              <p className="scheme-details-text">
                <strong>Min Policy Term:</strong> {schemeDetails.minPolicyTerm}{" "}
                years
              </p>
              <p className="scheme-details-text">
                <strong>Max Policy Term:</strong> {schemeDetails.maxPolicyTerm}{" "}
                years
              </p>
              <p className="scheme-details-text">
                <strong>Min Age:</strong> {schemeDetails.minAge} years old
              </p>
              <p className="scheme-details-text">
                <strong>Max Age:</strong> {schemeDetails.maxAge} years old
              </p>
              <p className="scheme-details-text">
                <strong>Profit Ratio:</strong>{" "}
                {schemeDetails.profitRatio.toFixed(1)}%
              </p>
              <p className="scheme-details-text">
                <strong>Registration Commission Amount:</strong> ₹
                {schemeDetails.registrationCommAmount}
              </p>
              <p className="scheme-details-text">
                <strong>Installment Commission Ratio:</strong>{" "}
                {schemeDetails.installmentCommRatio.toFixed(1)}%
              </p>

              <div className="referral-link-container">
                <label htmlFor="referralLink">Referral Link:</label>
                <input
                  id="referralLink"
                  type="text"
                  value={referralLink}
                  readOnly
                  className="referral-link-input"
                />
              </div>

              <button className="recommend-button" onClick={recommendPlan}>
                Recommend Plan
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default RecommendPlan;
