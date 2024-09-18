import React, { useState } from 'react';
import './ResponseModal.css'; 

const ResponseModal = ({ isOpen, onClose, onSubmit }) => {
  const [response, setResponse] = useState('');

  const handleSubmit = () => {
    if (response.trim()) {
      onSubmit(response);
      setResponse('');
      onClose();
    } else {
      alert('Response cannot be empty');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2>Respond to Query</h2>
        <textarea
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          placeholder="Enter your response here"
        />
        <div className="modal-actions">
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleSubmit}>Submit</button>
        </div>
      </div>
    </div>
  );
};

export default ResponseModal;
