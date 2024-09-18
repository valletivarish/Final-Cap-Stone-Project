import axios from "axios";
import { ValidationError } from "../utils/error/ApiError";

export const  login=async(usernameOrEmail,password)=>{
    try{
        const response=await axios.post('http://localhost:8080/guardian-life-assurance/auth/login',{
            usernameOrEmail,
            password
        })
        console.log(response)
        return response;
    }
    catch(error){
        if(error.response.data){
            const data=error.response.data;
            if(data.status===400){
                throw new ValidationError(data.message);
            }
            if (data.status === 401) {
                throw new ValidationError(data.message);
              }
              throw new Error("Something went wrong. Please try again later.");
        }
    }
}
export const register = async (payload) => {
    try {
      const response = await axios.post('http://localhost:8080/guardian-life-assurance/auth/customer-registration', payload);
      return response;
    } catch (error) {
      if (error.response && error.response.data) {
        const data = error.response.data;
        if (data.status === 400 || data.status === 401) {
          throw new ValidationError(data.message);
        }
      }
      throw new Error('Something went wrong. Please try again later.');
    }
  };

export const changePassword=async(payLoad)=>{

  try{
    const token = localStorage.getItem("authToken");
    if(!token){
      throw new Error("You are not logged in");
    }
    const response=await axios.put(`http://localhost:8080/guardian-life-assurance/auth/change-password`,payLoad,{
      headers:{

        'Authorization': 'Bearer ' + localStorage.getItem('authToken')
    }});
    return response.data;
}
catch(error){
  if(error){
    if(error.response.data.status===400){
      throw new ValidationError(error.response.data.message);
    }
    throw new error("Something went wrong please try again later");
  }
}}

export const verifyOtpAndResetPassword = async (payload) => {
  try {

    const response = await axios.put(`http://localhost:8080/guardian-life-assurance/auth/verify-otp`, payload);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || "An error occurred while resetting the password.";
  }
};

export const requestOtp = async (usernameOrEmail) => {
  try {
    const response = await axios.post(`http://localhost:8080/guardian-life-assurance/auth/send-otp`, { usernameOrEmail });
    console.log(response)
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || "An error occurred while requesting OTP.";
  }
};

export const verifyAdmin = async () => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) {
      return false;
    }
    const response = await axios.get(`http://localhost:8080/guardian-life-assurance/auth/verify-admin`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const verifyAgent = async () => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) {
      return false;
    }
    const response = await axios.get(`http://localhost:8080/guardian-life-assurance/auth/verify-agent`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log(response)
    return response.data;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const verifyEmployee = async () => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) {
      return false;
    }
    const response = await axios.get(`http://localhost:8080/guardian-life-assurance/auth/verify-employee`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log("authServices"+response.data)
    return response.data;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const verifyCustomer = async () => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) {
      return false;
    }
    const response = await axios.get(`http://localhost:8080/guardian-life-assurance/auth/verify-customer`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.log(error);
    return false;
  }
};




