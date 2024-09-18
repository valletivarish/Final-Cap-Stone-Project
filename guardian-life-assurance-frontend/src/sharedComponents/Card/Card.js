import React from "react";
import { Link } from "react-router-dom";
import './Card.css';

const Card = ({ icon: Icon, title, count, link }) => {
  return (
    <div className="dashboard-card">
      <Icon className="dashboard-icon" />
      <h3>{title}</h3>
      <p>{count}</p>
      {count && (<span className="record-text">Number of Records</span>)}
      <Link to={link} className="view-button">View</Link>
    </div>
  );
};

export default Card;
