import React, { useEffect, useState } from 'react';
import { createCustomerQuery } from '../../../../services/queriesServices'; 
import { showToastSuccess, showToastError } from '../../../../utils/toast/Toast'; 
import './CreateQueryForm.css';
import { useNavigate, useParams } from 'react-router-dom';
import { verifyCustomer } from '../../../../services/authServices';

const CreateQueryForm = () => {
const {customerId}=useParams();
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});

  const handleValidation = () => {
    const validationErrors = {};
    if (!title) validationErrors.title = "Title is required";
    if (!message) validationErrors.message = "Message is required";
    return validationErrors;
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = handleValidation();

    if (Object.values(validationErrors).length > 0) {
      setErrors(validationErrors);
      showToastError("Please fill in all required fields.");
      return;
    }

    try {
      await createCustomerQuery(customerId,{ title, message });
      showToastSuccess("Query created successfully!");
      setTitle('');
      setMessage('');
      setErrors({});
    } catch (error) {
      showToastError(error.message || "Failed to create query.");
    }
  };

  return (
    <div className="create-query-container">
      <h1>Create a Query</h1>
      <form onSubmit={handleSubmit} className="create-query-form">
        
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            placeholder='Enter Query Title'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {errors.title && <span className="error-text">{errors.title}</span>}
        </div>

        <div className="form-group">
          <label>Message</label>
          <textarea
            placeholder='Enter Query Message'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          {errors.message && <span className="error-text">{errors.message}</span>}
        </div>

        <button type="submit" className="button create-activate">Submit Query</button>
      </form>
    </div>
  );
};

export default CreateQueryForm;
