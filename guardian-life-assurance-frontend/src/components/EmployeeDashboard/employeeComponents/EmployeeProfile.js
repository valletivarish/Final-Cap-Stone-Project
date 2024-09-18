import React, { useState, useEffect } from 'react';
import { getEmployeeProfile, updateEmployeeDetails } from '../../../services/employeeServices';
import { showToastSuccess, showToastError } from '../../../utils/toast/Toast';
import './EmployeeProfile.css';

const EmployeeProfile = () => {
  const [employeeData, setEmployeeData] = useState({
    employeeId: '',
    username: '',
    firstName: '',
    lastName: '',
    email: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getEmployeeProfile();
        setEmployeeData(response);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching employee data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData({ ...employeeData, [name]: value });
  };

  const handleSave = async () => {
    try {
      const response = await updateEmployeeDetails(employeeData);
      showToastSuccess(response);
    } catch (error) {
      showToastError('Failed to update employee details.');
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="employee-profile-container">
      <h2>Employee Details</h2>

      <div className="form-group">
        <label>Employee ID:</label>
        <input
          type="text"
          name="employeeId"
          value={employeeData.employeeId}
          readOnly
        />
      </div>

      <div className="form-group">
        <label>Username:</label>
        <input
          type="text"
          name="username"
          value={employeeData.username}
          readOnly
        />
      </div>

      <div className="form-group">
        <label>First Name:</label>
        <input
          type="text"
          name="firstName"
          value={employeeData.firstName}
          onChange={handleInputChange}
        />
      </div>

      <div className="form-group">
        <label>Last Name:</label>
        <input
          type="text"
          name="lastName"
          value={employeeData.lastName}
          onChange={handleInputChange}
        />
      </div>

      <div className="form-group">
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={employeeData.email}
          onChange={handleInputChange}
        />
      </div>

      <button className="button activate" onClick={handleSave}>Save</button>
    </div>
  );
};

export default EmployeeProfile;
