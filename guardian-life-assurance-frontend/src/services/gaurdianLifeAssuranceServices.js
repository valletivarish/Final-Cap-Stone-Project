import axios from "axios";
import { handleApiError } from "../utils/helpers/apiErrorHandler";
import { getAuthToken } from "../utils/helpers/authHelpers";
export const getAllPlans = async (params) => {
  try {
    const token = getAuthToken();
    const response = await axios.get(
      "http://localhost:8080/guardian-life-assurance/insurance-plans",
      {
        params: params,
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
export const getAllStates = async (params) => {
  try {
    const response = await axios.get(
      "http://localhost:8080/guardian-life-assurance/states",
      {
        params,
      }
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const registerAgent = async (payload) => {
  try {
    const token = getAuthToken();
    const response = await axios.post(
      "http://localhost:8080/guardian-life-assurance/employees/agents",
      payload,
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

export const getAllAgents = async (params) => {
  try {
    const token = getAuthToken();
    const response = await axios.get(
      "http://localhost:8080/guardian-life-assurance/employees/agents",
      {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("responsedto", response.data);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const getAgentById = async (agentId) => {
  try {
    const token = getAuthToken();
    const response = await axios.get(
      `http://localhost:8080/guardian-life-assurance/agents/${agentId}`,
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

export const updateAgent = async (payload) => {
  try {
    const token = getAuthToken();
    const response = await axios.put(
      `http://localhost:8080/guardian-life-assurance/agents`,
      payload,
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

export const deleteAgent = async (agentId) => {
  try {
    const token = getAuthToken();
    const response = await axios.delete(
      `http://localhost:8080/guardian-life-assurance/agents/${agentId}`,
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
export const activateAgent = async (agentId) => {
  try {
    const token = getAuthToken();
    const response = await axios.put(
      `http://localhost:8080/guardian-life-assurance/agents/${agentId}/activate`,
      {},
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
export const getAllCommissions = async (params) => {
  try {
    const token = getAuthToken();
    const response = await axios.get(
      `http://localhost:8080/guardian-life-assurance/commissions`,
      {
        params: params,
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
export const getCommissionTypes = async () => {
  try {
    const token = getAuthToken();
    const response = await axios.get(
      `http://localhost:8080/guardian-life-assurance/commissions/types`,
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

export const getAllWithdrawals = async (params) => {
  try {
    const token = getAuthToken();
    const response = await axios.get(
      `http://localhost:8080/guardian-life-assurance/commission-withdrawals`,
      {
        params: params,
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
export const getWithdrawalStatus = async () => {
  try {
    const token = getAuthToken();
    const response = await axios.get(
      `http://localhost:8080/guardian-life-assurance/commission-withdrawals/status`,
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
export const editState = async (data) => {
  try {
    const token = getAuthToken();
    const response = await axios.put(
      `http://localhost:8080/guardian-life-assurance/states`,
      data,
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

export const deactivateState = async (stateId) => {
  try {
    const token = getAuthToken();
    const response = await axios.delete(
      `http://localhost:8080/guardian-life-assurance/states/${stateId}`,
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
export const activateState = async (stateId) => {
  try {
    const token = getAuthToken();
    const response = await axios.put(
      `http://localhost:8080/guardian-life-assurance/states/${stateId}/activate`,
      {},
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
export const getStateById = async (stateId) => {
  try {
    const token = getAuthToken();
    const response = await axios.get(
      `http://localhost:8080/guardian-life-assurance/states/${stateId}`,
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
export const getCitiesByState = async (stateId) => {
  try {
    const token = getAuthToken();
    const response = await axios.get(
      `http://localhost:8080/guardian-life-assurance/states/${stateId}/cities`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("cities", response);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const deactivateCity = async (cityId) => {
  try {
    const token = getAuthToken();
    const response = await axios.delete(
      `http://localhost:8080/guardian-life-assurance/cities/${cityId}`,
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
export const activateCity = async (cityId) => {
  try {
    const token = getAuthToken();
    const response = await axios.put(
      `http://localhost:8080/guardian-life-assurance/cities/${cityId}/activate`,
      {},
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
export const activatePlan = async (planId) => {
  try {
    const token = getAuthToken();
    const response = await axios.put(
      `http://localhost:8080/guardian-life-assurance/insurance-plans/${planId}/activate`,
      {},
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

export const deactivatePlan = async (planId) => {
  try {
    const token = getAuthToken();
    const response = await axios.delete(
      `http://localhost:8080/guardian-life-assurance/insurance-plans/${planId}`,
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
export const updatePlan = async (data) => {
  try {
    const token = getAuthToken();
    const response = await axios.put(
      `http://localhost:8080/guardian-life-assurance/insurance-plans`,
      {
        planId: data.planId,
        planName: data.planName,
        active: data.active,
      },
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

export const getRequiredDocuments = async () => {
  try {
    const token = getAuthToken();
    const response = await axios.get(
      `http://localhost:8080/guardian-life-assurance/documents-required`,
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

export const getAllSchemes = async (params) => {
  try {
    const token = getAuthToken();
    const response = await axios.get(
      "http://localhost:8080/guardian-life-assurance/insurance-schemes",
      {
        params: {
          page: params.page || 0,
          size: params.size || 5,
          sortBy: params.sortBy || "schemeName",
          direction: params.direction || "ASC",
          minAmount: params.minAmount || null,
          maxAmount: params.maxAmount || null,
          minPolicyTerm: params.minPolicyTerm || null,
          maxPolicyTerm: params.maxPolicyTerm || null,
          planId: params.planId || null,
          schemeName: params.schemeName || null,
        },
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

export const getSchemeById = async (schemeId) => {
  try {
    const token = getAuthToken();
    const response = await axios.get(
      `http://localhost:8080/guardian-life-assurance/insurance-schemes/${schemeId}`,
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

export const updateScheme = async (insurancePlanId, schemeData) => {
  try {
    const token = getAuthToken();
    console.log(schemeData.schemeId);
    const response = await axios.put(
      `http://localhost:8080/guardian-life-assurance/insurance-plans/${insurancePlanId}/insurance-schemes`,
      schemeData,
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

export const getAllCustomers = async (params) => {
  try {
    const token = getAuthToken();
    const response = await axios.get(
      `http://localhost:8080/guardian-life-assurance/customers`,
      {
        params: params,
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

export const downloadCustomerReport = async () => {
  try {
    const token = getAuthToken();
    const response = await axios.get(
      "http://localhost:8080/guardian-life-assurance/customers/pdf",
      {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const url = window.URL.createObjectURL(
      new Blob([response.data], { type: "application/pdf" })
    );
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "CustomerReport.pdf");
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    handleApiError(error);
  }
};

export const deactivateCustomer = async (customerId) => {
  try {
    const token = getAuthToken();
    const response = await axios.delete(
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

export const activateCustomer = async (customerId) => {
  try {
    const token = getAuthToken();
    const response = await axios.put(
      `http://localhost:8080/guardian-life-assurance/customers/${customerId}/activate`,
      {},
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

export const getAllPolicies = async (params) => {
  try {
    const token = getAuthToken();
    const response = await axios.get(
      "http://localhost:8080/guardian-life-assurance/customers/policies",
      {
        params: params,
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
export const getAllPayments = async (params) => {
  try {
    const token = getAuthToken();
    const response = await axios.get(
      "http://localhost:8080/guardian-life-assurance/employees/payments",
      {
        params: params,
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
export const downloadPaymentReport = async (params) => {
  try {
    const startDate=params.startDate;
    const endDate=params.endDate;
    const token = getAuthToken();
    const response = await axios.get(
      "http://localhost:8080/guardian-life-assurance/payments/pdf",
      {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: params,
      }
    );

    const formatDate = (date) => {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = `0${d.getMonth() + 1}`.slice(-2);
      const day = `0${d.getDate()}`.slice(-2);
      return `${year}-${month}-${day}`;
    };

    const fromDate = startDate ? formatDate(startDate) : "StartDate";
    const toDate = endDate ? formatDate(endDate) : "EndDate";

    const fileName = `PaymentReport_${fromDate}_to_${toDate}.pdf`;

    const url = window.URL.createObjectURL(
      new Blob([response.data], { type: "application/pdf" })
    );
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    handleApiError(error);
  }
};
export const getAllClaims = async (params) => {
  try {
    const token = getAuthToken();
    const response = await axios.get(
      "http://localhost:8080/guardian-life-assurance/claims",
      {
        params: params,
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
export const approveClaim = async (claimId) => {
  try {
    const token = getAuthToken();
    const response = await axios.put(
      `http://localhost:8080/guardian-life-assurance/claims/${claimId}/approval`,{},
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
export const rejectClaim = async (claimId) => {
  try {
    const token = getAuthToken();
    const response = await axios.put(
      `http://localhost:8080/guardian-life-assurance/claims/${claimId}/rejection`,{},
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
export const downloadAgentReport = async () => {
  try {
    const token = getAuthToken();
    const response = await axios.get(
      "http://localhost:8080/guardian-life-assurance/agents/pdf",
      {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const url = window.URL.createObjectURL(
      new Blob([response.data], { type: "application/pdf" })
    );
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "AgentReport.pdf");
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    handleApiError(error);
  }
};
export const downloadCommissionReport = async (params) => {
  try {
    const token = getAuthToken();
    const response = await axios.get(
      "http://localhost:8080/guardian-life-assurance/commission/pdf",
      {
        responseType: "blob",
        params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const url = window.URL.createObjectURL(
      new Blob([response.data], { type: "application/pdf" })
    );
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "CommissionReport.pdf");
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    handleApiError(error);
  }
};
export const downloadCommissionWithdrawalReport = async (params) => {
  try {
    const token = getAuthToken();
    const response = await axios.get(
      "http://localhost:8080/guardian-life-assurance/commission-withdrawal/pdf",
      {
        responseType: "blob",
        params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const url = window.URL.createObjectURL(
      new Blob([response.data], { type: "application/pdf" })
    );
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "CommissionWithdrawalReport.pdf");
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    handleApiError(error);
  }
};
export const approveWithdrawal = async (withdrawalId) => {
  try {
    const token = getAuthToken();
    const response = await axios.put(
      `http://localhost:8080/guardian-life-assurance/withdrawals/${withdrawalId}/approval`,
      {},
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
export const rejectWithdrawal = async (withdrawalId) => {
  try {
    const token = getAuthToken();
    const response = await axios.put(
      `http://localhost:8080/guardian-life-assurance/withdrawals/${withdrawalId}/rejection`,
      {},
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
export const getRealationships = async () => {
  try {
    const token = getAuthToken();
    const response = await axios.get(
      `http://localhost:8080/guardian-life-assurance/nominees/relationships`,
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