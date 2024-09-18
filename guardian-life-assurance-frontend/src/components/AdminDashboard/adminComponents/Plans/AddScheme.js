import React, { useState, useEffect, useRef } from "react";
import { createInsuranceScheme } from "../../../../services/adminServices";
import {
  showToastSuccess,
  showToastError,
} from "../../../../utils/toast/Toast";
import { getRequiredDocuments } from "../../../../services/gaurdianLifeAssuranceServices";
import JoditEditor from "jodit-react";
import "./AddScheme.css";
import { useParams } from "react-router-dom";
import { verifyAdmin } from "../../../../services/authServices";
import { useNavigate } from "react-router-dom";

const AddScheme = ({ setRefreshNavbar }) => {
  const navigate = useNavigate();
  const { planId } = useParams();
  const [formData, setFormData] = useState({
    schemeName: "",
    description: "",
    detailDescription: "",
    minAmount: "",
    maxAmount: "",
    minPolicyTerm: "",
    maxPolicyTerm: "",
    minAge: "",
    maxAge: "",
    profitRatio: "",
    registrationCommRatio: "",
    installmentCommRatio: "",
    requiredDocuments: [],
  });
  const [schemeImage, setSchemeImage] = useState(null);
  const [error, setError] = useState(null);
  const [documentOptions, setDocumentOptions] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  const editor = useRef(null);

  useEffect(() => {
    const verify = async () => {
      const response = await verifyAdmin();
      if (!response) {
        navigate("/login");
        return;
      } else {
        setIsAdmin(true);
      }
    };
    verify();
  }, []);

  useEffect(() => {
    const fetchRequiredDocuments = async () => {
      try {
        const response = await getRequiredDocuments();
        setDocumentOptions(response);
      } catch (error) {
        console.error("Error fetching document types:", error);
        setError("Failed to load document types");
      }
    };

    fetchRequiredDocuments();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDetailDescriptionChange = (content) => {
    setFormData({
      ...formData,
      detailDescription: content,
    });
  };

  const handleFileChange = (e) => {
    setSchemeImage(e.target.files[0]);
  };

  const handleRequiredDocumentsChange = (e) => {
    const options = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setFormData({
      ...formData,
      requiredDocuments: options,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataObj = new FormData();

    formDataObj.append("schemeImage", schemeImage);

    Object.keys(formData).forEach((key) => {
      if (Array.isArray(formData[key])) {
        formData[key].forEach((item) => formDataObj.append(`${key}[]`, item));
      } else {
        formDataObj.append(key, formData[key]);
      }
    });

    try {
    const minAmount = parseFloat(formData.minAmount);
    const maxAmount = parseFloat(formData.maxAmount);
    const minPolicyTerm = parseInt(formData.minPolicyTerm, 10);
    const maxPolicyTerm = parseInt(formData.maxPolicyTerm, 10);
    const minAge = parseInt(formData.minAge, 10);
    const maxAge = parseInt(formData.maxAge, 10);
    const profitRatio = parseFloat(formData.profitRatio);
    const registrationCommRatio = parseFloat(formData.registrationCommRatio);
    const installmentCommRatio = parseFloat(formData.installmentCommRatio);

    if (minAmount >= maxAmount) {
      showToastError("Minimum amount should be less than the maximum amount.");
      return;
    }
    if (minPolicyTerm >= maxPolicyTerm) {
      showToastError("Minimum policy term should be less than the maximum policy term.");
      return;
    }
    if (minAge >= maxAge) {
      showToastError("Minimum age should be less than the maximum age.");
      return;
    }

    const numericFields = [
      { field: 'Min Amount', value: minAmount },
      { field: 'Max Amount', value: maxAmount },
      { field: 'Min Policy Term', value: minPolicyTerm },
      { field: 'Max Policy Term', value: maxPolicyTerm },
      { field: 'Min Age', value: minAge },
      { field: 'Max Age', value: maxAge },
      { field: 'Profit Ratio', value: profitRatio },
      { field: 'Registration Commission', value: registrationCommRatio },
      { field: 'Installment Commission', value: installmentCommRatio },
    ];

    for (const { field, value } of numericFields) {
      if (isNaN(value) || value < 0) {
        showToastError(`${field} should not be less than 0 and must be a valid number.`);
        return;
      }
    }
  
      await createInsuranceScheme(planId, formDataObj);
      showToastSuccess("Insurance scheme added successfully.");
      setFormData({
        schemeName: "",
        description: "",
        detailDescription: "",
        minAmount: "",
        maxAmount: "",
        minPolicyTerm: "",
        maxPolicyTerm: "",
        minAge: "",
        maxAge: "",
        profitRatio: "",
        registrationCommRatio: "",
        installmentCommRatio: "",
        requiredDocuments: [],
      });
      setSchemeImage(null);
      editor.current.value = "";
      setRefreshNavbar((prev) => !prev);
    } catch (error) {
      setError("Failed to add insurance scheme");
      showToastError("Failed to add insurance scheme");
    }
  };

  return (
    <>
      {isAdmin && (
        <div className="add-scheme-container">
          <h2>Add New Insurance Scheme</h2>
          <form onSubmit={handleSubmit} className="add-scheme-form">
            <div className="form-group">
              <label htmlFor="schemeName">Scheme Name</label>
              <input
                type="text"
                id="schemeName"
                name="schemeName"
                value={formData.schemeName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="detailDescription">Detail Description</label>
              <JoditEditor
                ref={editor}
                value={formData.detailDescription}
                onChange={handleDetailDescriptionChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="minAmount">Minimum Amount</label>
              <input
                type="number"
                id="minAmount"
                name="minAmount"
                value={formData.minAmount}
                onChange={handleInputChange}
                min="0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="maxAmount">Maximum Amount</label>
              <input
                type="number"
                id="maxAmount"
                name="maxAmount"
                value={formData.maxAmount}
                onChange={handleInputChange}
                min="0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="minPolicyTerm">Minimum Policy Term</label>
              <input
                type="number"
                id="minPolicyTerm"
                name="minPolicyTerm"
                value={formData.minPolicyTerm}
                onChange={handleInputChange}
                min="0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="maxPolicyTerm">Maximum Policy Term</label>
              <input
                type="number"
                id="maxPolicyTerm"
                name="maxPolicyTerm"
                value={formData.maxPolicyTerm}
                onChange={handleInputChange}
                min="0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="minAge">Minimum Age</label>
              <input
                type="number"
                id="minAge"
                name="minAge"
                value={formData.minAge}
                onChange={handleInputChange}
                min="0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="maxAge">Maximum Age</label>
              <input
                type="number"
                id="maxAge"
                name="maxAge"
                value={formData.maxAge}
                onChange={handleInputChange}
                min="0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="profitRatio">Profit Ratio</label>
              <input
                type="number"
                id="profitRatio"
                name="profitRatio"
                value={formData.profitRatio}
                onChange={handleInputChange}
                min="0"
                step="0.1"
              />
            </div>

            <div className="form-group">
              <label htmlFor="registrationCommRatio">
                Registration Commission Amount
              </label>
              <input
                type="number"
                id="registrationCommRatio"
                name="registrationCommRatio"
                value={formData.registrationCommRatio}
                onChange={handleInputChange}
                min="0"
                step="0.1"
              />
            </div>

            <div className="form-group">
              <label htmlFor="installmentCommRatio">
                Installment Commission Ratio
              </label>
              <input
                type="number"
                id="installmentCommRatio"
                name="installmentCommRatio"
                value={formData.installmentCommRatio}
                onChange={handleInputChange}
                min="0"
                step="0.1"
              />
            </div>

            <div className="form-group">
              <label htmlFor="requiredDocuments">Required Documents</label>
              <select
                multiple
                id="requiredDocuments"
                name="requiredDocuments"
                value={formData.requiredDocuments}
                onChange={handleRequiredDocumentsChange}
                required
              >
                {documentOptions.map((doc) => (
                  <option key={doc} value={doc}>
                    {doc}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="schemeImage">Scheme Image</label>
              <input
                type="file"
                id="schemeImage"
                name="schemeImage"
                onChange={handleFileChange}
                required
              />
            </div>

            {error && <div className="error">{error}</div>}

            <button type="submit" className="submit-button">
              Add Scheme
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default AddScheme;
