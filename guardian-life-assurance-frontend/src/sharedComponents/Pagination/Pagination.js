import React from "react";
import { Pagination as BootstrapPagination } from "react-bootstrap";
import "./Pagination.css";

const Pagination = (props) => {
  const { data, setSearchParams, searchParams} =
    props;
  const { totalPages, page } = data;

  const renderPaginationItems = () => {
    const pages = [];
    
    if (totalPages > 0) {
      // First Page
      if (page > 0) {
        pages.push(
          <BootstrapPagination.Item
            key="first"
            className="pagination-control"
            onClick={() =>{
              const currentParams=Object.fromEntries(searchParams);
              currentParams.page=0;
              setSearchParams(currentParams);
            }}
          >
            &lt;&lt;&lt;
          </BootstrapPagination.Item>
        );
      }

      // Previous Page
      if (page > 0) {
        pages.push(
          <BootstrapPagination.Item
            key="prev"
            className="pagination-control"
            onClick={() => {
              const currentParams = Object.fromEntries(searchParams);
              currentParams.page = page - 1;
              setSearchParams(currentParams);
            }}
          >
            &lt;&lt;
          </BootstrapPagination.Item>
        );
      }

      // Page Numbers
      for (let i = 0; i < totalPages; i++) {
        pages.push(
          <BootstrapPagination.Item
            key={i}
            className={`pagination-item ${i === page ? "active" : ""}`}
            onClick={() => {
              const currentParams = Object.fromEntries(searchParams);
              currentParams.page = i;
              setSearchParams(currentParams);
            }}
          >
            {i + 1}
          </BootstrapPagination.Item>
        );
      }

      // Next Page
      if (page < totalPages - 1) {
        pages.push(
          <BootstrapPagination.Item
            key="next"
            className="pagination-control"
            onClick={() => {
              const currentParams = Object.fromEntries(searchParams);
              currentParams.page = page + 1;
              setSearchParams(currentParams);
            }}
          >
            &gt;&gt;
          </BootstrapPagination.Item>
        );
      }

      // Last Page
      if (totalPages > 0 && page < totalPages - 1) {
        pages.push(
          <BootstrapPagination.Item
            key="last"
            className="pagination-control"
            onClick={() => {
              const currentParams = Object.fromEntries(searchParams);
              currentParams.page = totalPages - 1;
              setSearchParams(currentParams);
            }}
          >
            &gt;&gt;&gt;
          </BootstrapPagination.Item>
        );
      }
    }

    return pages;
  };

  return (
    <div className="custom-pagination">
      <BootstrapPagination className="pagination">
        {renderPaginationItems()}
      </BootstrapPagination>
    </div>
  );
};

export default Pagination;
