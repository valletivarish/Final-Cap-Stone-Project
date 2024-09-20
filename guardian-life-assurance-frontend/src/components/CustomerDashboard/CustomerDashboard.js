import React, { useEffect, useState } from "react";
import {
  FaUser,
  FaFolder,
  FaFileInvoice,
  FaQuestionCircle,
  FaPen,
  FaKey,
} from "react-icons/fa";
import Card from "../../sharedComponents/Card/Card";
import "./CustomerDashboard.css";
import { verifyCustomer } from "../../services/authServices";
import { useNavigate } from "react-router-dom";

const CustomerDashboard = () => {
  const firstName = localStorage.getItem("firstName");
  const lastName = localStorage.getItem("lastName");
  const navigate = useNavigate();
  const [isCustomer, setIsCustomer] = useState(false);

  useEffect(() => {
    const verifyCustomerAndNavigate = async () => {
      try {
        const response = await verifyCustomer();
        if (!response) {
          navigate("/login");
          return;
        } else {
          setIsCustomer(true);
        }
      } catch (error) {
        navigate("/login");
      }
    };
    verifyCustomerAndNavigate();
  }, []);

  return (
    <>
      {isCustomer && (
        <div className="customer-dashboard-container">
          <h1 style={{ marginTop: "50px", marginBottom: "20px" }}>
            Welcome to the Customer Dashboard, {firstName} {lastName}!
          </h1>
          <p style={{ textAlign: "center", fontSize: "23px" }}>
            Here are your dashboard options
          </p>

          <div className="customer-dashboard">
            <Card
              icon={FaUser}
              title="Profile"
              subText="Manage your profile"
              link="profile"
              className="profile"
            />

            <Card
              icon={FaFolder}
              title="Documents"
              subText="Manage your documents"
              link="documents"
              className="documents"
            />

            <Card
              icon={FaFileInvoice}
              title="Insurance Account"
              subText="View your insurance account"
              link="policies"
              className="insurance-account"
            />

            <Card
              icon={FaQuestionCircle}
              title="Queries"
              subText="View your queries"
              link="queries"
              className="queries"
            />

            <Card
              icon={FaPen}
              title="Create Query"
              subText="Submit a new query"
              link="queries/new"
              className="create-query"
            />

            <Card
              icon={FaKey}
              title="Change Password"
              subText="Update your password"
              link="profile/change-password"
              className="change-password"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default CustomerDashboard;
