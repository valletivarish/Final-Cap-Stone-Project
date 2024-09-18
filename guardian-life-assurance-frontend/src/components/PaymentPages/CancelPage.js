import React from 'react';
import { useNavigate } from 'react-router-dom';

const CancelPage = () => {
  const navigate = useNavigate(); 

  const retryPayment = () => {
    navigate(-3);
  };

  return (
    <div style={styles.cancelContainer}>
      <div style={styles.contentBox}>
        <div style={styles.crossMark}>✖</div> 
        <h1 style={styles.title}>Payment Canceled</h1>
        <p style={styles.message}>Your payment was not processed. Please try again.</p>
        <button style={styles.button} onClick={retryPayment}>
          Retry Payment
        </button>
      </div>
    </div>
  );
};

const styles = {
  cancelContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f0f0f0',
    fontFamily: 'Arial, sans-serif',
  },
  contentBox: {
    textAlign: 'center',
    backgroundColor: '#fff',
    padding: '60px',
    borderRadius: '15px',
    boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
  },
  title: {
    fontSize: '32px',
    color: '#dc3545', 
    fontWeight: '600',
    marginBottom: '20px',
  },
  message: {
    fontSize: '18px',
    color: '#666',
  },
  crossMark: {
    fontSize: '70px',
    color: '#dc3545',
    margin: '0 auto 20px',
    animation: 'fadeIn 0.7s ease-in-out',
  },
  button: {
    marginTop: '20px',
    padding: '10px 20px',
    backgroundColor: '#dc3545', 
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.3s ease',
  },
  buttonHover: {
    backgroundColor: '#c82333', 
  },
  '@keyframes fadeIn': {
    '0%': { opacity: 0, transform: 'scale(0.5)' },
    '100%': { opacity: 1, transform: 'scale(1)' },
  },
};

export default CancelPage;
