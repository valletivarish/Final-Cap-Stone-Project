import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import './Errror.css'; 

const Error = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { status, errorType, errorMessage } = location.state || {};

  return (
    <div className="error-container">
      <div className="error-content">
        <h1 className="error-status">Error {status || "Unknown"}</h1>
        <h2 className="error-message">{errorMessage || "Something went wrong. Please try again later."}</h2>
        {errorType && <p className="error-type">Error Type: {errorType}</p>}
      </div>
      <div className="button-container">
        <button className="button home-link" onClick={() => navigate('/')}>Go to Home</button>
        <button className="button back-link" onClick={() => navigate(-1)}>Go Back</button>
      </div>
    </div>
  );
};

export default Error;
