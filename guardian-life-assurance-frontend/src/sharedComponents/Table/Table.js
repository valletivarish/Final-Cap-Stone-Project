import React from "react";
import "./Table.css";
import Pagination from "../Pagination/Pagination";
import Dropdown from "../Dropdown/Dropdown";

const Table = (props) => {
  const { data, setSearchParams, searchParams } = props;

  if (data && data.content && data.content.length > 0) {
    const content = data.content;


    const tableHeaders = (
      <tr>
        {Object.keys(content[0]).map((key) => (
          <th key={key}>{key}</th> 
        ))}
      </tr>
    );

    const tableData = content.map((d, index) => (
      <tr key={index}>
        {Object.keys(d).map((k) => (
          <td key={k}>{d[k]}</td>
        ))}
      </tr>
    ));

    return (
      <div className="table-container">
        <table className="table">
          <thead className="thead">
            {tableHeaders}
          </thead>
          <tbody>
            {tableData}
          </tbody>
        </table>
        <div className="pagination-section">
          <Dropdown
            searchParams={searchParams}
            setSearchParams={setSearchParams}
            data={data}
            className="custom-dropdown"
          />
          <Pagination
            searchParams={searchParams}
            setSearchParams={setSearchParams}
            data={data}
          />
        </div>
      </div>
    );
  } else {
    return <div>No data available</div>;
  }
};

export default Table;
