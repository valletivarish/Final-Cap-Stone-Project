import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchEmployeeDetails, updateEmployeeDetails } from "../../services/employeeServices"; 
import { showToastSuccess } from "../../utils/toast/Toast";
import './EditEmployeeForm.css'
import { Helper } from "../../utils/helpers/Helper";

const EditEmployeeForm = () => {
    const { employeeId } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        firstName: "",
        lastName: "",
        email: "",
        active: false,
    });

    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEmployeeData = async () => {
            try {
                const response = await fetchEmployeeDetails(employeeId);
                setFormData({
                    employeeId: employeeId || "",
                    username: response.username || "",
                    firstName: response.firstName || "",
                    lastName: response.lastName || "",
                    email: response.email || "",
                    active: response.status
                });
                setError("");

            } catch (error) {
                setError("Failed to load employee data");
            }

        };

        fetchEmployeeData();
    }, [employeeId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleCheckboxChange = (e) => {
        const { checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            active: checked,
        }));
    };const getRoleLink = (link = "") => {
        return Helper.getRoleLink(localStorage.getItem("role"),null, link);
      };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateEmployeeDetails(formData);
            showToastSuccess("Updated employee details");
            const roleBasedLink = getRoleLink(`/employees`);
        navigate(roleBasedLink);
           
        } catch (error) {
            setError("Failed to update employee details");
        }
    };

    return (
        <div className="edit-employee-container">
            <div className="edit-employee-card">
                <h1 className="edit-employee-header">Edit Employee</h1>
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            className="agent-input"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="firstName">First Name</label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className="agent-input"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="lastName">Last Name</label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className="agent-input"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="agent-input"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="active">Active</label>
                        <input
                            type="checkbox"
                            id="active"
                            name="active"
                            checked={formData.active}
                            onChange={handleCheckboxChange}
                            className="agent-checkbox"
                        />
                    </div>

                    <div className="center">
                        <button type="submit" className="agent-button">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditEmployeeForm;
