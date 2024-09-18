import axios from "axios";
import { getAuthToken } from "../utils/helpers/authHelpers";
import { handleApiError } from "../utils/helpers/apiErrorHandler";
export const fetchSchemesByPlanId = async (planId, page = 0, size = 1) => {
  try {
    const token = getAuthToken();
    const response = await axios.get(
      `http://localhost:8080/guardian-life-assurance/customers/plans/${planId}/schemes`,
      {
        params: { page, size },
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

export const fetchSchemeImage = async (schemeId) => {
  try {
    const token = getAuthToken();
    const response = await axios.get(
      `http://localhost:8080/guardian-life-assurance/customers/schemes/${schemeId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      }
    );
    return URL.createObjectURL(response.data);
  } catch (error) {
    handleApiError(error);
  }
};

export const initiateCheckout = async (requestData) => {
  try {
    const token = getAuthToken();
    const response = await axios.post(
      "http://localhost:8080/guardian-life-assurance/checkout/sessions",
      {
        amount: requestData.amount,
        requestData,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    window.location.href = response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const calculateInterest = async (body) => {
  try {
    const token = getAuthToken();
    const response = await axios.post(
      "http://localhost:8080/guardian-life-assurance/customers/interest-calculator",
      body,
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

export const fetchAllPoliciesBtCustomerId = async (customerId, params) => {
  try {
    const token = getAuthToken();
    const response = await axios.get(
      `http://localhost:8080/guardian-life-assurance/customers/${customerId}/policies`,
      {
        params: params,
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
export const fetcByPolicyId = async (customerId, policyId) => {
  try {
    const token = getAuthToken();
    const response = await axios.get(
      `http://localhost:8080/guardian-life-assurance/customers/${customerId}/policies/${policyId}`,
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

export const initiateInstallmentCheckout = async (
  customerId,
  installmentId,
  amount
) => {
  try {
    const token = getAuthToken();
    const response = await axios.post(
      `http://localhost:8080/guardian-life-assurance/checkout/${customerId}/policies/installments/${installmentId}/sessions`,
      {
        amount: amount,
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

export const downloadReceipt = async (installmentId) => {
  try {
    const token = getAuthToken();
    const response = await axios.get(
      `http://localhost:8080/guardian-life-assurance/customers/installments/receipt/${installmentId}`,
      {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `receipt_${installmentId}.pdf`);
    document.body.appendChild(link);
    link.click();
  } catch (error) {
    handleApiError(error);
  }
};
export const cancelPolicy = async (customerId, policyNo) => {
  try {
    const token = getAuthToken();
    const response = await axios.delete(
      `http://localhost:8080/guardian-life-assurance/customers/${customerId}/policies/cancel/${policyNo}`,
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
export const getPlanCount = async () => {
  try {
    const token = getAuthToken();
    const response = await axios.get(
      "http://localhost:8080/guardian-life-assurance/insurance-plans/count",
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
export const claimPolicy = async (customerId, payLoad) => {
  try {
    const token = getAuthToken();
    const formData = new FormData();
    formData.append("policyNo", payLoad.policyNo);
    formData.append("claimAmount", payLoad.claimAmount);
    formData.append("claimReason", payLoad.claimReason);
    formData.append("document", payLoad.document);
    const response = await axios.post(
      `http://localhost:8080/guardian-life-assurance/customers/${customerId}/claims`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const getSchemesByPlanId = async (planId) => {
  try {
    const token = getAuthToken();
    const response = await axios.get(
      `http://localhost:8080/guardian-life-assurance/agents/plans/${planId}/schemes`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};
