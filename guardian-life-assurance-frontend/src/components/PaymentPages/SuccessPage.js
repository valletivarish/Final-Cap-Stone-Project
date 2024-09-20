import React, { useEffect, useState } from 'react';
import { useSearchParams,useNavigate } from 'react-router-dom';
import axios from 'axios';

const SuccessPage = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [customerId, setCustomerId] = useState(null);
  const [policyId,setPolicyId]=useState(null);
  const [paymentVerified, setPaymentVerified] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionId) {
      verifyPayment(sessionId);
    }
  }, [sessionId]);

  const verifyPayment = async (sessionId) => {
    try {
      const response = await axios.post('http://localhost:8080/guardian-life-assurance/checkout/payments/verify', {
        sessionId: sessionId,
      },{
        headers:{
          'Authorization':`Bearer ${localStorage.getItem("authToken")}`
        }
      }
    );
      console.log('Payment Verified:', response.data);
      if (response.data.customerId) {
        setCustomerId(response.data.customerId);
      }
      if(response.data.policyNo){
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

  return (
    <div style={styles.successContainer}>
      <div style={styles.contentBox}>
        {!paymentVerified ? (
          <div style={styles.spinner}></div>
        ) : (
          <div style={styles.tickMark}>✔</div> // Display tick mark on success
        )}
        <h1 style={styles.title}>Payment Successful!</h1>
        <p style={paymentVerified ? styles.messageFadeIn : styles.message}>
          {paymentVerified ? 'Your payment has been verified successfully!' : 'We are verifying your payment. Please wait...'}
        </p>
        {paymentVerified && customerId && (
          <button style={styles.button} onClick={goToDashboard}>
            Go to Dashboard
          </button>
        )}
      </div>
    </div>
  );
};

// Internal CSS Styles
const styles = {
  successContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f7f7f7',
    fontFamily: 'Arial, sans-serif',
  },
  contentBox: {
    textAlign: 'center',
    backgroundColor: '#fff',
    padding: '50px',
    borderRadius: '15px',
    boxShadow: '0px 15px 35px rgba(0, 0, 0, 0.15)',
    transition: 'all 0.4s ease-in-out',
  },
  title: {
    fontSize: '32px',
    color: '#28a745',
    fontWeight: '700',
    marginBottom: '15px',
    transition: 'opacity 0.5s ease-in-out',
  },
  message: {
    fontSize: '18px',
    color: '#555',
    transition: 'opacity 0.5s ease-in-out',
  },
  messageFadeIn: {
    fontSize: '18px',
    color: '#555',
    opacity: '1',
    transition: 'opacity 0.5s ease-in-out',
  },
  spinner: {
    border: '5px solid #f3f3f3', // Light gray
    borderTop: '5px solid #28a745', // Success green
    borderRadius: '50%',
    width: '60px',
    height: '60px',
    animation: 'spin 1s ease-in-out infinite',
    margin: '0 auto 20px',
  },
  tickMark: {
    fontSize: '70px',
    color: '#28a745',
    margin: '0 auto 20px',
    animation: 'scaleIn 0.7s ease-in-out',
  },
  button: {
    marginTop: '20px',
    padding: '10px 20px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.3s ease'},
    buttonHover: {
        backgroundColor: '#218838',
      },
  '@keyframes spin': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' },
  },
  '@keyframes scaleIn': {
    '0%': { opacity: 0, transform: 'scale(0.5)' },
    '100%': { opacity: 1, transform: 'scale(1)' },
  },
};

export default SuccessPage;
