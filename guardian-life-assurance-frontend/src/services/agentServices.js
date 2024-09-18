import axios from "axios";
import { getAuthToken } from "../utils/helpers/authHelpers";
import { handleApiError } from "../utils/helpers/apiErrorHandler";

export const getAgentCommissionWithdrawals = async (params) => {
  try {
    const token = getAuthToken();
    const response = await axios.get(
      `http://localhost:8080/guardian-life-assurance/agents/commission-withdrawal`,
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
export const getAgentCommissions = async (params) => {
  try {
    const token = getAuthToken();
    const response = await axios.get(
      `http://localhost:8080/guardian-life-assurance/agents/commissions`,
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

export const getAllCustomersByAgent = async (params) => {
  try {
    const token = getAuthToken();
    const response = await axios.get(
      `http://localhost:8080/guardian-life-assurance/agents/customers`,
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
export const getAgentPolicies = async (params) => {
  try {
    const token = getAuthToken();
    const response = await axios.get(
      `http://localhost:8080/guardian-life-assurance/agents/policies`,
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
export const getAgentPolicyPayments = async (params) => {
  try {
    const token = getAuthToken();
    const response = await axios.get(
      `http://localhost:8080/guardian-life-assurance/agents/policies/payments`,
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
export const getAgentPolicyClaims = async (params) => {
  try {
    const token = getAuthToken();
    const response = await axios.get(
      `http://localhost:8080/guardian-life-assurance/agents/policies/claims`,
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

export const getAgentProfile = async () => {
  try {
    const token = getAuthToken();
    const response = await axios.get(
      `http://localhost:8080/guardian-life-assurance/agents/profile`,
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

export const sendRecommendationEmail = async (payLoad) => {
  try {
    const token = getAuthToken();
    const response = await axios.post(
      `http://localhost:8080/guardian-life-assurance/agents/send-recommendation-email`,
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

export const getAgentEarnings=async(params)=>{
  try {
    const token = getAuthToken();
    const response = await axios.get(
      `http://localhost:8080/guardian-life-assurance/agents/earnings`,
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
}


export const getTotalCommission = async () => {
  try {
    const token = getAuthToken();
    const response = await axios.get('http://localhost:8080/guardian-life-assurance/agents/total-commission', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const createWithdrawalRequest = async (amount) => {
  try {
    const token = getAuthToken();
    const response = await axios.post(
      'http://localhost:8080/guardian-life-assurance/agents/withdrawals',
      null,
      {
        params: { amount },
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
