import React, { useState } from 'react';
import { addEmployee } from '../../../../services/adminServices';
import 'react-toastify/dist/ReactToastify.css';
import { showToastError, showToastSuccess } from '../../../../utils/toast/Toast';
import { verifyAdmin } from '../../../../services/authServices';
import { required, email, alphanumeric, alphabetsOnly, positiveNumeric, minLength, isStrongPassword } from '../../../../utils/validators/Validators';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const AddEmployee = () => {
    const [formData, setFormData] = useState({
        username: '',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        salary: '',
        active: true 
    });
    const navigate=useNavigate();
    const [isAdmin, setIsAdmin] = useState(false);


    useEffect(() => {
        const verify = async () => {
          const response = await verifyAdmin();
          if (!response) {
            navigate("/login");
            return;
          } else {
            setIsAdmin(true);
          }
        };
        verify();
      }, []);

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };



    const handleSubmit = async (e) => {
        e.preventDefault();

        setErrors({});

        let isValid = true;
        const newErrors = {};

        const usernameError = required(formData.username) || alphanumeric(formData.username);
        if (usernameError) {
            showToastError(usernameError);
            return;
        }

        const firstNameError = required(formData.firstName) || alphabetsOnly(formData.firstName);
        if (firstNameError) {
            showToastError(firstNameError);
            return;
        }

        const lastNameError = required(formData.lastName) || alphabetsOnly(formData.lastName);
        if (lastNameError) {
            showToastError(lastNameError);
            return;
        }

        const emailError = required(formData.email) || email(formData.email);
        if (emailError) {
            showToastError(emailError);
            return;
        }

        const passwordError = required(formData.password) || minLength(formData.password, 8) || isStrongPassword(formData.password);
        if (passwordError) {
            showToastError(passwordError);
            return;
        }

        const salaryError = required(formData.salary) || positiveNumeric(formData.salary);
        if (salaryError) {
            showToastError(salaryError);
            return;
        }
        if (!isValid) {
            setErrors(newErrors);
            showToastError('Please fix the errors before submitting');
            return;
        }

        setLoading(true);
        try {
            const response=await addEmployee(formData);
            showToastSuccess(response);

            setFormData({
                username: '',
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                salary: '',
                active: true, 
            });
        } catch (error) {
            showToastError(error || 'Failed to add employee');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="agent-container">
            <div className="agent-card">
                <h2 className="agent-header">Add Employee</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                            className={`agent-input ${errors.username ? 'error-border' : ''}`}
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                        {errors.username && <span className="error-message">{errors.username}</span>}
                    </div>

                    <div className="form-group">
                        <input
                            className={`agent-input ${errors.firstName ? 'error-border' : ''}`}
                            type="text"
                            name="firstName"
                            placeholder="First Name"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                        />
                        {errors.firstName && <span className="error-message">{errors.firstName}</span>}
                    </div>

                    <div className="form-group">
                        <input
                            className={`agent-input ${errors.lastName ? 'error-border' : ''}`}
                            type="text"
                            name="lastName"
                            placeholder="Last Name"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                        />
                        {errors.lastName && <span className="error-message">{errors.lastName}</span>}
                    </div>

                    <div className="form-group">
                        <input
                            className={`agent-input ${errors.email ? 'error-border' : ''}`}
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        {errors.email && <span className="error-message">{errors.email}</span>}
                    </div>

                    <div className="form-group">
                        <input
                            className={`agent-input ${errors.password ? 'error-border' : ''}`}
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        {errors.password && <span className="error-message">{errors.password}</span>}
                    </div>

                    <div className="form-group">
                        <input
                            className={`agent-input ${errors.salary ? 'error-border' : ''}`}
                            type="number"
                            name="salary"
                            placeholder="Salary"
                            value={formData.salary}
                            onChange={handleChange}
                            required
                        />
                        {errors.salary && <span className="error-message">{errors.salary}</span>}
                    </div>



                    <div className="center">
                        <button className={`agent-button ${loading ? 'disabled-button' : ''}`} type="submit" disabled={loading}>
                        {loading ? 'Adding Employee...' : 'Add Employee'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddEmployee;
