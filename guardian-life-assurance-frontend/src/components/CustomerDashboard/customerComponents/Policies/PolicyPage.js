import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { fetchAllPoliciesBtCustomerId } from "../../../../services/insuranceManagementServices";
import { sanitizeCustomerPolicyData } from "../../../../utils/helpers/SanitizeData";
import Table from "../../../../sharedComponents/Table/Table"; 
import { useNavigate } from "react-router-dom";
import './PolicyPage.css'
import { verifyCustomer } from "../../../../services/authServices";

const PolicyPage = () => {
  const { customerId,policyId } = useParams(); 
  const [policyData, setPolicyData] = useState(null);
  const [searchParams,setSearchParams]=useSearchParams();
  const navigate=useNavigate();
  const page = searchParams.get("page") || 0;
  const size = searchParams.get("size") || 5;
  const sortBy = searchParams.get("sortBy") || "policyNo";
  const direction = searchParams.get("direction") || "asc";

  const [isCustomer, setIsCustomer] = useState(false);

  useEffect(() => {
    const verifyCustomerAndNavigate = async () => {
      try {
        const response = await verifyCustomer();
        if (!response) {
          navigate("/login");
          return;
        } else {
          setIsCustomer(true);
        }
      } catch (error) {
        navigate("/login");
      }
    };
    verifyCustomerAndNavigate();
  }, []);

  const handleShowMore = (policyNo) => {
    console.log(`Show more details for policy: ${policyNo}`);
    navigate(`/customer-dashboard/${customerId}/policies/${policyNo}`);

  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchAllPoliciesBtCustomerId(customerId,{page,size,sortBy,direction});
        const sanitizedData = sanitizeCustomerPolicyData(
          data,
          [
            "policyNo",
            "insurancePlan",
            "insuranceScheme",
            "dateCreated",
            "maturityDate",
            "premiumType",
            "premiumAmount",
            "profitRatio",
            "sumAssured",
            "policyStatus"
          ],
          handleShowMore 
        );
        setPolicyData(sanitizedData);
      } catch (error) {
        console.error("Error fetching policies:", error);
      }
    };

    fetchData();
  }, [customerId,page,size,sortBy,direction]);

  return (
    <div className="view-policies-container">
      <h1 className="policy-page-header">Policy List</h1>
      {policyData ? (
        <div className="table-container">
          <Table
            data={policyData}
            searchParams={searchParams}
            setSearchParams={setSearchParams}
          />
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default PolicyPage;
