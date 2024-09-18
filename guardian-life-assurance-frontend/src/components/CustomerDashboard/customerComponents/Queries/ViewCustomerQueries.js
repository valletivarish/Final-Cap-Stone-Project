import React, { useState, useEffect, useCallback } from 'react';
import { getAllCustomerQueries } from '../../../../services/queriesServices';
import Table from '../../../../sharedComponents/Table/Table';
import { useParams, useSearchParams } from 'react-router-dom';
import Modal from 'react-modal';
import { debounce } from '../../../../utils/helpers/Debounce';
import { showToastError, showToastSuccess } from '../../../../utils/toast/Toast';
import { sanitizeCustomerQueryData } from '../../../../utils/helpers/SanitizeData';
import "../../../../components/Queries/ViewQueries.css"
import { deleteQuery } from '../../../../services/queriesServices';
Modal.setAppElement('#root');

const ViewCustomerQueries = () => {
  const { customerId } = useParams();
  const [queries, setQueries] = useState({});
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedQueryId, setSelectedQueryId] = useState(null);

  const page = parseInt(searchParams.get("page")) || 0;
  const size = parseInt(searchParams.get("size")) || 5;
  const sortBy = searchParams.get("sortBy") || "queryId";
  const direction = searchParams.get("direction") || "asc";
  const title = searchParams.get("title") || "";
  const resolved = searchParams.get("resolved") === "true" 
    ? true 
    : searchParams.get("resolved") === "false"
    ? false
    : null;

  const debouncedFetchQueries = useCallback(
    debounce(async (params) => {
      try {
        const response = await getAllCustomerQueries(customerId, params);
        const sanitizedData = sanitizeCustomerQueryData(
          response, 
          ["customerId", "queryId", "title", "message", "resolved", "resolvedAt", "resolvedBy"], 
          handleRespond
        );
        setQueries(sanitizedData);
      } catch (err) {
        setError("Failed to fetch queries");
        showToastError("Failed to fetch queries");
      }
    }, 300),
    [customerId]
  );

  useEffect(() => {
    const params = {
      page, size, sortBy, direction, title, resolved,
    };
    debouncedFetchQueries(params);
  }, [page, size, sortBy, direction, title, resolved, debouncedFetchQueries]);

  const handleSearchChange = (key, value) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      if (value !== null && value !== '') {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
      return newParams;
    });
  };

  const handleRespond = (queryId) => {
    setSelectedQueryId(queryId);
    setModalOpen(true);
  };

  const handleConfirmDelete =async () => {
    try{
      const response=await deleteQuery(customerId,selectedQueryId);
      const params = {
        page, size, sortBy, direction, title, resolved,
      };
      debouncedFetchQueries(params);
      showToastSuccess(`Query ID ${selectedQueryId} deleted successfully`);
      setModalOpen(false);
    }
    catch(error){
      showToastError(error.message);
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  const modalStyles = {
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      zIndex: 1000,
    },
    content: {
      top: '50%',
      left: '5%',
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
      backgroundColor: 'white',
    },
  };

  const buttonStyles = {
    confirm: {
      padding: '10px 20px',
      cursor: 'pointer',
      border: 'none',
      borderRadius: '4px',
      backgroundColor: 'red',
      color: 'white',
      transition: 'background-color 0.3s',
    },
    cancel: {
      padding: '10px 20px',
      cursor: 'pointer',
      border: 'none',
      borderRadius: '4px',
      backgroundColor: 'gray',
      color: 'white',
      transition: 'background-color 0.3s',
    },
  };

  return (
    <div className='view-all-queries-container'>
      <div className='view-all-queries-card'>
        <h1 className="view-all-queries-header">View All Queries</h1>
        <div className='filters'>
          <input
            type="text"
            placeholder="Search by Title"
            value={title}
            onChange={(e) => handleSearchChange("title", e.target.value)}
          />
          <select
            value={resolved !== null ? resolved : ""}
            onChange={(e) => handleSearchChange("resolved", e.target.value)}
          >
            <option value="">All Resolutions</option>
            <option value="true">Resolved</option>
            <option value="false">Unresolved</option>
          </select>
        </div>
        <Table
          data={queries}
          searchParams={searchParams}
          setSearchParams={setSearchParams}
          paginationData={queries}
        />
      </div>

      <Modal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        overlayClassName="react-modal-overlay"
        className="react-modal-content"
        style={modalStyles}
      >
        <h2>Are you sure you want to delete this query ?</h2>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
          <button style={buttonStyles.confirm} onClick={handleConfirmDelete}>
            Confirm
          </button>
          <button style={buttonStyles.cancel} onClick={() => setModalOpen(false)}>
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default ViewCustomerQueries;
