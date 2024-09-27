import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import './VerifyEmail.css'

const VerifyEmail = () => {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);
  const [searchParams,setSearchParams]=useSearchParams();
  const token=searchParams.get("token")
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/guardian-life-assurance/auth/verify-email`, {
          params: { token }
        });
        setMessage(response.data);
        setLoading(false);
      } catch (err) {
        setError(true);
        setMessage('Email verification failed or token expired.');
        setLoading(false);
      }
    };

    verifyEmail();
  }, [token]);

  const handleContinue = () => {
    navigate('/login');
  };

  return (
    <div className="verify-email">
      <h2>{error ? 'Verification Failed' : 'Verification Successful'}</h2>
      <p>{message}</p>
      <button onClick={handleContinue} className="continue-btn">
        Continue to Login
      </button>
    </div>
  );
};

export default VerifyEmail;
