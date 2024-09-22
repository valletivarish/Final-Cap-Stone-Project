import React from 'react';
import { useNavigate } from 'react-router-dom';
const BackButton = () => {
  const navigate = useNavigate();

  const buttonStyle = {
    backgroundColor: '#dc3545', 
    color: '#fff',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
    marginTop: '20px',
    display: 'inline-block',
    transition: 'background-color 0.3s ease',
    textAlign: 'center'
  };

  const handleMouseEnter = (e) => {
    e.target.style.backgroundColor = '#b52d3a'; 
  };

  const handleMouseLeave = (e) => {
    e.target.style.backgroundColor = '#dc3545';
  };

  const handleBackClick = () => {
    navigate(-1); 
  };

  return (
    <div>
      <button
        style={buttonStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleBackClick}
      >
        Back
      </button>
    </div>
  );
};

export default BackButton;
