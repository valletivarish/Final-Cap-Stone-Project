import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SuccessPage.css';

const SuccessPage = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [customerId, setCustomerId] = useState(null);
  const [policyId, setPolicyId] = useState(null);
  const [paymentVerified, setPaymentVerified] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionId) {
      verifyPayment(sessionId);
    }
  }, [sessionId]);

  const verifyPayment = async (sessionId) => {
    try {
      const response = await axios.post(
        'http://localhost:8080/guardian-life-assurance/checkout/payments/verify',
        { sessionId: sessionId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        }
      );
      if (response.data.customerId) {
        setCustomerId(response.data.customerId);
      }
      if (response.data.policyNo) {
        setPolicyId(response.data.policyNo);
      }
      setPaymentVerified(true);
    } catch (error) {
      console.error('Error verifying payment:', error);
    }
  };

  const goToDashboard = () => {
    if (customerId) {
      navigate(`/customer-dashboard/${customerId}/policies/${policyId}`);
    }
  };

  const buttonStyle = {
    marginTop: '20px',
    padding: '10px 20px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.3s ease',
  };

  const buttonHoverStyle = {
    backgroundColor: '#218838',
  };

  return (
    <div className="successContainer">
      {paymentVerified && (
        <>
          <div className="ribbon ribbon-start"></div>
          <div className="ribbon ribbon-start"></div>
          <div className="ribbon ribbon-start"></div>
          <div className="ribbon ribbon-start"></div>
          <div className="ribbon ribbon-start"></div>
          <div className="ribbon ribbon-start"></div>
          <div className="ribbon ribbon-start"></div>
          <div className="ribbon ribbon-start"></div>
          <div className="ribbon ribbon-start"></div>
          <div className="ribbon ribbon-start"></div>
        </>
      )}

      <div className="contentBox">
        {!paymentVerified ? (
          <div className="spinner"></div>
        ) : (
          <div className="tickMark">✔</div>
        )}
        <h1 className="title">Payment succeeded!</h1>
        <p className={paymentVerified ? 'messageFadeIn' : 'message'}>
          {paymentVerified
            ? 'Your payment has been verified successfully!'
            : 'We are verifying your payment. Please wait...'}
        </p>
        {paymentVerified && customerId && (
          <button
            className="button"
            style={buttonStyle}
            onMouseOver={(e) => (e.target.style.backgroundColor = buttonHoverStyle.backgroundColor)}
            onMouseOut={(e) => (e.target.style.backgroundColor = buttonStyle.backgroundColor)}
            onClick={goToDashboard}
          >
            Go to Dashboard
          </button>
        )}
      </div>
    </div>
  );
};

export default SuccessPage;
