import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import './Login.css';
import { isStrongPassword, required } from "../../utils/validators/Validators";
import { showToastError, showToastSuccess } from "../../utils/toast/Toast"; 
import { login, requestOtp, verifyOtpAndResetPassword } from "../../services/authServices";
import { getCustomerDetails } from "../../services/customerServices";

const Login = ({ setRole }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [view, setView] = useState("login");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();


  const handleLogin = async (e) => {
    e.preventDefault();

    const usernameError = required(username);
    if (usernameError) {
      showToastError(usernameError);
      return;
    }

    const passwordError = isStrongPassword(password);
    if (passwordError) {
      showToastError(passwordError);
      return;
    }

    try {
      const response = await login(username, password);
      const token = response.headers["authorization"];
      if (token) {
        localStorage.setItem("authToken", token);
      }

      const role = response.data.role;
      if (role === "ROLE_ADMIN") {
        localStorage.setItem("role", "admin");
        setRole("admin");
        navigate("/admin-dashboard");
      } else if (role === "ROLE_EMPLOYEE") {
        localStorage.setItem("role", "employee");
        setRole("employee");
        navigate("/employee-dashboard");

      } else if (role === "ROLE_AGENT") {
        localStorage.setItem("role", "agent");
        setRole("agent");
        navigate("/agent-dashboard");
      } else if (role === "ROLE_CUSTOMER") {
        localStorage.setItem("role", "customer");
        setRole("customer");
        const customerResponse = await getCustomerDetails();
        const customerId = customerResponse.userId;
        localStorage.setItem("firstName", customerResponse.firstName);
        localStorage.setItem("lastName", customerResponse.lastName);
        navigate(`/customer-dashboard/${customerId}`);
      }

      showToastSuccess("Login successful!");
    } catch (error) {
      showToastError(error.message || "An error occurred. Please try again.");
    }
  };

  const handleForgetPasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await requestOtp(username);
      showToastSuccess(response); 
      setView("otp");
    } catch (error) {
      showToastError(error.response?.data?.message || "An error occurred. Please try again.");
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    try {
      const otpCode = otp.join("");
      const payload = {
        usernameOrEmail: username,
        otp: otpCode,
        newPassword: newPassword,
        confirmPassword: confirmPassword,
      };
      
      await verifyOtpAndResetPassword(payload);
      showToastSuccess("Password reset successful!");
      setView("login");
    } catch (error) {
      showToastError(error.message || "An error occurred. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {view === "login" && (
          <>
            <h2 className="login-header">Login</h2>
            <Form onSubmit={handleLogin}>
              <Form.Group className="mb-3" controlId="formUsername">
                <Form.Control
                  type="text"
                  placeholder="Enter username or email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="login-input"
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formPassword">
                <Form.Control
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="login-input"
                />
              </Form.Group>
              <p className="forget-password" onClick={() => setView("forgetPassword")}>
                Forget Password?
              </p>
              <div className="center">
                <Button variant="primary" type="submit" className="login-button">
                  Login
                </Button>
              </div>
            </Form>
          </>
        )}

        {view === "forgetPassword" && (
          <>
            <h2 className="login-header">Forget Password</h2>
            <Form onSubmit={handleForgetPasswordSubmit}>
              <Form.Group className="mb-3" controlId="formUsernameOrEmail">
                <Form.Control
                  type="text"
                  placeholder="Enter username or email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="login-input"
                />
              </Form.Group>
              <div className="center">
                <Button variant="primary" type="submit" className="login-button">
                  Submit
                </Button>
              </div>
            </Form>
          </>
        )}

        {view === "otp" && (
          <>
            <h2 className="login-header">Enter OTP</h2>
            <Form onSubmit={handleOtpSubmit}>
              <p>Email/Username: {username}</p>
              <div className="otp-inputs">
                {otp.map((value, index) => (
                  <Form.Control
                    key={index}
                    type="text"
                    maxLength="1"
                    value={value}
                    onChange={(e) => {
                      const newOtp = [...otp];
                      newOtp[index] = e.target.value;
                      setOtp(newOtp);
                    }}
                    className="otp-input"
                  />
                ))}
              </div>
              <Form.Group className="mb-3" controlId="formNewPassword">
                <Form.Control
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="login-input"
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formConfirmPassword">
                <Form.Control
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="login-input"
                />
              </Form.Group>
              <div className="center">
                <Button variant="primary" type="submit" className="login-button">
                  Reset Password
                </Button>
              </div>
            </Form>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
