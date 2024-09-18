import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import "./Navbar.css";
import { useParams } from "react-router-dom";
import { Helper } from "../../utils/helpers/Helper";
import { getAllPlans } from "../../services/gaurdianLifeAssuranceServices";
import { getPlanCount } from "../../services/insuranceManagementServices";

const Navbar = ({ role, setRole,refreshNavbar }) => {
  const [plans, setPlans] = useState([]);
  const navigate = useNavigate();
  const { customerId } = useParams();

  useEffect(() => {
    if( role==="admin" || role==="customer"){
      const fetchPlans = async () => {
        try {
          const count=await getPlanCount();
          const response = await getAllPlans({size:count});
          setPlans(response.content);
        } catch (error) {
          console.error("Error fetching plans:", error);
        }
      };
      fetchPlans();
    }
  }, [refreshNavbar,role]);

  const insurancePlans = () => {
    return plans
      .filter((plan) => plan.active)
      .map((plan) => (
        <Link to={`admin-dashboard/plans/${plan.planId}/schemes/new`} key={plan.planId}>
          {plan.planName}
        </Link>
      ));
  };
  const customerPlans = () => {
    return plans
      .filter((plan) => plan.active)
      .map((plan) => (
        <Link to={getRoleLink(`/plans/${plan.planId}`)} key={plan.planId}>
          {plan.planName}
        </Link>
      ));
  };


  const getRoleLink = (link = "") => {
    return Helper.getRoleLink(role,customerId, link);
  };

  const handleLogout = () => {
    localStorage.clear();
    setRole(null);
    navigate("/");
  };

  const defaultLinks = () => (
    <>
      <li className="active">
        <Link to="/">Home</Link>
      </li>
      <li>
        <a href="#about-us">About Us</a>
      </li>
      <li>
        <Link to="/login">Login</Link>
      </li>
      <li>
        <Link to="/register">Customer Registration</Link>
      </li>
      <li>
        <Link to="/contact">Contact</Link>
      </li>
    </>
  );

  const renderLinks = () => {
    switch (role) {
      case "admin":
        return (
          <>
            <li>
              <Link to={getRoleLink()}>Dashboard</Link>
            </li>
            <li className="dropdown">
              <span>Insurance</span>
              <div className="dropdown-content">
                <Link to={getRoleLink("/customers")}>View Customers</Link>
                <Link to={getRoleLink("/policies")}>Insurance Account</Link>
                <Link to={getRoleLink("/policies/payments")}>View Policy Payment</Link>
                <Link to={getRoleLink("/policies/claims")}>View Policy Claim</Link>
              </div>
            </li>
            <li className="dropdown">
              <span>Agents</span>
              <div className="dropdown-content">
                <Link to={getRoleLink("/agents/new")}>Add Agent</Link>
                <Link to={getRoleLink("/agents")}>View Agents</Link>
                <Link to={getRoleLink("/commissions")}>View Commissions</Link>
                <Link to={getRoleLink("/commissions-withdrawals")}>View Commissions Withdrawals</Link>
              </div>
            </li>
            <li className="dropdown">
              <span>Insurance Plans</span>
              <div className="dropdown-content">
                <Link to={getRoleLink("/plans/new")}>Add Plan</Link>
                <Link to={getRoleLink("/plans")}>View Plans</Link>
                <div className="dropdown-right">
                  <Link to="#" className="dropdown-link">Add Scheme {">"}</Link>
                  <div className="dropdown-content-right">
                    {insurancePlans()}
                  </div>
                </div>
                <Link to={getRoleLink("/schemes")}>View Schemes</Link>
              </div>
            </li>
            <li className="dropdown">
              <Link to="#">Settings</Link>
              <div className="dropdown-content">
                <Link to={getRoleLink("/settings/tax")}>Tax Settings</Link>
                <Link to={getRoleLink("/settings/insurance")}>Insurance Settings</Link>
                <Link to={getRoleLink("/settings/states")}>View States</Link>
                <Link to={getRoleLink("/settings/cities")}>View Cities</Link>
              </div>
            </li>
            <li>
              <Link to="#">Account</Link>
              <div className="dropdown-content">
                <Link to={getRoleLink("/employees/new")}>Add Employee</Link>
                <Link to={getRoleLink("/employees")}>View Employees</Link>
                <Link to={getRoleLink("/profile")}>Profile</Link>
                <Link to={getRoleLink("/profile/change-password")}>Change Password</Link>
              </div>
            </li>
            <li>
              <span onClick={handleLogout} style={{ cursor: "pointer" }}>
                Logout
              </span>
            </li>
          </>
        );
      case "employee":
        return (
          <>
            <li>
              <Link to={getRoleLink()}>Dashboard</Link>
            </li>
            <li className="dropdown">
              <span>Agents</span>
              <div className="dropdown-content">
                <Link to={getRoleLink("/agents/new")}>Add Agent</Link>
                <Link to={getRoleLink("/agents")}>View Agents</Link>
                <Link to={getRoleLink("/commissions")}>View Commissions</Link>
                <Link to={getRoleLink("/commissions-withdrawals")}>View Commissions Withdrawals</Link>
              </div>
            </li>
            <li className="dropdown">
              <span>Insurance</span>
              <div className="dropdown-content">
                <Link to={getRoleLink("/customers")}>View Customers</Link>
                <Link to={getRoleLink("/policies")}>Insurance Account</Link>
                <Link to={getRoleLink("/policies/payments")}>View Policy Payment</Link>
                <Link to={getRoleLink("/policies/claims")}>View Policy Claim</Link>
              </div>
            </li>
            <li>
              <span style={{ cursor: "pointer" }}>
                Account
              </span>
              <div className="dropdown-content">
                <Link to={getRoleLink("/profile")}>Profile</Link>
                <Link to={getRoleLink("/profile/change-password")}>Change Password</Link>
              </div>
            </li>
            <li>
              <span onClick={handleLogout} style={{ cursor: "pointer" }}>
                Logout
              </span>
            </li>
          </>
        );
      case "agent":
        return (
          <>
            <li>
              <Link to={getRoleLink()}>Dashboard</Link>
            </li>
            <li className="dropdown">
              <span>Commissions</span>
              <div className="dropdown-content">
                <Link to={getRoleLink("/commissions")}>View Commission</Link>
                <Link to={getRoleLink("/commissions-withdrawals")}>View Commission Withdrawals</Link>
                <Link to={getRoleLink("/earnings-history")}>View Earnings</Link>
                <Link to={getRoleLink("/commission-withdrawal")}>Withdrawal Amount</Link>
              </div>
            </li>
            <li className="dropdown">
              <Link to={getRoleLink("/marketing")}>Marketing</Link>
            </li>
            <li className="dropdown">
              <Link to="#">Insurance</Link>
              <div className="dropdown-content">
                <Link to={getRoleLink("/customers")}>View Customers</Link>
                <Link to={getRoleLink("/policies")}>Insurance Account</Link>
                <Link to={getRoleLink("/policies/payments")}>View Policy Payments</Link>
                <Link to={getRoleLink("/policies/claims")}>View Policy Claims</Link>
              </div>
            </li>
            <li>
              <span style={{ cursor: "pointer" }}>
                Account
              </span>
              <div className="dropdown-content">
                <Link to={getRoleLink("/profile")}>Profile</Link>
                <Link to={getRoleLink("/profile/change-password")}>Change Password</Link>
              </div>
            </li>
            <li>
              <span onClick={handleLogout} style={{ cursor: "pointer" }}>
                Logout
              </span>
            </li>
          </>
        );
      case "customer":
        return (
          <>
          <li>
              <Link to={getRoleLink("")}>Dashboard</Link>
            </li>
            <li className="dropdown">
              <span>Customer Profile</span>
              <div className="dropdown-content">
                <Link to={getRoleLink("/profile")}>Profile</Link>
                <Link to={getRoleLink("/documents")}>Documents</Link>
                <Link to={getRoleLink("/profile/change-password")}>Change Password</Link>
              </div>
            </li>
            <li>
              <Link to="#">Insurance Plans</Link>
              <div className="dropdown-content">
                {customerPlans()}
              </div>
            </li>
            <li>
              <Link to={getRoleLink(`/policies`)}>Insurance Account</Link>
            </li>
            <li>
              <span onClick={handleLogout} style={{ cursor: "pointer" }}>
                Logout
              </span>
            </li>
          </>
        );
      default:
        return defaultLinks();
    }
  };


  return (
    <header className="navbar">
      <div className="navbar-top">
        <div className="navbar-logo">
          <h2>Guardian Life Assurance</h2>
        </div>
        {role && (
          <ul className="navbar-profile">
            <li>
              <Link to={getRoleLink("/profile")}>
                <FaUser />
                <span>Profile</span>
              </Link>
            </li>
          </ul>
        )}
      </div>

      <nav className="navbar-bottom">
        <ul className="navbar-menu">{renderLinks()}</ul>
      </nav>
    </header>
  );
};

export default Navbar;
