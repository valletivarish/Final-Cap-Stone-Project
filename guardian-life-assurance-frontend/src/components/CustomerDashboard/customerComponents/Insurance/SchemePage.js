import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  fetchSchemesByPlanId,
  fetchSchemeImage,
  calculateInterest,
} from "../../../../services/insuranceManagementServices";
import { fetchCustomerAge } from "../../../../services/customerServices";
import { initiateCheckout } from "../../../../services/insuranceManagementServices";
import "./SchemePage.css";
import { showToastError } from "../../../../utils/toast/Toast";
import { useSearchParams } from "react-router-dom";

const SchemePage = () => {
  const { planId } = useParams();
  const [schemes, setSchemes] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState({});
  const [age, setAge] = useState(null);
  const [searchParams] = useSearchParams();
  const agentId = searchParams.get('AgentID');
  const [errorMessage, setErrorMessage] = useState("");
  const [numYears, setNumYears] = useState(1);
  const [investmentAmount, setInvestmentAmount] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(1);
  const [calculatedInstallment, setCalculatedInstallment] = useState(null);
  const [premiumType, setPremiumType] = useState("MONTHLY");
  const { customerId } = useParams();

  useEffect(() => {
    fetchCustomerDetails();
  }, []);

  const fetchCustomerDetails = async () => {
    try {
      const customerAge = await fetchCustomerAge();
      setAge(customerAge);
      fetchSchemes();
    } catch (error) {
      setErrorMessage("Failed to fetch customer details");
    }
  };

  const fetchSchemes = async () => {
    setLoading(true);
    try {
      const schemeData = await fetchSchemesByPlanId(planId, currentPage, 1);
      setSchemes(schemeData.content);
      setTotalPages(schemeData.totalPages);
      const imagePromises = schemeData.content.map(async (scheme) => {
        const imageUrl = await fetchSchemeImage(scheme.schemeId);
        return { schemeId: scheme.schemeId, imageUrl };
      });

      const imagesData = await Promise.all(imagePromises);
      const imagesMap = imagesData.reduce((acc, { schemeId, imageUrl }) => {
        acc[schemeId] = imageUrl;
        return acc;
      }, {});
      setImages(imagesMap);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(()=>{
    fetchSchemes();
  },[planId])

  const handleCalculate = async (schemeId) => {
    try {
      const interestData = await calculateInterest({
        schemeId,
        years: numYears,
        investAmount: investmentAmount,
        months: selectedMonth,
      });
      setCalculatedInstallment(interestData);
    } catch (error) {
      showToastError(error.message);
    }
  };

  const handleCheckout = async (scheme) => {
    const requestData = {
      insuranceSchemeId: scheme.schemeId,
      premiumType: premiumType,
      policyTerm: numYears,
      amount:calculatedInstallment.installmentAmount,
      premiumAmount:calculatedInstallment.assuredAmount-calculatedInstallment.interestAmount,
      assuredAmount:calculatedInstallment.assuredAmount,
      customerId,
      agentId: agentId ? agentId : 0
    };

    try {
      console.log(requestData);
      await initiateCheckout(requestData);
    } catch (error) {
      console.error("Error during checkout:", error);
    }
  };

  const isEligible = (scheme) => {
    return age >= scheme.minAge && age <= scheme.maxAge;
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      fetchSchemes();
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
      fetchSchemes();
    }
  };

  return (
    <div className="scheme-page">
      {loading && <p>Loading...</p>}
      {!loading &&
        schemes.length > 0 &&
        schemes.map((scheme) => (
          <div key={scheme.schemeId} className="scheme-container">
            <h1>{scheme.schemeName}</h1>
            {images[scheme.schemeId] && (
              <div className="scheme-image">
                <img src={images[scheme.schemeId]} alt={scheme.schemeName} />
              </div>
            )}
            
            <div className="scheme-description">
              <div dangerouslySetInnerHTML={{ __html: scheme.detailDescription }} />
            </div>
            <table className="scheme-table">
              <tbody>
                <tr>
                  <th>Minimum Amount</th>
                  <td>₹{scheme.minAmount}</td>
                </tr>
                <tr>
                  <th>Maximum Amount</th>
                  <td>₹{scheme.maxAmount}</td>
                </tr>
                <tr>
                  <th>Policy Term</th>
                  <td>
                    {scheme.minPolicyTerm} - {scheme.maxPolicyTerm} years
                  </td>
                </tr>
                <tr>
                  <th>Age Range</th>
                  <td>
                    {scheme.minAge} - {scheme.maxAge} years
                  </td>
                </tr>
                <tr>
                  <th>Profit Ratio</th>
                  <td>{scheme.profitRatio}%</td>
                </tr>
              </tbody>
            </table>
            {!isEligible(scheme) && (
              <p className="eligibility-message">
                You are not eligible for this scheme based on the age requirement.
              </p>
            )}
            {isEligible(scheme) && (
              <div className="investment-inputs">
                <table>
                  <tbody>
                    <tr>
                      <td>
                        <label>Number of Years:</label>
                      </td>
                      <td>
                        <input
                          type="number"
                          min="1"
                          value={numYears}
                          onChange={(e) => setNumYears(e.target.value)}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <label>Total Investment Amount:</label>
                      </td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          value={investmentAmount}
                          onChange={(e) => setInvestmentAmount(e.target.value)}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <label>Premium Type:</label>
                      </td>
                      <td>
                        <select
                          value={premiumType}
                          onChange={(e) => {
                            setPremiumType(e.target.value);
                            if (e.target.value === "MONTHLY") {
                              setSelectedMonth(1);
                            } else if (e.target.value === "QUARTERLY") {
                              setSelectedMonth(3);
                            } else if (e.target.value === "HALF_YEARLY") {
                              setSelectedMonth(6);
                            } else {
                              setSelectedMonth(12);
                            }
                          }}
                        >
                          <option value="MONTHLY">Monthly</option>
                          <option value="QUARTERLY">Quarterly</option>
                          <option value="HALF_YEARLY">Half-Yearly</option>
                          <option value="YEARLY">Yearly</option>
                        </select>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="2" className="calculate-button">
                        <button className="button edit" onClick={() => handleCalculate(scheme.schemeId)}>
                          Calculate Installment
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>

                {calculatedInstallment && (
                  <div className="installment-result">
                    <table className="installment-table">
                      <tbody>
                        <tr>
                          <th>Installment Details</th>
                        </tr>
                        <tr>
                          <td>Number of Installments:</td>
                          <td>{calculatedInstallment.noOfInstallments}</td>
                        </tr>
                        <tr>
                          <td>Installment Amount:</td>
                          <td>₹{calculatedInstallment.installmentAmount.toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td>Interest Amount:</td>
                          <td>₹{calculatedInstallment.interestAmount.toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td>Assured Amount:</td>
                          <td>₹{calculatedInstallment.assuredAmount.toFixed(2)}</td>
                        </tr>
                      </tbody>
                    </table>
                    <button className="button proceed" onClick={() => handleCheckout(scheme)}>
                      Proceed to Checkout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      <div className="pagination">
        <button onClick={handlePreviousPage} disabled={currentPage === 0}>
          Previous
        </button>
        <button onClick={handleNextPage} disabled={currentPage >= totalPages - 1}>
          Next
        </button>
      </div>
    </div>
  );
};

export default SchemePage;
