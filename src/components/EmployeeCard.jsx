import React from 'react';
import './EmployeeCard.css';

function EmployeeCard(props) {
  const { employee, onDelete } = props;

  return (
    <div className="employee-card">
      <img src={employee.photo} alt={employee.name} className="employee-photo" />
      <h3 className="employee-name">{employee.name}</h3>
      <p className="employee-role">{employee.role}</p>
      <button className="delete-btn" onClick={() => onDelete(employee.id)}>
        🗑️ Delete
      </button>
    </div>
  );
}

export default EmployeeCard;