import React from 'react';
import './EmployeeCard.css';

// The card now receives 'user' and 'adminUid' as props
function EmployeeCard({ employee, onDelete, user, adminUid }) {
  
  // The delete button is only shown if a user is logged in AND their UID matches the admin's
  const showDeleteButton = user && user.uid === adminUid;

  return (
    <div className="employee-card">
      <img src={employee.photo} alt={employee.name} className="employee-photo" />
      <h3 className="employee-name">{employee.name}</h3>
      <p className="employee-role">{employee.role}</p>
      
      {/* Conditionally render the button based on the logic above */}
      {showDeleteButton && (
        <button className="delete-btn" onClick={() => onDelete(employee.id)}>
          🗑️ Delete
        </button>
      )}
    </div>
  );
}

export default EmployeeCard;