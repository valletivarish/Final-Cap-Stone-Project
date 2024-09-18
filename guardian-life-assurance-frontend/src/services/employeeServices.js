import axios from "axios";
import { getAuthToken } from "../utils/helpers/authHelpers";
import { handleApiError } from "../utils/helpers/apiErrorHandler";
export const getEmployeeDashboardCount = async () => {
  try {
    const token = getAuthToken();
    const response = await axios.get(
      "http://localhost:8080/guardian-life-assurance/employees/counts",
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
export const getAllEmployees = async (params) => {
  try {
    const token = getAuthToken();
    const response = await axios.get(
      `http://localhost:8080/guardian-life-assurance/employees`,
      {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(error);
    handleApiError(error);
  }
};

export const deleteEmployee = async (employeeId) => {
  try {
    const token = getAuthToken();
    const response = await axios.delete(
      `http://localhost:8080/guardian-life-assurance/admin/employees/${employeeId}`,
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
export const fetchEmployeeDetails = async (employeeId) => {
  try {
    const token = getAuthToken();
    const response = await axios.get(
      `http://localhost:8080/guardian-life-assurance/employees/${employeeId}`,
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

export const updateEmployeeDetails = async (employeeData) => {
  try {
    const token = getAuthToken();
    const response = await axios.put(
      `http://localhost:8080/guardian-life-assurance/employees`,
      employeeData,
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
export const getEmployeeProfile = async () => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("Authentication token not found. Please log in again.");
    }
    const response = await axios.get(
      `http://localhost:8080/guardian-life-assurance/employees/profile`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error) {
      handleApiError(error);
    }
  }
};
