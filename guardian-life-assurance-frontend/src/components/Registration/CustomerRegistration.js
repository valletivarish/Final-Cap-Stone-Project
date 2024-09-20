import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { getAllStates } from '../../services/gaurdianLifeAssuranceServices';
import './CustomerRegistration.css';
import { register } from '../../services/authServices';
import { useNavigate } from 'react-router-dom';
import { showToastError, showToastSuccess } from '../../utils/toast/Toast';
import { required, email as isEmail, alphanumeric, alphabetsOnly, positiveNumeric, isStrongPassword, minLength } from '../../utils/validators/Validators'; 
import BackButton from '../../sharedComponents/Button/BackButton';
import { getStateCount } from '../../services/stateAndCityManagementService';

const CustomerRegistration = () => {
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [dateOfBirth, setDob] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [username, setUsername] = useState('');
    const [emailAddress, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [houseNo, setHouseNo] = useState('');
    const [apartment, setApartment] = useState('');
    const [pincode, setPincode] = useState('');
    const [states, setStates] = useState([]);
    const [selectedState, setSelectedState] = useState('');
    const [cities, setCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState('');
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const getAllStatesData = async () => {
            const count=await getStateCount();
            const statesData = await getAllStates({size:count});
            setStates(statesData.content);
        };
        getAllStatesData();
    }, []);

    const handleStateChange = (e) => {
        const selectedStateId = parseInt(e.target.value);
        setSelectedState(selectedStateId);
        const selectedStateObj = states.find((state) => state.id === selectedStateId);
        if (selectedStateObj) {
            setCities(selectedStateObj.cities);
        } else {
            setCities([]);
        }
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
            case 'dateOfBirth':
                error = required(value) ? 'Date of Birth is required.' : '';
                break;
            case 'phoneNumber':
                error = positiveNumeric(value) || minLength(value, 10) || required(value) ? 'Phone Number is invalid.' : '';
                break;
            case 'username':
                error = alphanumeric(value) || required(value) ? 'Username is invalid.' : '';
                break;
            case 'emailAddress':
                error = isEmail(value) || required(value) ? 'Email is invalid.' : '';
                break;
            case 'password':
                error = isStrongPassword(value) || required(value) ? 'Password is invalid.' : '';
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
            case 'dateOfBirth':
                setDob(value);
                break;
            case 'phoneNumber':
                setPhoneNumber(value);
                break;
            case 'username':
                setUsername(value);
                break;
            case 'emailAddress':
                setEmail(value);
                break;
            case 'password':
                setPassword(value);
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
        newErrors.dateOfBirth = validateField('dateOfBirth', dateOfBirth);
        newErrors.phoneNumber = validateField('phoneNumber', phoneNumber);
        newErrors.username = validateField('username', username);
        newErrors.emailAddress = validateField('emailAddress', emailAddress);
        newErrors.password = validateField('password', password);
        newErrors.houseNo = validateField('houseNo', houseNo);
        newErrors.pincode = validateField('pincode', pincode);
        newErrors.selectedState = validateField('selectedState', selectedState);
        newErrors.selectedCity = validateField('selectedCity', selectedCity);

        setErrors(newErrors);
        return Object.values(newErrors).every((error) => error === '');
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!validateFields()) {
            showToastError('Please fix the validation errors before submitting.');
            return;
        }

        const payload = {
            firstName,
            lastName,
            dateOfBirth,
            phoneNumber,
            username,
            email: emailAddress,
            password,
            houseNo,
            apartment,
            pincode,
            stateId: parseInt(selectedState),
            cityId: parseInt(selectedCity),
        };

        try {
            await register(payload);
            showToastSuccess('Registration successful!');
            setTimeout(() => {
                navigate('/');
            }, 1000);
        } catch (error) {
            showToastError(error.message || 'Registration failed. Please try again.');
        }
    };

    const renderStates = () => {
        return states.map((state, index) => (
            <option key={index} value={state.id}>{state.name}</option>
        ));
    };

    const renderCities = () => {
        return cities.map((city, index) => (
            <option key={index} value={city.id}>{city.city}</option>
        ));
    };
    const getCurrentDate = () => new Date().toISOString().split('T')[0];


    return (
        <Container className="registration-container">
            
            <div className="registration-card">
            <BackButton/>
                <h2 className="text-center registration-header">Customer Registration</h2>
                <Form className="registration-form" onSubmit={handleRegister}>
                    <Row>
                        <Col md={6}>
                            <Form.Group controlId="formFirstName">
                                <Form.Control
                                    type="text"
                                    className="registration-input"
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
                                    className="registration-input"
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
                            <Form.Group controlId="formDob">
                                <Form.Control
                                    type="date"
                                    className="registration-input"
                                    value={dateOfBirth}
                                    onChange={(e) => handleFieldChange('dateOfBirth', e.target.value)}
                                    max={getCurrentDate()}
                                    isInvalid={errors.dateOfBirth ? true : false}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.dateOfBirth}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group controlId="formPhone">
                                <Form.Control
                                    type="text"
                                    className="registration-input"
                                    placeholder="Enter Phone Number"
                                    value={phoneNumber}
                                    onChange={(e) => handleFieldChange('phoneNumber', e.target.value)}
                                    isInvalid={errors.phoneNumber ? true : false}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.phoneNumber}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={6}>
                            <Form.Group controlId="formUsername">
                                <Form.Control
                                    type="text"
                                    className="registration-input"
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
                        <Col md={6}>
                            <Form.Group controlId="formEmail">
                                <Form.Control
                                    type="email"
                                    className="registration-input"
                                    placeholder="Enter Email"
                                    value={emailAddress}
                                    onChange={(e) => handleFieldChange('emailAddress', e.target.value)}
                                    isInvalid={errors.emailAddress ? true : false}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.emailAddress}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={6}>
                            <Form.Group controlId="formPassword">
                                <Form.Control
                                    type="password"
                                    className="registration-input"
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
                        <Col md={4}>
                            <Form.Group controlId="formHouseNo">
                                <Form.Control
                                    type="text"
                                    className="registration-input"
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
                                    className="registration-input"
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
                                    className="registration-input"
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
                                    className="registration-input"
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
                                    className="registration-input"
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
                        <Button variant="primary" type="submit" className="registration-button">
                            Register
                        </Button>
                    </div>
                </Form>
            </div>
        </Container>
    );
};

export default CustomerRegistration;
