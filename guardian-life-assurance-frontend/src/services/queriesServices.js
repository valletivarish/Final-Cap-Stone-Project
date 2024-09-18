import axios from "axios";
import { getAuthToken } from "../utils/helpers/authHelpers";
import { handleApiError } from "../utils/helpers/apiErrorHandler";

export const getAllQueries = async (params) => {
  try {
    const token = getAuthToken();
    const response = await axios.get(
      `http://localhost:8080/guardian-life-assurance/employees/customer/queries`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params,
      }
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};
export const getAllCustomerQueries = async (customerId, params) => {
  try {
    const token = getAuthToken();
    const response = await axios.get(
      `http://localhost:8080/guardian-life-assurance/customers/${customerId}/queries`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params,
      }
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const respondToQuery = async (queryId, response) => {
  try {
    const token = getAuthToken();
    const responseMessage = await axios.post(
      `http://localhost:8080/guardian-life-assurance/employees/customer/queries/${queryId}/respond`,
      { response },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return responseMessage.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const deleteQuery = async (customerId, queryId) => {
  try {
    const token = getAuthToken();
    const response = await axios.delete(
      `http://localhost:8080/guardian-life-assurance/customers/${customerId}/queries/${queryId}`,
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

export const createCustomerQuery = async (customerId, payLoad) => {
  try {
    const token = getAuthToken();
    const response = await axios.post(
      `http://localhost:8080/guardian-life-assurance/customers/${customerId}/queries`,
      payLoad,
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
