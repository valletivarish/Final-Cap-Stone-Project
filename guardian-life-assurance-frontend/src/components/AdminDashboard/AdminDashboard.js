import React, { useEffect, useState } from "react";
import {
  FaCity,
  FaMoneyCheck,
  FaUniversity,
  FaFileAlt,
  FaFileInvoice,
  FaSitemap,
  FaClipboardList,
  FaClipboardCheck,
  FaThList,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getAdminDashboardCount } from "../../services/adminServices";
import Card from "../../sharedComponents/Card/Card";
import "./AdminDashboard.css";
import { verifyAdmin } from "../../services/authServices";

const AdminDashboard = () => {
  const [counts, setCounts] = useState({
    states: 0,
    cities: 0,
    claims: 0,
    policyAccounts: 0,
    payments: 0,
    commissions: 0,
    withdrawnCommissions: 0,
    plans: 0,
    schemes: 0,
  });
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  const adminName = "Admin";

  useEffect(() => {
    const verifyAndFetchCounts = async () => {
      try {
        const response = await verifyAdmin();
        if (!response) {
          navigate("/");
          return;
        } else {
          setIsAdmin(true);
          const count = await getAdminDashboardCount();
          setCounts(count);
        }
      } catch (error) {
        navigate("/");
      }
    };

    verifyAndFetchCounts();
  }, [navigate]);

  return (
    <>
      {isAdmin && (
        <div className="admin-dashboard-container">
          <h1 style={{ marginTop: "50px", marginBottom: "20px" }}>
            Welcome to the Admin Dashboard, {adminName}!
          </h1>
          <p style={{ textAlign: "center", fontSize: "23px" }}>
            Here are the statistics for your overview:
          </p>
          <div className="admin-dashboard">
            <Card
              icon={FaUniversity}
              title="States"
              count={counts.states}
              subText="No. of Records"
              link="settings/states"
            />
            <Card
              icon={FaCity}
              title="Cities"
              count={counts.cities}
              subText="No. of Records"
              link="settings/cities"
            />
            <Card
              icon={FaFileAlt}
              title="Claims"
              count={counts.claims}
              subText="No. of Records"
              link="policies/claims"
            />
            <Card
              icon={FaFileInvoice}
              title="Policy Accounts"
              count={counts.policyAccounts}
              subText="No. of Records"
              link="policies"
            />
            <Card
              icon={FaMoneyCheck}
              title="Payments"
              count={counts.payments}
              subText="No. of Records"
              link="policies/payments"
            />
            <Card
              icon={FaClipboardList}
              title="Commissions"
              count={counts.commissions}
              subText="No. of Records"
              link="commissions"
            />
            <Card
              icon={FaClipboardCheck}
              title="Withdrawn Commissions"
              count={counts.withdrawnCommissions}
              subText="No. of Records"
              link="commissions-withdrawals"
            />
            <Card
              icon={FaSitemap}
              title="Plans"
              count={counts.plans}
              subText="No. of Records"
              link="plans"
            />
            <Card
              icon={FaThList}
              title="Schemes"
              count={counts.schemes}
              subText="No. of Records"
              link="schemes"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default AdminDashboard;
