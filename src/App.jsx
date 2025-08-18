import React, { useState } from 'react';
import './App.css';
import EmployeeCard from './components/EmployeeCard';

function App() {
  // Initial employee data
  const initialEmployees = [
    { id: 1, name: 'Ava Sharma', role: 'Frontend Developer', photo: 'https://i.pravatar.cc/150?img=1' },
    { id: 2, name: 'Leo Martinez', role: 'Backend Developer', photo: 'https://i.pravatar.cc/150?img=2' },
    { id: 3, name: 'Mia Chen', role: 'UI/UX Designer', photo: 'https://i.pravatar.cc/150?img=3' },
  ];

  const [employees, setEmployees] = useState(initialEmployees);
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newPhoto, setNewPhoto] = useState('');
  const [error, setError] = useState('');

  const handleAddEmployee = (e) => {
    e.preventDefault(); // Prevent form from reloading the page

    // Simple validation
    if (!newName.trim() || !newRole.trim()) {
      setError('Name and Role fields cannot be empty.');
      return;
    }

    const newEmployee = {
      id: Date.now(), // Unique ID based on timestamp
      name: newName,
      role: newRole,
      // Use a default image if no URL is provided
      photo: newPhoto || `https://i.pravatar.cc/150?u=${Date.now()}`,
    };

    setEmployees([...employees, newEmployee]);

    // Clear input fields and error message
    setNewName('');
    setNewRole('');
    setNewPhoto('');
    setError('');
  };

  const handleDeleteEmployee = (id) => {
    setEmployees(employees.filter(employee => employee.id !== id));
  };

  return (
    <div className="App">
      <nav className="navbar">
        <h1>Employee Directory</h1>
        <div className="total-employees">
          Total Employees: <span>{employees.length}</span>
        </div>
      </nav>

      <main className="container">
        <div className="form-container">
          <h2>Add New Employee</h2>
          <form onSubmit={handleAddEmployee}>
            <input
              type="text"
              placeholder="Name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Role"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
            />
            <input
              type="text"
              placeholder="Image URL (Optional)"
              value={newPhoto}
              onChange={(e) => setNewPhoto(e.target.value)}
            />
            <button type="submit">Add Employee</button>
          </form>
          {error && <p className="error-message">{error}</p>}
        </div>

        <div className="employee-grid">
          {employees.map(employee => (
            <EmployeeCard
              key={employee.id}
              employee={employee}
              onDelete={handleDeleteEmployee}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;