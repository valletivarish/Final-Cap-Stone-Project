import React, { useState, useEffect, useCallback } from 'react';
import { getAllQueries, respondToQuery } from '../../services/queriesServices';
import Table from '../../sharedComponents/Table/Table';
import ResponseModal from '../../../src/components/Queries/ResponseModal';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { debounce } from '../../utils/helpers/Debounce';
import { showToastError, showToastSuccess } from '../../utils/toast/Toast';
import { sanitizeQueryData } from '../../utils/helpers/SanitizeData';
import "./ViewQueries.css"

const ViewQueries = () => {
  const [queries, setQueries] = useState({});
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedQueryId, setSelectedQueryId] = useState(null);
  const navigate = useNavigate();

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
        const response = await getAllQueries(params);
        const sanitizedData = sanitizeQueryData(response, ["customerId", "queryId", "title", "message","response", "resolved","resolvedAt","resolvedBy"], handleRespond);
        setQueries(sanitizedData);
      } catch (err) {
        setError("Failed to fetch queries");
        showToastError("Failed to fetch queries");
      }
    }, 300),
    []
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

  const handleSubmitResponse = async (response) => {
    try {
      await respondToQuery(selectedQueryId, response);
      debouncedFetchQueries({ page, size, sortBy, direction, title, resolved });
      showToastSuccess("Response recorded successfully");
    } catch (error) {
      setError("Failed to respond to query");
      showToastError("Failed to respond to query");
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="view-all-queries-container">
      <div className="view-all-queries-card">
        <h1 className="view-all-queries-header">View All Queries</h1>
        <div className="filters">
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
      <ResponseModal 
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmitResponse}
      />
    </div>
  );
};

export default ViewQueries;
