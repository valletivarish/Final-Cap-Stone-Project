import React, { useEffect, useState } from 'react';
import { getAllStates, getCitiesByState, deactivateCity, activateCity } from '../../../../../services/gaurdianLifeAssuranceServices';
import { addCity } from '../../../../../services/adminServices';
import { showToastSuccess, showToastError } from '../../../../../utils/toast/Toast';
import './ViewCities.css'; 
import { capitalizeWords } from '../../../../../utils/helpers/CapitilizeData';
import { getStateCount } from '../../../../../services/stateAndCityManagementService';

const ViewCities = () => {
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [newCityName, setNewCityName] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const count=await getStateCount();
        const response = await getAllStates({size:count});
        if (response && response.content) {
          setStates(response.content);
        }
      } catch (error) {
        setError('Failed to fetch states');
        showToastError('Failed to fetch states');
      }
    };
    fetchStates();
  }, []);

  const fetchCities = async (stateId) => {
    try {
      const response = await getCitiesByState(stateId);
      if (response) {
        setCities(response);
      } else {
        throw new Error('Invalid cities response');
      }
    } catch (error) {
      setError('Failed to fetch cities');
      showToastError('Failed to fetch cities');
    }
  };

  const handleStateChange = (e) => {
    const stateId = e.target.value;
    setSelectedState(stateId);
    if (stateId) {
      fetchCities(stateId);
    } else {
      setCities([]);
    }
  };

  const handleActivateDeactivate = async (cityId, isActive) => {
    try {
      if (isActive) {
        const response=await deactivateCity(cityId);
        showToastSuccess(response);
      } else {
        const response=await activateCity(cityId);
        showToastSuccess(response);
      }
      if (selectedState) {
        fetchCities(selectedState);
      }
    } catch (error) {
      showToastError(error.message);
    }
  };

  const handleAddCity = async () => {
    if (!selectedState || !newCityName.trim()) {
      showToastError('State and City name are required');
      return;
    }
    try {
      const response=await addCity(selectedState, capitalizeWords(newCityName));
      showToastSuccess(response);
      setNewCityName('');
      fetchCities(selectedState);
    }
    catch(error){
      showToastError(error.message);     
    }
}

  return (
    <div className="cities-container">
      <h1 className="cities-header">List of Cities</h1>

      <div className="state-selector">
        <select value={selectedState} onChange={handleStateChange} className="state-dropdown">
          <option value="">Select a state</option>
          {states.map(state => (
            <option key={state.id} value={state.id}>{state.name}</option>
          ))}
        </select>
      </div>

      <div className="add-city-container">
        <input
          type="text"
          value={newCityName}
          onChange={(e) => setNewCityName(e.target.value)}
          placeholder="Enter new city name"
          className="add-city-input"
        />
        <button onClick={handleAddCity} className="add-city-button">Add City</button>
      </div>

      {selectedState && cities.length > 0 && (
        <table className="cities-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>City</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cities.map(city => (
              <tr key={city.id}>
                <td>{city.id}</td>
                <td>{city.city}</td>
                <td>{city.active ? 'Active' : 'Inactive'}</td>
                <td>
                  <button
                    className={city.active ? 'button deactivate' : 'button activate'}
                    onClick={() => handleActivateDeactivate(city.id, city.active)}
                  >
                    {city.active ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedState && cities.length === 0 && (
        <p>No cities available for the selected state.</p>
      )}
    </div>
  );
};

export default ViewCities;
