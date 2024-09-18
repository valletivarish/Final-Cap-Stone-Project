import React, { useState, useEffect } from 'react';
import { getCustomerById, updateCustomer } from '../../../../services/customerServices';
import { getAllStates } from '../../../../services/gaurdianLifeAssuranceServices';
import './CustomerProfile.css';
import { showToastSuccess, showToastError } from '../../../../utils/toast/Toast';
import { useParams } from 'react-router-dom';
import { getStateCount } from '../../../../services/stateAndCityManagementService';

const CustomerProfile = () => {
  const { customerId } = useParams();
  const [customerData, setCustomerData] = useState({
    customerId: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    phoneNumber: '',
    username: '',
    email: '',
    houseNo: '',
    apartment: '',
    pincode: '',
    stateId: '',
    cityId: ''
  });
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getCustomerById(customerId);
        setCustomerData(response);
        console.log(response)
        const count = await getStateCount();
        const statesData = await getAllStates({ size: count });
        setStates(statesData.content);
        const selectedState = statesData.content.find(state => state.id === response.stateId);
        if (selectedState) {
          setCities(selectedState.cities);
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    fetchData();
  }, [customerId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerData({ ...customerData, [name]: value });
  };

  const handleStateChange = (e) => {
    const stateId = parseInt(e.target.value);
    setCustomerData({ ...customerData, stateId, cityId: '' });
    const selectedState = states.find(state => state.id === stateId);
    if (selectedState) {
      setCities(selectedState.cities);
    } else {
      setCities([]);
    }
  };

  const handleSave = async () => {
    const {
        firstName,
        lastName,
        dateOfBirth,
        phoneNumber,
        houseNo,
        pincode,
        stateId,
        cityId
      } = customerData;
  
      if (!firstName || !lastName || !dateOfBirth || !phoneNumber || !houseNo || !pincode || !stateId || !cityId) {
        showToastError('Please fill in all required fields.');
        return;
      }
    try {
      await updateCustomer({
        customerId: customerData.customerId,
        firstName: customerData.firstName,
        lastName: customerData.lastName,
        dateOfBirth: customerData.dateOfBirth,
        phoneNumber: customerData.phoneNumber,
        username: customerData.username,
        email: customerData.email,
        houseNo: customerData.houseNo,
        apartment: customerData.apartment,
        pincode: customerData.pincode,
        stateId: customerData.stateId,
        cityId: customerData.cityId,
      });
      showToastSuccess('Customer details updated successfully!');
    } catch (error) {
      showToastError('Failed to update customer details.');
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="customer-profile-container">
      <h2>Customer Profile</h2>
      <div className="form-group">
        <label>Customer ID:</label>
        <input type="text" name="customerId" value={customerData.customerId} readOnly />
      </div>
      <div className="form-group">
        <label>First Name:</label>
        <input
          type="text"
          name="firstName"
          value={customerData.firstName || ''}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
        <label>Last Name:</label>
        <input
          type="text"
          name="lastName"
          value={customerData.lastName || ''}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
        <label>Date of Birth:</label>
        <input
          type="date"
          name="dateOfBirth"
          value={customerData.dateOfBirth || ''}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
        <label>Phone Number:</label>
        <input
          type="text"
          name="phoneNumber"
          value={customerData.phoneNumber || ''}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
        <label>State:</label>
        <select
          name="stateId"
          value={customerData.stateId || ''}
          onChange={handleStateChange}
          required
        >
          <option value="">Select State</option>
          {states.map((state) => (
            <option key={state.id} value={state.id}>{state.name}</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>City:</label>
        <select
          name="cityId"
          value={customerData.cityId || ''}
          onChange={handleInputChange}
          disabled={!customerData.stateId}
          required
        >
          <option value="">Select City</option>
          {cities.map((city) => (
            <option key={city.id} value={city.id}>{city.city}</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>Pincode:</label>
        <input
          type="text"
          name="pincode"
          value={customerData.pincode || ''}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
        <label>Username:</label>
        <input type="text" name="username" value={customerData.username || ''} readOnly />
      </div>
      <div className="form-group">
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={customerData.email || ''}
          readOnly
        />
      </div>
      <button className="button activate" onClick={handleSave}>Save</button>
    </div>
  );
};

export default CustomerProfile;
