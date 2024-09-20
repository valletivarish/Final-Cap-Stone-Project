import React, { useState, useEffect } from "react";
import {
  getDocumentTypes,
  uploadDocument,
  getAllCustomerDocuments,
  downloadDocument,
} from "../../../../services/documentServices";
import { useNavigate, useParams } from "react-router-dom";
import "./DocumentUpload.css";
import {
  showToastSuccess,
  showToastError,
} from "../../../../utils/toast/Toast";
import { verifyCustomer } from "../../../../services/authServices";

const DocumentUpload = () => {
  const { customerId } = useParams();
  const [documentTypes, setDocumentTypes] = useState([]);
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [selectedDocumentType, setSelectedDocumentType] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const navigate = useNavigate();
  const [isCustomer, setIsCustomer] = useState(false);

  const verifyCustomerAndNavigate = async () => {
    try {
      const response = await verifyCustomer();
      if (!response) {
        navigate("/login");
      } else {
        setIsCustomer(true);
      }
    } catch (error) {
      navigate("/login");
    }
  };

  useEffect(() => {
    verifyCustomerAndNavigate();
    if(!isCustomer){
      return;
    }
    fetchDocumentTypes();
    fetchUploadedDocuments();
  }, [isCustomer]);

  const fetchDocumentTypes = async () => {
    try {
      const response = await getDocumentTypes();
      setDocumentTypes(response);
    } catch (error) {
      showToastError("Failed to fetch document types.");
    }
  };

  const fetchUploadedDocuments = async () => {
    try {
      const response = await getAllCustomerDocuments(customerId);
      setUploadedDocuments(response.content);
    } catch (error) {
      showToastError("Failed to fetch uploaded documents.");
    }
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleDocumentTypeChange = (event) => {
    setSelectedDocumentType(event.target.value);
  };

  const handleUpload = async () => {
    if (!selectedFile || !selectedDocumentType) {
      showToastError("Please select a document type and upload a file.");
      return;
    }

    try {
      const response = await uploadDocument(
        customerId,
        selectedFile,
        selectedDocumentType
      );
      showToastSuccess(response);
      fetchUploadedDocuments();
    } catch (error) {
      showToastError(error.message);
    }
  };

  const handleDownload = async (documentId) => {
    try {
      await downloadDocument(documentId);
      showToastSuccess("Document downloaded successfully.");
    } catch (error) {
      showToastError("Failed to download document.");
    }
  };

  const sanitizeDocumentType = (type) => {
    return type
      .toLowerCase()
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const hasNotVerifiedDocuments = uploadedDocuments.some(
    (doc) => !doc.verified
  );

  return (
    <div className="document-upload-container">
      <h2 className="document-upload-header">Upload Document</h2>
      <div className="document-upload-form-group">
        <label className="document-upload-label">Document Type</label>
        <select
          value={selectedDocumentType}
          onChange={handleDocumentTypeChange}
          className="document-upload-select"
        >
          <option value="">-- Select Document Type --</option>
          {documentTypes.map((type) => (
            <option key={type} value={type}>
              {sanitizeDocumentType(type)}
            </option>
          ))}
        </select>
      </div>

      <div className="document-upload-form-group">
        <label className="document-upload-label">Upload Document</label>
        <input
          type="file"
          onChange={handleFileChange}
          className="document-upload-input"
        />
      </div>

      <button className="document-upload-button" onClick={handleUpload}>
        Submit
      </button>

      <h3 className="document-upload-subheader">Uploaded Documents</h3>
      {uploadedDocuments.length > 0 ? (
        <div className="document-upload-list">
          {uploadedDocuments.map((doc) => (
            <div key={doc.documentId} className="document-upload-row">
              <span className="document-upload-name">
                {sanitizeDocumentType(doc.documentName)}
              </span>
              <span className="document-upload-status">
                {doc.verified
                  ? "Verified"
                  : doc.verifiedBy
                  ? "Not Verified"
                  : "Pending"}
              </span>
              <button
                className="document-upload-download-button"
                onClick={() => handleDownload(doc.documentId)}
              >
                Download
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="document-upload-no-documents">
          No documents uploaded yet.
        </p>
      )}

      {hasNotVerifiedDocuments && (
        <p className="document-upload-reupload-message">
          Please re-upload the documents that are not verified to get them
          approved.
        </p>
      )}
    </div>
  );
};

export default DocumentUpload;
