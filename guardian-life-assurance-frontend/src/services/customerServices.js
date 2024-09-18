import axios from "axios";
import { getAuthToken } from "../utils/helpers/authHelpers";
import { handleApiError } from "../utils/helpers/apiErrorHandler";

export const getCustomerDetails = async () => {
  try {
    const token = getAuthToken();
    const response = await axios.get(
      `http://localhost:8080/guardian-life-assurance/customers/details`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};
export const fetchCustomerAge = async () => {
  try {
    const token = getAuthToken();
    const response = await axios.get(
      "http://localhost:8080/guardian-life-assurance/customers/age",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const getCustomerById = async (customerId) => {
  try {
    const token = getAuthToken();
    const response = await axios.get(
      `http://localhost:8080/guardian-life-assurance/customers/${customerId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const updateCustomer = async (payload) => {
  try {
    const token = getAuthToken();
    const response = await axios.put(
      `http://localhost:8080/guardian-life-assurance/customers`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};
