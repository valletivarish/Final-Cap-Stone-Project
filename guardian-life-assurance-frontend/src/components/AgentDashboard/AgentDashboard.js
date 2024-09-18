import React, { useEffect, useState } from "react";
import { FaUser, FaBullhorn, FaUsers, FaFileInvoice, FaMoneyCheck, FaFileAlt, FaClipboardList, FaMoneyBillWave } from "react-icons/fa";
import Card from "../../sharedComponents/Card/Card";
import "./AgentDashboard.css";
import { Helper } from "../../utils/helpers/Helper";

const AgentDashboard = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  useEffect(() => {
    setFirstName(localStorage.getItem("firstName"));
    setLastName(localStorage.getItem("lastName"));
  }, []);

  const getRoleLink = (link = "") => {
    return Helper.getRoleLink(localStorage.getItem("role"),null, link);
  };

  return (
    <div className="agent-dashboard-container">
      <h1 style={{ marginTop: "50px", marginBottom: "20px" }}>
        Welcome to the Agent Dashboard, {firstName} {lastName}!
      </h1>
      <p style={{ textAlign: "center", fontSize: "23px" }}>
        Here are the options for your overview:
      </p>
      <div className="agent-dashboard">
        <Card
          icon={FaUser}
          title="Profile"
          subText="View and update your profile"
          link={getRoleLink("/profile")}
          className="profile"
        />
        <Card
          icon={FaBullhorn}
          title="Marketing"
          subText="View marketing strategies"
          link={getRoleLink("/marketing")}
          className="marketing"
        />
        <Card
          icon={FaUsers}
          title="View Customers"
          subText="List of customers"
          link={getRoleLink("/customers")}
          className="customers"
        />
        <Card
          icon={FaFileInvoice}
          title="Insurance Accounts"
          subText="Manage insurance accounts"
          link={getRoleLink("/policies")}
          className="insuranceAccounts"
        />
        <Card
          icon={FaMoneyCheck}
          title="Policy Payments"
          subText="View policy payments"
          link={getRoleLink("/policies/payments")}
          className="policyPayments"
        />
        <Card
          icon={FaFileAlt}
          title="Policy Claims"
          subText="View policy claims"
          link={getRoleLink("/policies/claims")}
          className="policyClaims"
        />
        <Card
          icon={FaClipboardList}
          title="View Commissions"
          subText="View commissions earned"
          link={getRoleLink("/commissions")}
          className="commissions"
        />
        <Card
          icon={FaMoneyBillWave}
          title="Withdrawals"
          subText="View and request withdrawals"
          link={getRoleLink("/commissions-withdrawals")}
          className="withdrawals"
        />
      </div>
    </div>
  );
};

export default AgentDashboard;
