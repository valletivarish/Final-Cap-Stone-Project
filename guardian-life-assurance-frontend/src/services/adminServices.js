import axios from "axios";
import { getAuthToken } from "../utils/helpers/authHelpers";
import { handleApiError } from "../utils/helpers/apiErrorHandler";
export const createTaxSetting = async (taxPercentage) => {
  try {
    const token = getAuthToken();
    const parsedTaxPercentage = parseFloat(taxPercentage);
    if (isNaN(parsedTaxPercentage) || parsedTaxPercentage <= 0) {
      throw new Error("Invalid tax percentage. It must be a positive number.");
    }

    const response = await axios.post(
      "http://localhost:8080/guardian-life-assurance/taxes",
      { taxPercentage: parsedTaxPercentage },
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

export const createInsuranceSetting = async (data) => {
  try {
    const token = getAuthToken();

    const response = await axios.post(
      "http://localhost:8080/guardian-life-assurance/insurance-settings",
      data,
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
export const addState = async (data) => {
  try {
    const token = getAuthToken();
    const response = await axios.post(
      "http://localhost:8080/guardian-life-assurance/states",
      data,
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
export const addCity = async (stateId, name) => {
  try {
    const token = getAuthToken();
    const response = await axios.post(
      `http://localhost:8080/guardian-life-assurance/states/${stateId}/cities`,
      {
        name,
      },
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
export const addEmployee = async (employeeData) => {
  try {
    const token = getAuthToken();
    const response = await axios.post(
      "http://localhost:8080/guardian-life-assurance/employees",
      employeeData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const addPlan = async (planData) => {
  try {
    const token = getAuthToken();
    const response = await axios.post(
      "http://localhost:8080/guardian-life-assurance/insurance-plans",
      planData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const createInsuranceScheme = async (insurancePlanId, formDataObj) => {
  try {
    const token = getAuthToken();
    return await axios.post(
      `http://localhost:8080/guardian-life-assurance/insurance-plans/${insurancePlanId}/insurance-schemes`,
      formDataObj,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    handleApiError(error);
  }
};

export const getAdminDashboardCount = async () => {
  try {
    const token = getAuthToken();
    const response = await axios.get(
      "http://localhost:8080/guardian-life-assurance/counts",
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
export const getAdminDetails = async () => {
  try {
    const token = getAuthToken();
    const response = await axios.get(
      `http://localhost:8080/guardian-life-assurance/admins/profile`,
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
export const getAdminName = async () => {
  try {
    const token = getAuthToken();
    const response = await axios.get(
      `http://localhost:8080/guardian-life-assurance/admins/details`,
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