import axios from "axios";
import { getAuthToken } from "../utils/helpers/authHelpers";
import { handleApiError } from "../utils/helpers/apiErrorHandler";

export const getAllDocuments = async (params) => {
  try {
    const token = getAuthToken();
    const response = await axios.get(
      "http://localhost:8080/guardian-life-assurance/employees/documents",
      {
        params,
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

export const getDocumentById = async (documentId) => {
  try {
    const token = getAuthToken();
    const response = await axios.get(
      `http://localhost:8080/guardian-life-assurance/employees/documents/${documentId}/content`,
      {
        responseType: "blob",
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

export const approveDocument = async (documentId) => {
  try {
    const token = getAuthToken();
    const response = await axios.put(
      `http://localhost:8080/guardian-life-assurance/employees/documents/${documentId}/approve`,
      {},
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

export const rejectDocument = async (documentId) => {
  try {
    const token = getAuthToken();
    const response = await axios.put(
      `http://localhost:8080/guardian-life-assurance/employees/documents/${documentId}/reject`,
      {},
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

export const getDocumentTypes = async () => {
  try {
    const token = getAuthToken();
    const response = await axios.get(
      "http://localhost:8080/guardian-life-assurance/customers/documents/document-types",
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
export const uploadDocument = async (customerId, file, documentName) => {
  try {
    const token = getAuthToken();
    const formData = new FormData();
    formData.append("document", file);
    formData.append("documentName", documentName);

    const response = await axios.post(
      `http://localhost:8080/guardian-life-assurance/customers/${customerId}/documents`,
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
export const getAllCustomerDocuments = async (customerId) => {
  try {
    const token = getAuthToken();
    const response = await axios.get(
      `http://localhost:8080/guardian-life-assurance/customers/${customerId}/documents`,
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

export const downloadDocument = async (documentId) => {
  try {
    const token = getAuthToken();
    const response = await axios.get(
      `http://localhost:8080/guardian-life-assurance/customers/documents/${documentId}/download`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      }
    );

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `document_${documentId}.jpeg`);
    document.body.appendChild(link);
    link.click();
    link.remove();

    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};
