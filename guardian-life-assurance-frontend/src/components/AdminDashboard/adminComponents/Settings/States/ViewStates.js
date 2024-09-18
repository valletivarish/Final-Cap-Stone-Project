import React, { useEffect, useState } from 'react';
import { getAllStates, deactivateState, activateState } from '../../../../../services/gaurdianLifeAssuranceServices';
import { addState } from '../../../../../services/adminServices';
import Table from '../../../../../sharedComponents/Table/Table'; 
import { useSearchParams, useNavigate } from 'react-router-dom'; 
import { sanitizeStateData } from '../../../../../utils/helpers/SanitizeData'; 
import { required } from '../../../../../utils/validators/Validators';
import './ViewStates.css'; 
import { capitalizeWords } from '../../../../../utils/helpers/CapitilizeData';
import { showToastSuccess, showToastError } from '../../../../../utils/toast/Toast';
import { Helper } from '../../../../../utils/helpers/Helper';

const ViewStates = () => {
  const [states, setStates] = useState([]);
  const [sanitizedStates, setSanitizedStates] = useState([]);
  const [newState, setNewState] = useState('');
  const [error, setError] = useState(null);
  const [inputError, setInputError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchStates = async () => {
      try {
        
        const response = await getAllStates(searchParams);
        if (response && response.content) {
          const sanitized = sanitizeStateData(
            response, 
            ['id', 'name', 'active'],
            handleActivateDeactivate, 
            handleEdit
          );
          setSanitizedStates(sanitized);
          setStates(response.content);
        }
      } catch (error) {
        setError('Failed to fetch states');
        showToastError('Failed to fetch states');
      }
    };
    fetchStates();
  }, [searchParams]);

  const handleActivateDeactivate = async (stateId, isActive) => {
    try {
      if (isActive) {
        const response=await deactivateState(stateId);
        showToastSuccess(response);
      } else {
        const response=await activateState(stateId);
        showToastSuccess(response);
      }
      const response = await getAllStates();
      if (response && response.content) {
        const sanitized = sanitizeStateData(
          response, 
          ['id', 'name', 'active'],
          handleActivateDeactivate,
          handleEdit
        );
        setSanitizedStates(sanitized);
        setStates(response.content);
      }
    } catch (error) {
      setError('Failed to deactivate/activate state');
      showToastError('Failed to deactivate/activate state');
    }
  };

  const handleAddState = async () => {
    const validationError = required(newState);
    if (validationError) {
      setInputError(validationError);
      return;
    }

    try {
      const addResponse=await addState({ name: capitalizeWords(newState) });
      console.log(addResponse)
      showToastSuccess(addResponse);
      const response = await getAllStates();
      if (response && response.content) {
        const sanitized = sanitizeStateData(
          response, 
          ['id', 'name', 'active'],
          handleActivateDeactivate,
          handleEdit
        );
        setSanitizedStates(sanitized);
        setStates(response.content);
        setNewState('');
        setInputError(null);
      }
    } catch (error) {
      setError('Failed to add new state');
      showToastError('Failed to add new state');
    }
  };
  const getRoleLink = (link = "") => {
    return Helper.getRoleLink(localStorage.getItem("role"), null, link);
  };

  const handleEdit = (stateId) => {
    navigate(getRoleLink(`/settings/states/${stateId}/edit`)); 
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="states-container">
      <h1 className="states-header">List of States</h1>

      <div className="add-state-container">
        <input 
          type="text" 
          value={newState} 
          onChange={(e) => setNewState(e.target.value)} 
          placeholder="Enter new state name"
          className={`add-state-input ${inputError ? 'error-input' : ''}`}
        />
        <button onClick={handleAddState} className="add-state-button">Add State</button>
      </div>
      {inputError && <p className="input-error">{inputError}</p>}

      <Table
        data={sanitizedStates || []}
        searchParams={searchParams}
        setSearchParams={setSearchParams}
      />
    </div>
  );
};

export default ViewStates;
