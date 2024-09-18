import React from "react";
import "./Dropdown.css";
import { useState,useEffect } from "react";
const Dropdown = (props) => {
  const { setSearchParams, searchParams } =
    props;
    const [size,setSize]=useState(parseInt(searchParams.get("size")) || 5);

    useEffect(()=>{
      setSize(parseInt(searchParams.get("size")) || 5);
    },[searchParams])

  const options = () => {
    const sizes = [];
    for (let i = 1; i < props.data.totalElements; i++) {
      if (i % 5 === 0 && i <= props.data.totalElements) {
        sizes.push(<option key={i} value={i}>{i}</option>);
      }
    }
    if (props.data.totalElements % 5 !== 0) {
      const roundedSize = Math.ceil(props.data.totalElements / 5) * 5;
      sizes.push(<option key={roundedSize} value={roundedSize}>{roundedSize}</option>);
    }
    return sizes;
  };
  const handleChange = (e) => {
    const updatedSearchParams=Object.fromEntries(searchParams);
    updatedSearchParams.size = e.target.value;
    updatedSearchParams.page=0;
    setSearchParams(updatedSearchParams);
  };

  return (
    <div className="dropdown-container">
      <select
        id="dropdown"
        className="form-select dropdown"
        aria-label="Select page size"
        onChange={handleChange}
        value={size}
      >
        <option key="default" value="" disabled>
          Element size
        </option>
        {options()}
      </select>
    </div>
  );
};

export default Dropdown;
