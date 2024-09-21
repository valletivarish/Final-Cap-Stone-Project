import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Modal from "react-modal";
import {
  cancelPolicy,
  fetcByPolicyId,
  initiateInstallmentCheckout,
  downloadReceipt,
  claimPolicy,
} from "../../../../services/insuranceManagementServices";
import {
  showToastError,
  showToastSuccess,
} from "../../../../utils/toast/Toast";
import { verifyCustomer } from "../../../../services/authServices";

const PolicyDetailPage = () => {
  const { customerId, policyId } = useParams();
  const [policyData, setPolicyData] = useState(null);
  const [isMaturityEnabled, setIsMaturityEnabled] = useState(false);
  const [isClaimEnabled, setIsClaimEnabled] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [claimReason, setClaimReason] = useState("");
  const [claimAmount, setClaimAmount] = useState("");
  const [document, setDocument] = useState(null);

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

  const handlePay = async (installmentId, amountDue, event) => {
    event.preventDefault();
    console.log(`Initiating payment for installment ID: ${installmentId}`);
    console.log(
      `CustomerId: ${customerId}, InstallmentId: ${installmentId}, AmountDue: ${amountDue}`
    );

    if (!customerId || !installmentId) {
      console.error("CustomerId or InstallmentId is missing!");
      return;
    }

    try {
      const response = await initiateInstallmentCheckout(
        customerId,
        policyId,
        installmentId,
        amountDue
      );
      window.location.href = response;
    } catch (error) {
      console.error("Error creating checkout session:", error);
    }
  };

  const fetchData = async () => {
    try {
      const data = await fetcByPolicyId(customerId, policyId);
      setPolicyData(data);
      const today = new Date().toISOString().split("T")[0];
      if (
        data.maturityDate === today &&
        policyData.policyStatus === "COMPLETE"
      ) {
        setIsMaturityEnabled(true);
      }

      if (data.policyStatus === "PENDING" || data.policyStatus === "COMPLETE") {
        setIsClaimEnabled(true);
      }
    } catch (error) {
      console.error("Error fetching policy details:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [customerId, policyId]);

  const isNextInstallmentToPay = (index) => {
    const pendingIndex = policyData.installments.findIndex(
      (installment) => installment.status === "PENDING"
    );
    return index === pendingIndex;
  };

  const isPayDisabled = (installment) => {
    return (
      policyData.policyStatus === "DROPPED" || installment.status === "PAID"
    );
  };

  const handleDownloadReceipt = async (installmentId) => {
    try {
      await downloadReceipt(installmentId);
    } catch (error) {
      console.error("Error downloading receipt:", error);
    }
  };
  const handleCancel = async () => {
    try {
      await cancelPolicy(customerId, policyId);
      showToastSuccess("Policy Cancelled successfully");
      fetchData();
      setIsClaimEnabled(false);
    } catch (error) {
      console.error("Error canceling policy:", error);
    }
  };
  const handleClaimPolicy = async () => {
    setModalIsOpen(true);
  };

  const handleMaturityClaim = async () => {
    try {
      // await maturityClaimPolicy(customerId, policyId);
      showToastSuccess("Maturity claim processed successfully");
    } catch (error) {
      showToastError("Error processing maturity claim: " + error.message);
    }
  };
  const handleClaimSubmit = async (e) => {
    e.preventDefault();
    const payLoad = {
      policyNo: policyId,
      claimAmount: claimAmount,
      claimReason: claimReason,
      document: document,
    };
    try {
      await claimPolicy(customerId, payLoad);
      showToastSuccess("Claim submitted successfully");
      setModalIsOpen(false);
    } catch (error) {
      showToastError("Error submitting claim: " + error.message);
    }
  };

  return (
    <div className="table-container">
      <h1>Policy Details</h1>

      {policyData ? (
        <>
          <h2>Customer Details</h2>
          <table className="table">
            <tbody>
              <tr>
                <th>Customer Name</th>
                <td>{policyData.customerName}</td>
              </tr>
              <tr>
                <th>City</th>
                <td>{policyData.customerCity}</td>
              </tr>
              <tr>
                <th>State</th>
                <td>{policyData.customerState}</td>
              </tr>
              <tr>
                <th>Email</th>
                <td>{policyData.email}</td>
              </tr>
              <tr>
                <th>Phone Number</th>
                <td>{policyData.phoneNumber}</td>
              </tr>
            </tbody>
          </table>

          <h2>Policy Account Details</h2>
          <table className="table">
            <tbody>
              <tr>
                <th>Policy No</th>
                <td>{policyData.policyNo}</td>
              </tr>
              <tr>
                <th>Insurance Plan</th>
                <td>{policyData.insurancePlan}</td>
              </tr>
              <tr>
                <th>Insurance Scheme</th>
                <td>{policyData.insuranceScheme}</td>
              </tr>
              <tr>
                <th>Date Created</th>
                <td>{policyData.dateCreated}</td>
              </tr>
              <tr>
                <th>Maturity Date</th>
                <td>{policyData.maturityDate}</td>
              </tr>
              <tr>
                <th>Policy Status</th>
                <td>{policyData.policyStatus}</td>
              </tr>
            </tbody>
          </table>
          
          <div
            className="policydetail-action-buttons"
            style={{ display: "flex", justifyContent: "center" }}
          >
            {isClaimEnabled && (
              <button className="button deactivate" onClick={handleClaimPolicy}>
                Claim Policy
              </button>
            )}
            {isMaturityEnabled && (
              <button className="button activate" onClick={handleMaturityClaim}>
                Maturity Claim
              </button>
            )}
          </div>
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={() => setModalIsOpen(false)}
            contentLabel="Claim Policy"
            style={{
              content: {
                top: "50%",
                left: "50%",
                right: "auto",
                bottom: "auto",
                marginRight: "-50%",
                transform: "translate(-50%, -50%)",
                width: "40%",
                padding: "20px",
                borderRadius: "10px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              },
              overlay: {
                backgroundColor: "rgba(0, 0, 0, 0.75)",
              },
            }}
          >
            <h2
              style={{
                textAlign: "center",
                marginBottom: "20px",
                fontSize: "1.5rem",
              }}
            >
              Submit Claim
            </h2>
            <form onSubmit={handleClaimSubmit}>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", fontWeight: "bold" }}>
                  Policy No:
                </label>
                <span>{policyId}</span>
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", fontWeight: "bold" }}>
                  Claim Reason
                </label>
                <input
                  type="text"
                  value={claimReason}
                  onChange={(e) => setClaimReason(e.target.value)}
                  required
                  style={{
                    width: "95%",
                    padding: "10px",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                  }}
                />
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", fontWeight: "bold" }}>
                  Claim Amount
                </label>
                <input
                  type="number"
                  value={claimAmount}
                  onChange={(e) => setClaimAmount(e.target.value)}
                  required
                  style={{
                    width: "95%",
                    padding: "10px",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                  }}
                />
              </div>
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontWeight: "bold" }}>
                  Upload Document
                </label>
                <input
                  type="file"
                  onChange={(e) => setDocument(e.target.files[0])}
                  required
                  style={{
                    width: "95%",
                    padding: "10px",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                  }}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <button
                  type="submit"
                  className="button activate"
                  style={{
                    padding: "10px 20px",
                    border: "none",
                    borderRadius: "5px",
                    backgroundColor: "#4CAF50",
                    color: "#fff",
                    cursor: "pointer",
                    fontWeight: "bold",
                    fontSize: "1rem",
                  }}
                >
                  Submit Claim
                </button>
                <button
                  type="button"
                  className="button deactivate"
                  onClick={() => setModalIsOpen(false)}
                  style={{
                    padding: "10px 20px",
                    border: "none",
                    borderRadius: "5px",
                    backgroundColor: "#f44336",
                    color: "#fff",
                    cursor: "pointer",
                    fontWeight: "bold",
                    fontSize: "1rem",
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </Modal>
          <h2>Nominee Details</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Nominee Name</th>
                <th>Relationship</th>
              </tr>
            </thead>
            <tbody>
              {policyData.nominees.map((nominee, index) => (
                <tr key={index}>
                  <td>{nominee.nomineeName}</td>
                  <td>{nominee.relationship}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <h2>Premium Details</h2>
          <table className="table">
            <tbody>
              <tr>
                <th>Premium Type</th>
                <td>{policyData.premiumType}</td>
              </tr>
              <tr>
                <th>Premium Amount</th>
                <td>{policyData.premiumAmount}</td>
              </tr>
              <tr>
                <th>Profit Ratio</th>
                <td>{policyData.profitRatio}%</td>
              </tr>
              <tr>
                <th>Sum Assured</th>
                <td>{policyData.sumAssured}</td>
              </tr>
            </tbody>
          </table>

          <h2>Installments</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Installment ID</th>
                <th>Due Date</th>
                <th>Payment Date</th>
                <th>Amount Due</th>
                <th>Amount Paid</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {policyData.installments.map((installment, index) => (
                <tr key={installment.installmentId}>
                  <td>{installment.installmentId}</td>
                  <td>{installment.dueDate}</td>
                  <td>{installment.paymentDate || "Not Paid"}</td>
                  <td>{installment.amountDue}</td>
                  <td>{installment.amountPaid || "Not Paid"}</td>
                  <td>{installment.status}</td>
                  <td>
                    {installment.status === "PAID" ? (
                      <button
                        className="button activate"
                        onClick={() =>
                          handleDownloadReceipt(installment.installmentId)
                        }
                      >
                        View Receipt
                      </button>
                    ) : (
                      <button
                        className={
                          isPayDisabled(installment) ||
                          !isNextInstallmentToPay(index)
                            ? "button disabled"
                            : "button edit"
                        }
                        onClick={(event) =>
                          handlePay(
                            installment.installmentId,
                            installment.amountDue,
                            event
                          )
                        }
                        disabled={
                          isPayDisabled(installment) ||
                          !isNextInstallmentToPay(index)
                        }
                      >
                        Pay
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {policyData.policyStatus == "PENDING" && (
            <div className="cancel-button-container">
              <button className="button cancel" onClick={handleCancel}>
                Cancel Policy
              </button>
            </div>
          )}
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default PolicyDetailPage;
