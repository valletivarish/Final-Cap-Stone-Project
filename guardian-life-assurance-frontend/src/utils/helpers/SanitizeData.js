export const sanitizeAgentData = (data, keysToBeIncluded, handleEdit, handleToggle) => {
  const keyMapping = {
    agentId: "Agent ID",
    firstName: "First Name",
    lastName: "Last Name",
    email: "Email",
    username: "Username",
    state: "State",
    city: "City",
    status: "Status",
  };
  
  const sanitizedContent = data.content.map((agent) => {
    const sanitizedAgent = {};

    keysToBeIncluded.forEach((key) => {
      if (key === "status") {
        sanitizedAgent[keyMapping[key]] = agent.status ? "Active" : "Inactive";
      } else {
        sanitizedAgent[keyMapping[key]] = agent[key];
      }
    });

    sanitizedAgent.actions = (
      <div className="table-buttons">
        <button className="button edit" onClick={() => handleEdit(agent.agentId)}>
          Edit
        </button>
        <button
          className={`button ${agent.status ? 'deactivate' : 'activate'}`}
          onClick={() => handleToggle(agent.agentId, agent.status)}
        >
          {agent.status ? 'Deactivate' : 'Activate'}
        </button>
      </div>
    );

    return sanitizedAgent;
  });

  return {
    ...data,
    content: sanitizedContent,
  };
};


export const sanitizeStateData = (
  data,
  keysToBeIncluded,
  handleActivateDeactivate,
  handleEdit
) => {
  const sanitizedContent = data.content.map((state) => {
    const sanitizedState = {};

    keysToBeIncluded.forEach((key) => {
      if (key === "active") {
        sanitizedState[key] = state.active ? "Active" : "Inactive";
      } else {
        sanitizedState[key] = state[key];
      }
    });

    sanitizedState.actions = (
      <div className="table-buttons">
        <button
          className={
            state.active ? "deactivate button" : "activate button"
          }
          onClick={() => handleActivateDeactivate(state.id, state.active)}
        >
          {state.active ? "Deactivate" : "Activate"}
        </button>
        <button
          className="edit button"
          onClick={() => handleEdit(state.id)}
        >
          Edit
        </button>
      </div>
    );

    return sanitizedState;
  });

  return {
    ...data,
    content: sanitizedContent,
  };
};
export const sanitizeCityData = (
  data,
  keysToBeIncluded,
  handleActivateDeactivate,
  handleEdit
) => {
  const sanitizedContent = data.content.map((city) => {
    const sanitizedCity = {};

    keysToBeIncluded.forEach((key) => {
      if (key === "active") {
        sanitizedCity[key] = city.active ? "Active" : "Inactive";
      } else {
        sanitizedCity[key] = city[key];
      }
    });

    sanitizedCity.actions = (
      <div className="table-buttons">
        <button
          className={
            city.active ? "button deactivate" : "button activate"
          }
          onClick={() => handleActivateDeactivate(city.id, city.active)}
        >
          {city.active ? "Deactivate" : "Activate"}
        </button>
        <button
          className="edit-city-button"
          onClick={() => handleEdit(city.id)}
        >
          Edit
        </button>
      </div>
    );

    return sanitizedCity;
  });

  return {
    ...data,
    content: sanitizedContent,
  };
};
export const sanitizePlanData = (plans, handleEdit, handleToggleStatus) => {
  const sanitizedContent = plans.content.map((plan) => {
    const sanitizedPlan = {
      id: plan.planId,
      "plan Name": plan.planName,
      active: plan.active ? "Active" : "Inactive",
    };

    sanitizedPlan.actions = (
      <div className="table-buttons">
        <button
          className={plan.active ? "button deactivate" : "button activate"}
          onClick={() => handleToggleStatus(plan.planId, plan.active)}
        >
          {plan.active ? "Deactivate" : "Activate"}
        </button>
        <button
          className="button edit"
          onClick={() => handleEdit(plan.planId, plan)}
        >
          Edit
        </button>
      </div>
    );

    return sanitizedPlan;
  });

  return {
    ...plans,
    content: sanitizedContent,
  };
};
export const sanitizeSchemeData = (data, keysToBeIncluded, handleShowMore) => {
  const keyMapping = {
    schemeId: "Scheme Id",
    schemeName: "Scheme Name",
    planName: "plan name",
    active: "active",
    minAmount: "min amount",
    maxAmount: "max amount",
    schemeImage: "scheme image",
  };
  const sanitizedContent = data.content.map((scheme) => {
    const sanitizedScheme = {};

    keysToBeIncluded.forEach((key) => {
      if (key === "active") {
        sanitizedScheme[keyMapping[key]] = scheme.active ? "Active" : "Inactive";
      } else if (key === "schemeImage") {
        sanitizedScheme[keyMapping[key]] = scheme.image ? (
          <img
            src={`data:image/jpeg;base64,${scheme.image}`}
            alt={scheme.schemeName}
            style={{ width: "100px", height: "50px" }}
          />
        ) : (
          "No Image"
        );
      } else {
        sanitizedScheme[keyMapping[key]] = scheme[key];
      }
    });

    sanitizedScheme.actions = (
      <div className="table-buttons">
        <button
          className="button orange"
          onClick={() => handleShowMore(scheme.schemeId)}
        >
          Show More
        </button>
      </div>
    );

    return sanitizedScheme;
  });

  return {
    ...data,
    content: sanitizedContent,
  };
};
export const sanitizeAgentWithdrawalData=(data,keysToBeIncluded)=>{
  const keyMapping = {
    withdrawalRequestId: "Withdrawal Request Id",
    agentId: "Agent Id",
    agentName: "Agent Name",
    amount: "Amount",
    approvedAt: "Approved At",
    requestDate: "Request Date",
    requestType: "Request Type",
    status: "Status",
  };
  const sanitizedContent = data.content.map((withdrawal) => {
    const sanitizedWithdrawal = {};

    keysToBeIncluded.forEach((key) => {
      sanitizedWithdrawal[keyMapping[key]] =
        withdrawal[key] !== null && withdrawal[key] !== undefined
          ? withdrawal[key]
          : "N/A";
    });
    return sanitizedWithdrawal;
  });

  return {
    ...data,
    content: sanitizedContent,
  };
};

export const sanitizeWithdrawalData = (data, keysToBeIncluded,handleApprove,handleReject) => {
  const keyMapping = {
    withdrawalRequestId: "Withdrawal Request Id",
    agentId: "Agent Id",
    agentName: "Agent Name",
    amount: "Amount",
    approvedAt: "Approved At",
    requestDate: "Request Date",
    requestType: "Request Type",
    status: "Status",
  };
  const sanitizedContent = data.content.map((withdrawal) => {
    const sanitizedWithdrawal = {};

    keysToBeIncluded.forEach((key) => {
      sanitizedWithdrawal[keyMapping[key]] =
        withdrawal[key] !== null && withdrawal[key] !== undefined
          ? withdrawal[key]
          : "N/A";
    });
    if (withdrawal.status === "PENDING") {
      sanitizedWithdrawal.actions = (
        <div>
          <button
            className="activate button"
            onClick={() => handleApprove(withdrawal.withdrawalRequestId)}
          >
            Approve
          </button>
          <button
            className="deactivate button"
            onClick={() => handleReject(withdrawal.withdrawalRequestId)}
          >
            Reject
          </button>
        </div>
      );
    } else {
      sanitizedWithdrawal.actions =
        withdrawal.status === "APPROVED" ? "Approved" : "Rejected";
    }

    return sanitizedWithdrawal;
  });

  return {
    ...data,
    content: sanitizedContent,
  };
};
export const sanitizeAgentCustomerData = (
  data,
  keysToBeIncluded
) => {
  console.log(data);
  const keyMapping = {
    customerId: "Customer ID",
    firstName: "First Name",
    lastName: "Last Name",
    email: "Email",
    dateOfBirth: "Date of Birth",
    city: "City",
    state: "State",
  };

  const sanitizedContent = data.content.map((customer) => {
    const sanitizedCustomer = {};

    keysToBeIncluded.forEach((key) => {
      sanitizedCustomer[keyMapping[key]] =
        customer[key] !== null && customer[key] !== undefined
          ? customer[key]
          : "N/A";
    });
    return sanitizedCustomer;
  });

  return {
    ...data,
    content: sanitizedContent,
  };
};

export const sanitizeCustomerData = (
  data,
  keysToBeIncluded,
  handleDeactivate,
  handleActivate
) => {
  const keyMapping = {
    customerId: "Customer ID",
    firstName: "First Name",
    lastName: "Last Name",
    email: "Email",
    dateOfBirth: "Date of Birth",
    city: "City",
    state: "State",
  };

  const sanitizedContent = data.content.map((customer) => {
    const sanitizedCustomer = {};

    keysToBeIncluded.forEach((key) => {
      sanitizedCustomer[keyMapping[key]] =
        customer[key] !== null && customer[key] !== undefined
          ? customer[key]
          : "N/A";
    });
    sanitizedCustomer.actions = customer.active ? (
      <div>
        <button
          className="button deactivate"
          onClick={() => handleDeactivate(customer.customerId)}
        >
          Deactivate
        </button>
      </div>
    ) : (
      <button
        className="button activate"
        onClick={() => handleActivate(customer.customerId)}
      >
        Activate
      </button>
    );

    return sanitizedCustomer;
  });

  return {
    ...data,
    content: sanitizedContent,
  };
};

export const sanitizeAgentEarningsData = (data, keysToBeIncluded) => {
  const keyMapping = {
    id: "Earning ID",
    amount: "Amount",
    withdrawalDate: "Withdrawal Date",
    name: "Agent Name", // Only include if needed
    agentId: "Agent ID" // Only include if needed
  };

  const sanitizedContent = data.content.map((earning) => {
    const sanitizedEarning = {};
    keysToBeIncluded.forEach((key) => {
      if (keyMapping[key]) {
        sanitizedEarning[keyMapping[key]] = earning[key] !== null ? earning[key] : "N/A";
      }
    });
    return sanitizedEarning;
  });

  return {
    ...data,
    content: sanitizedContent,
  };
};

export const sanitizePolicyData = (data, keysToBeIncluded) => {
  const keyMapping = {
    customerName: "Customer Name",
    customerCity: "City",
    customerState: "State",
    email: "Email",
    phoneNumber: "Phone Number",
    agentName: "Agent Name",
    policyNo: "Policy Number",
    insurancePlan: "Insurance Plan",
    insuranceScheme: "Insurance Scheme",
    maturityDate: "Maturity Date",
    premiumType: "Premium Type",
    premiumAmount: "Premium Amount",
    sumAssured: "Sum Assured",
    profitRatio: "Profit Ratio",
    policyStatus: "Policy Status",
  };

  const sanitizedContent = data.content.map((policy) => {
    const sanitizedPolicy = {};

    keysToBeIncluded.forEach((key) => {
      sanitizedPolicy[keyMapping[key]] =
        policy[key] !== null && policy[key] !== undefined ? policy[key] : "N/A";
    });

    return sanitizedPolicy;
  });

  return {
    ...data,
    content: sanitizedContent,
  };
};
export const sanitizePaymentData = (data, keysToBeIncluded) => {
  console.log(data)
  const keyMapping = {
    paymentId: "Payment ID",
    amount: "Amount",
    policyNo: "Policy No",
    status: "Status",
    paymentDate: "Payment Date",
  };

  const sanitizedContent = data.content.map((payment) => {
    const sanitizedPayment = {};

    keysToBeIncluded.forEach((key) => {
      sanitizedPayment[keyMapping[key]] =
        payment[key] !== null && payment[key] !== undefined
          ? payment[key]
          : "N/A";
    });

    return sanitizedPayment;
  });

  return {
    ...data,
    content: sanitizedContent,
  };
};
export const sanitizeCommissionData = (data, keysToBeIncluded) => {
  const keyMapping = {
    commissionId: "Commission ID",
    commissionType: "Commission Type",
    issueDate: "Issue Date",
    amount: "Amount",
    agentId: "Agent Id",
    agentName: "Agent Name",
  };

  const sanitizedContent = data.content.map((commission) => {
    const sanitizedCommission = {};

    keysToBeIncluded.forEach((key) => {
      sanitizedCommission[keyMapping[key]] =
        commission[key] !== null && commission[key] !== undefined
          ? commission[key]
          : "N/A";
    });

    return sanitizedCommission;
  });

  return {
    ...data,
    content: sanitizedContent,
  };
};
export const sanitizeClaimData = (
  data,
  keysToBeIncluded,
  handleApprove,
  handleReject
) => {
  const keyMapping = {
    claimId: "Claim ID",
    policyNo: "Policy Number",
    claimAmount: "Claim Amount",
    claimReason: "Claim Reason",
    claimDate: "Claim Date",
    status: "Status",
    approvalDate: "Approval Date",
    rejectionDate: "Rejection Date",
  };

  
  const formatDate = (date) => {
    if (!date) return "N/A";
    const d = new Date(date);
    const year = d.getFullYear();
    const month = `0${d.getMonth() + 1}`.slice(-2); 
    const day = `0${d.getDate()}`.slice(-2); 
    return `${year}-${month}-${day}`;
  };

  const sanitizedContent = data.content.map((claim) => {
    const sanitizedClaim = {};

    keysToBeIncluded.forEach((key) => {
      if (
        key === "claimDate" ||
        key === "approvalDate" ||
        key === "rejectionDate"
      ) {
        sanitizedClaim[keyMapping[key]] = formatDate(claim[key]);
      } else {
        sanitizedClaim[keyMapping[key]] =
          claim[key] !== null && claim[key] !== undefined ? claim[key] : "N/A";
      }
    });

    if (claim.status === "PENDING") {
      sanitizedClaim.actions = (
        <div>
          <button
            className="approve-button"
            onClick={() => handleApprove(claim.claimId)}
          >
            Approve
          </button>
          <button
            className="reject-button"
            onClick={() => handleReject(claim.claimId)}
          >
            Reject
          </button>
        </div>
      );
    } else {
      sanitizedClaim.actions =
        claim.status === "APPROVED" ? "Approved" : "Rejected";
    }

    return sanitizedClaim;
  });

  return {
    ...data,
    content: sanitizedContent,
  };
};
export const sanitizeAgentPolicyClaimData = (
  data,
  keysToBeIncluded,
) => {
  const keyMapping = {
    claimId: "Claim ID",
    policyNo: "Policy Number",
    claimAmount: "Claim Amount",
    claimReason: "Claim Reason",
    claimDate: "Claim Date",
    status: "Status",
    approvalDate: "Approval Date",
    rejectionDate: "Rejection Date",
  };

  
  const formatDate = (date) => {
    if (!date) return "N/A";
    const d = new Date(date);
    const year = d.getFullYear();
    const month = `0${d.getMonth() + 1}`.slice(-2); 
    const day = `0${d.getDate()}`.slice(-2); 
    return `${year}-${month}-${day}`;
  };

  const sanitizedContent = data.content.map((claim) => {
    const sanitizedClaim = {};

    keysToBeIncluded.forEach((key) => {
      if (
        key === "claimDate" ||
        key === "approvalDate" ||
        key === "rejectionDate"
      ) {
        sanitizedClaim[keyMapping[key]] = formatDate(claim[key]);
      } else {
        sanitizedClaim[keyMapping[key]] =
          claim[key] !== null && claim[key] !== undefined ? claim[key] : "N/A";
      }
    });
    return sanitizedClaim;
  });

  return {
    ...data,
    content: sanitizedContent,
  };
};
export const sanitizeEmployeeData = (data, keysToBeIncluded, handleDelete, handleEdit) => {
  const sanitizedContent = data.content.map(employee => {
      const sanitizedEmployee = {};

      keysToBeIncluded.forEach(key => {
          if (key === 'active') {
              sanitizedEmployee[key] = employee.status ? 'Active' : 'Inactive';
          } else {
              sanitizedEmployee[key] = employee[key];
          }
      });

      sanitizedEmployee.actions = (
          <div className="table-buttons">
              {employee.active && (
                  <button
                      className="deactivate button"
                      onClick={() => handleDelete(employee.employeeId)}
                  >
                      Deactivate
                  </button>
              )}
              <button
                  className="edit button"
                  onClick={() => handleEdit(employee.employeeId)}
              >
                  Edit
              </button>
          </div>
      );

      return sanitizedEmployee;
  });

  return {
      ...data,
      content: sanitizedContent,
  };
};
export const sanitizeQueryData = (data, keysToBeIncluded, handleRespond) => {
  const keyMapping = {
    queryId: "Query ID",
    customerId: "Customer ID",
    title: "Title",
    message: "Message",
    resolved: "Resolved",
    resolvedAt: "resolved At",
    resolvedBy: "resolved By"
  };

  const sanitizedContent = data.content.map((query) => {
    const sanitizedQuery = {};

    keysToBeIncluded.forEach((key) => {
      if (key === "resolved") {
        sanitizedQuery[keyMapping[key]] = query[key] ? "Resolved" : "Unresolved";
      } else {
        sanitizedQuery[keyMapping[key]] =
          query[key] !== null && query[key] !== undefined ? query[key] : "N/A";
      }
    });

    if (!query.resolved) {
      sanitizedQuery.actions = (
        <button
          className="orange button"
          onClick={() => handleRespond(query.queryId)}
        >
          Respond
        </button>
      );
    } else {
      sanitizedQuery.actions = "No Actions!";
    }

    return sanitizedQuery;
  });

  return {
    ...data,
    content: sanitizedContent,
  };
};
export const sanitizeCustomerQueryData = (data, keysToBeIncluded, handleRespond) => {
  const keyMapping = {
    queryId: "Query ID",
    customerId: "Customer ID",
    title: "Title",
    message: "Message",
    resolved: "Resolved",
    resolvedAt: "Resolved At",
    resolvedBy: "Resolved By",
  };

  const sanitizedContent = data.content.map((query) => {
    const sanitizedQuery = {};

    keysToBeIncluded.forEach((key) => {
      if (key === "resolved") {
        sanitizedQuery[keyMapping[key]] = query[key] ? "Resolved" : "Unresolved";
      } else {
        sanitizedQuery[keyMapping[key]] =
          query[key] !== null && query[key] !== undefined ? query[key] : "N/A";
      }
    });


    sanitizedQuery[""] = (
      <span
        className="cross-icon"
        onClick={() => handleRespond(query.queryId)}
      >
        &#x2716;
      </span>
    );

    return sanitizedQuery;
  });

  return {
    ...data,
    content: sanitizedContent,
  };
};



export const sanitizeDocumentData = (
  data,
  keysToBeIncluded,
  handleViewDocument,
  handleApprove,
  handleReject
) => {
  const keyMapping = {
    documentId: "Document ID",
    documentName: "Document Name",
    verified: "Verified",
    customerName: "Customer Name",
    verifiedBy: "Verified By",
  };

  const sanitizedContent = data.content.map((document) => {
    const sanitizedDocument = {};

    keysToBeIncluded.forEach((key) => {
      if (key === "verified") {
        // Show "Verified" if true, "Not Verified" if false
        sanitizedDocument[keyMapping[key]] = document.verified ? "Verified" : "Not Verified";
      } else if (key === "verifiedBy") {
        // Display the verifiedBy employee, or "Not Verified" if no one has verified it yet
        sanitizedDocument[keyMapping[key]] = document.verifiedBy
          ? `${document.verifiedBy}`
          : "Not Verified";
      } else {
        sanitizedDocument[keyMapping[key]] =
          document[key] !== null && document[key] !== undefined ? document[key] : "N/A";
      }
    });

    // Show approve/reject buttons only if verifiedBy is null
    const showActions = !document.verifiedBy;

    // Add action buttons for view, approve, and reject
    sanitizedDocument.actions = (
      <div>
        <button className="edit button" onClick={() => handleViewDocument(document.documentId)}>
          View
        </button>
        {showActions && (
          <>
            <button className="activate button" onClick={() => handleApprove(document.documentId)}>
              Approve
            </button>
            <button className="deactivate button" onClick={() => handleReject(document.documentId)}>
              Reject
            </button>
          </>
        )}
      </div>
    );

    return sanitizedDocument;
  });

  return {
    ...data,
    content: sanitizedContent,
  };
};



export const sanitizeCustomerPolicyData = (data, keysToBeIncluded, handleShowMore) => {
  const keyMapping = {
    policyNo: "Policy Number",
    insurancePlan: "Insurance Plan",
    insuranceScheme: "Insurance Scheme",
    dateCreated: "Date Created",
    maturityDate: "Maturity Date",
    premiumType: "Premium Type",
    premiumAmount: "Premium Amount",
    profitRatio: "Profit Ratio",
    sumAssured: "Sum Assured",
    policyStatus:"Policy Status"
  };

  const sanitizedContent = data.content.map((policy) => {
    const sanitizedPolicy = {};

    keysToBeIncluded.forEach((key) => {
      sanitizedPolicy[keyMapping[key]] = policy[key] !== null ? policy[key] : "N/A";
    });

    sanitizedPolicy.actions = (
      <button className="button edit" onClick={() => handleShowMore(policy.policyNo)}>
        Show More
      </button>
    );

    return sanitizedPolicy;
  });

  return {
    ...data,
    content: sanitizedContent,
  };
};

export const sanitizeRecommendationData = (data, keysToBeIncluded, handleRecommendPlan) => {
  const keyMapping = {
    customerId: "Customer ID",
    firstName: "First Name",
    lastName: "Last Name",
    email: "Email",
    dateOfBirth: "Date of Birth",
    city: "City",
    state: "State",
  };

  const sanitizedContent = data.content.map((customer) => {
    const sanitizedCustomer = {};

    keysToBeIncluded.forEach((key) => {
      sanitizedCustomer[keyMapping[key]] = customer[key] !== null && customer[key] !== undefined
        ? customer[key]
        : "N/A";
    });

    sanitizedCustomer.actions = (
      <button
        className="button orange"
        onClick={() => handleRecommendPlan(customer.customerId)}
      >
        Recommend Plan
      </button>
    );

    return sanitizedCustomer;
  });

  return {
    ...data,
    content: sanitizedContent,
  };
};
