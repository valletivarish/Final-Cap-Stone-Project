import React, { useState } from 'react';
import { changePassword } from '../../../services/authServices'; 
import { showToastSuccess, showToastError } from '../../../utils/toast/Toast'; 
import { required, isStrongPassword, isEqual } from '../../../utils/validators/Validators'; 
import { verifyAdmin,verifyAgent,verifyCustomer,verifyEmployee } from '../../../services/authServices';
import './ChangePassword.css';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ChangePassword = () => {
  const [existingPassword, setExistingPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const navigate=useNavigate();
  const [isVerified,setIsVerified]=useState(false);

  const handleValidation = () => {
    const validationErrors = {};
    validationErrors.existingPassword = required(existingPassword);
    validationErrors.newPassword = required(newPassword) || isStrongPassword(newPassword);
    validationErrors.confirmPassword = required(confirmPassword) || isEqual(newPassword, confirmPassword);
    
    return validationErrors;
  };

  useEffect(() => {
    const fetchRoleAndVerify = async () => {
      const role = localStorage.getItem("role");
      let verified = false;
      if (role === "admin") {
        verified = await verifyAdmin();
      } else if (role === "employee") {
        verified = await verifyEmployee();
      }
      else if(role==="agent"){
        verified = await verifyAgent();
      }
      else if(role==="customer"){
        verified = await verifyCustomer();
      }
      setIsVerified(verified);
      if (!verified) {
        navigate("/login");
      }
    };
    fetchRoleAndVerify();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = handleValidation();

    if (Object.values(validationErrors).some(error => error !== null)) {
      setErrors(validationErrors);
      showToastError("Please fix the validation errors.");
      return;
    }
    
    try {
      await changePassword({ existingPassword, newPassword, confirmPassword });
      showToastSuccess("Password changed successfully!");
      setErrors({});
    } catch (error) {
      showToastError(error.message || "Password change failed.");
    }
  };

  const handleInputChange = (e, setter, field) => {
    setter(e.target.value);

    const validationError = field === 'confirmPassword'
      ? isEqual(newPassword, e.target.value)
      : field === 'newPassword'
        ? isStrongPassword(e.target.value)
        : required(e.target.value);

    setErrors(prevErrors => ({
      ...prevErrors,
      [field]: validationError
    }));
  };

  return (
    <div className="change-password-container">
      <h1>Change Password</h1>
      <form onSubmit={handleSubmit} className="change-password-form">
        
        <div className="form-group">
          <label>Existing Password</label>
          <input
            type="password"
            placeholder='Enter Existing Password'
            value={existingPassword}
            onChange={(e) => handleInputChange(e, setExistingPassword, 'existingPassword')}
          />
          {errors.existingPassword && <span className="error-text">{errors.existingPassword}</span>}
        </div>

        <div className="form-group">
          <label>New Password</label>
          <input
            type="password"
            placeholder='Enter New Password'
            value={newPassword}
            onChange={(e) => handleInputChange(e, setNewPassword, 'newPassword')}
          />
          {errors.newPassword && <span className="error-text">{errors.newPassword}</span>}
        </div>

        <div className="form-group">
          <label>Confirm New Password</label>
          <input
            type="password"
            placeholder='Enter Confirm New Password'
            value={confirmPassword}
            onChange={(e) => handleInputChange(e, setConfirmPassword, 'confirmPassword')}
          />
          {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
        </div>

        <button type="submit" className="button change-activate">Change Password</button>
      </form>
    </div>
  );
};

export default ChangePassword;
