import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { getAllStates, registerAgent } from '../../../services/gaurdianLifeAssuranceServices';
import { showToastSuccess, showToastError } from '../../../utils/toast/Toast';
import { useNavigate } from 'react-router-dom';
import { required, email as isEmail, alphanumeric, alphabetsOnly, positiveNumeric, minLength } from '../../../utils/validators/Validators';
import './AddAgent.css'; 
import { getStateCount } from '../../../services/stateAndCityManagementService';
import { Helper } from '../../../utils/helpers/Helper';
import {verifyAdmin,verifyEmployee} from "../../../services/authServices"

const AddAgent = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [houseNo, setHouseNo] = useState('');
  const [apartment, setApartment] = useState('');
  const [pincode, setPincode] = useState('');
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const fetchRoleAndVerify = async () => {
      const role = localStorage.getItem("role");
      let verified = false;
      if (role === "admin") {
        verified = await verifyAdmin();
      } else if (role === "employee") {
        verified = await verifyEmployee();
      }
      setIsVerified(verified);
      if (!verified) {
        navigate("/login");
      }
    };
    fetchRoleAndVerify();
  }, [navigate]);

  useEffect(() => {
    const fetchStates = async () => {
      const count=await getStateCount();
      const response = await getAllStates({size:count});
      setStates(response.content);
    };
    fetchStates();
  }, []);

  const handleStateChange = (e) => {
    const stateId = parseInt(e.target.value);
    setSelectedState(stateId);
    const state = states.find(s => s.id === stateId);
    setCities(state ? state.cities : []);
    setSelectedCity(''); 
  };

  const validateField = (field, value) => {
    let error = '';
    switch (field) {
      case 'firstName':
        error = alphabetsOnly(value) || required(value) ? 'First Name is invalid.' : '';
        break;
      case 'lastName':
        error = alphabetsOnly(value) || required(value) ? 'Last Name is invalid.' : '';
        break;
      case 'email':
        error = isEmail(value) || required(value) ? 'Email is invalid.' : '';
        break;
      case 'password':
        error = required(value) ? 'Password is required.' : '';
        break;
      case 'username':
        error = alphanumeric(value) || required(value) ? 'Username is invalid.' : '';
        break;
      case 'houseNo':
        error = required(value) ? 'House Number is required.' : '';
        break;
      case 'pincode':
        error = positiveNumeric(value) || minLength(value, 6) || required(value) ? 'Pincode is invalid.' : '';
        break;
      case 'selectedState':
        error = required(value) ? 'State is required.' : '';
        break;
      case 'selectedCity':
        error = required(value) ? 'City is required.' : '';
        break;
      default:
        break;
    }
    return error;
  };

  const handleFieldChange = (field, value) => {
    switch (field) {
      case 'firstName':
        setFirstName(value);
        break;
      case 'lastName':
        setLastName(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'password':
        setPassword(value);
        break;
      case 'username':
        setUsername(value);
        break;
      case 'houseNo':
        setHouseNo(value);
        break;
      case 'apartment':
        setApartment(value);
        break;
      case 'pincode':
        setPincode(value);
        break;
      case 'selectedState':
        setSelectedState(value);
        break;
      case 'selectedCity':
        setSelectedCity(value);
        break;
      default:
        break;
    }

    const newErrors = { ...errors };
    newErrors[field] = validateField(field, value);
    setErrors(newErrors);
  };


  const validateFields = () => {
    const newErrors = {};
    newErrors.firstName = validateField('firstName', firstName);
    newErrors.lastName = validateField('lastName', lastName);
    newErrors.email = validateField('email', email);
    newErrors.password = validateField('password', password);
    newErrors.username = validateField('username', username);
    newErrors.houseNo = validateField('houseNo', houseNo);
    newErrors.pincode = validateField('pincode', pincode);
    newErrors.selectedState = validateField('selectedState', selectedState);
    newErrors.selectedCity = validateField('selectedCity', selectedCity);

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === '');
  };

  const handleAddAgent = async (e) => {
    e.preventDefault();
    if (!validateFields()) {
      showToastError('Please fix the validation errors before submitting.');
      return;
    }

    const agentData = {
      firstName,
      lastName,
      email,
      password,
      username,
      houseNo,
      apartment,
      pincode,
      stateId: selectedState,
      cityId: selectedCity
    };

    try {
      await registerAgent(agentData); 
      showToastSuccess('Agent added successfully!');
      const roleBasedLink = getRoleLink(`/agents/view`);
      navigate(roleBasedLink);
    } catch (error) {
      showToastError('Failed to add agent. Please try again.');
    }
  };

  const renderStates = () => {
    return states.map(state => (
      <option key={state.id} value={state.id}>{state.name}</option>
    ));
  };

  const renderCities = () => {
    return cities.map(city => (
      <option key={city.id} value={city.id}>{city.city}</option>
    ));
  };
  const getRoleLink = (link = "") => {
    return Helper.getRoleLink(localStorage.getItem("role"), link);
  };

  return (
    <>
      {isVerified && (
        <Container className="agent-container">
        <div className="agent-card">
          <h2 className="text-center agent-header">Add Agent</h2>
          <Form className="agent-form" onSubmit={handleAddAgent}>
            <Row>
              <Col md={6}>
                <Form.Group controlId="formFirstName">
                  <Form.Control
                    type="text"
                    className="agent-input"
                    placeholder="Enter First Name"
                    value={firstName}
                    onChange={(e) => handleFieldChange('firstName', e.target.value)}
                    isInvalid={errors.firstName ? true : false}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.firstName}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formLastName">
                  <Form.Control
                    type="text"
                    className="agent-input"
                    placeholder="Enter Last Name"
                    value={lastName}
                    onChange={(e) => handleFieldChange('lastName', e.target.value)}
                    isInvalid={errors.lastName ? true : false}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.lastName}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
  
            <Row>
              <Col md={6}>
                <Form.Group controlId="formEmail">
                  <Form.Control
                    type="email"
                    className="agent-input"
                    placeholder="Enter Email"
                    value={email}
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                    isInvalid={errors.email ? true : false}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formPassword">
                  <Form.Control
                    type="password"
                    className="agent-input"
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => handleFieldChange('password', e.target.value)}
                    isInvalid={errors.password ? true : false}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.password}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
  
            <Row>
              <Col md={6}>
                <Form.Group controlId="formUsername">
                  <Form.Control
                    type="text"
                    className="agent-input"
                    placeholder="Enter Username"
                    value={username}
                    onChange={(e) => handleFieldChange('username', e.target.value)}
                    isInvalid={errors.username ? true : false}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.username}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
  
            <Row>
              <Col md={4}>
                <Form.Group controlId="formHouseNo">
                  <Form.Control
                    type="text"
                    className="agent-input"
                    placeholder="Enter House No"
                    value={houseNo}
                    onChange={(e) => handleFieldChange('houseNo', e.target.value)}
                    isInvalid={errors.houseNo ? true : false}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.houseNo}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="formApartment">
                  <Form.Control
                    type="text"
                    className="agent-input"
                    placeholder="Enter Apartment"
                    value={apartment}
                    onChange={(e) => handleFieldChange('apartment', e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="formPincode">
                  <Form.Control
                    type="text"
                    className="agent-input"
                    placeholder="Enter Pincode"
                    value={pincode}
                    onChange={(e) => handleFieldChange('pincode', e.target.value)}
                    isInvalid={errors.pincode ? true : false}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.pincode}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
  
            <Row>
              <Col md={6}>
                <Form.Group controlId="formState">
                  <Form.Control
                    as="select"
                    className="agent-input"
                    value={selectedState}
                    onChange={(e) => {
                      handleFieldChange('selectedState', e.target.value)
                      handleStateChange(e)
                    }}
                    isInvalid={errors.selectedState ? true : false}
                  >
                    <option value="">Select State</option>
                    {renderStates()}
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {errors.selectedState}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formCity">
                  <Form.Control
                    as="select"
                    className="agent-input"
                    value={selectedCity}
                    onChange={(e) => handleFieldChange('selectedCity', e.target.value)}
                    disabled={!selectedState}
                    isInvalid={errors.selectedCity ? true : false}
                  >
                    <option value="">Select City</option>
                    {renderCities()}
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {errors.selectedCity}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
  
            <div className="center">
              <Button variant="primary" type="submit" className="agent-button">
                Add Agent
              </Button>
            </div>
          </Form>
        </div>
      </Container>
      )}
    </>
  );
};

export default AddAgent;
