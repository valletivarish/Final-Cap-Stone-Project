import React, { useState, useEffect, useCallback } from "react";
import Modal from "react-modal";  
import Table from "../../sharedComponents/Table/Table";
import { useSearchParams } from "react-router-dom";
import { approveDocument, getAllDocuments, getDocumentById, rejectDocument } from "../../services/documentServices";
import { sanitizeDocumentData } from "../../utils/helpers/SanitizeData";
import { debounce } from "../../utils/helpers/Debounce";
import { showToastError, showToastSuccess } from "../../utils/toast/Toast";
import "./ViewDocument.css"

Modal.setAppElement('#root'); 

const ViewDocuments = () => {
  const [documents, setDocuments] = useState({});
  const [error, setError] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [documentImage, setDocumentImage] = useState("");  
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get("page")) || 0;
  const size = parseInt(searchParams.get("size")) || 10;
  const sortBy = searchParams.get("sortBy") || "documentId";
  const direction = searchParams.get("direction") || "ASC";
  const verified = searchParams.get("verified") || "";

  const debouncedFetchDocuments = useCallback(
    debounce(async (params) => {
      try {
        const response = await getAllDocuments(params);
        const sanitizedData = sanitizeDocumentData(
          response,
          ["documentId", "documentName", "verified", "customerName", "verifiedBy"],
          handleViewDocument,
          handleApprove,
          handleReject
        );
        setDocuments(sanitizedData);
      } catch (err) {
        setError("Failed to fetch documents");
      }
    }, 300),
    []
  );

  useEffect(() => {
    const params = {
      page,
      size,
      sortBy,
      direction,
      verified,
    };
    debouncedFetchDocuments(params);
  }, [page, size, sortBy, direction, verified, debouncedFetchDocuments]);

  const handleSearchChange = (key, value) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
      return newParams;
    });
  };

  const handleViewDocument = async (documentId) => {
    try {
      const response = await getDocumentById(documentId);
      const imageUrl = URL.createObjectURL(response);  
      setDocumentImage(imageUrl);
      setModalIsOpen(true);  
    } catch (error) {
      showToastError("Failed to load document content");
    }
  };

  const handleApprove = async (documentId) => {
    await approveDocument(documentId);
    const params = {
      page,
      size,
      sortBy,
      direction,
      verified,
    };
    try {
      const response = await getAllDocuments(params);
      const sanitizedData = sanitizeDocumentData(
        response,
        ["documentId", "documentName", "verified", "customerName", "verifiedBy"],
        handleViewDocument,
        handleApprove,
        handleReject
      );
      setDocuments(sanitizedData);
    } catch (err) {
      setError("Failed to fetch documents");
    }
    showToastSuccess("Document approved");
  };

  const handleReject = async (documentId) => {
    await rejectDocument(documentId)
    const params = {
      page,
      size,
      sortBy,
      direction,
      verified,
    };
    try {
      const response = await getAllDocuments(params);
      const sanitizedData = sanitizeDocumentData(
        response,
        ["documentId", "documentName", "verified", "customerName", "verifiedBy"],
        handleViewDocument,
        handleApprove,
        handleReject
      );
      setDocuments(sanitizedData);
    } catch (err) {
      setError("Failed to fetch documents");
    }
    showToastSuccess("Document rejected");
  };

  const closeModal = () => {
    setModalIsOpen(false);  
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="view-documents-container">
      <div className="view-documents-card">
        <h1 className="view-documents-header">View Documents</h1>
        <div className="view-documents-filters">
          <select
            value={verified !== null ? verified : ""}
            onChange={(e) => handleSearchChange("verified", e.target.value)}
          >
            <option value="">All Documents</option>
            <option value="true">Verified</option>
            <option value="false">Unverified</option>
          </select>
        </div>
        <Table
          data={documents || []}
          searchParams={searchParams}
          setSearchParams={setSearchParams}
        />

        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Document Preview"
          style={{
            content: {
              top: '56%',
              left: '50%',
              right: 'auto',
              bottom: 'auto',
              marginRight: '-50%',
              transform: 'translate(-50%, -50%)',
              width: '50%', 
              height: 'auto',
              padding: '20px',
              position: 'relative',
              borderRadius: '10px',
              overflow: 'hidden',
            },
            overlay: {
              backgroundColor: 'rgba(0, 0, 0, 0.75)',
            }
          }}
        >
          <button
            onClick={closeModal}
            style={{
              position: 'absolute',
              top: '20px',
              right: '10px',
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#333',
            }}
          >
            &#10005;
          </button>
          <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Document Preview</h2>
          {documentImage ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <img 
                src={documentImage} 
                alt="Document Image" 
                style={{ maxWidth: '80%', maxHeight: '500px', objectFit: 'contain' }} 
              />
            </div>
          ) : (
            <p>No document available</p>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default ViewDocuments;
