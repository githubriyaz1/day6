import React, { useState, useEffect } from 'react';
import './App.css';
import EmployeeCard from './components/EmployeeCard';
import { db } from './firebase-config';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';

function App() {
  const [employees, setEmployees] = useState([]);
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newPhoto, setNewPhoto] = useState('');
  const [error, setError] = useState('');
  
  const employeesCollectionRef = collection(db, "employees");

  const getEmployees = async () => {
    const data = await getDocs(employeesCollectionRef); 
    setEmployees(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  useEffect(() => {
    getEmployees();
  }, []);

  const handleAddEmployee = async (e) => {
    e.preventDefault();

    if (!newName.trim() || !newRole.trim()) {
      setError('Name and Role fields cannot be empty.');
      return;
    }

    try {
      // This will log to the console when you click the button
      console.log("Attempting to add a new employee to Firebase...");

      const newEmployeeData = {
        name: newName,
        role: newRole,
        photo: newPhoto || `https://i.pravatar.cc/150?u=${Date.now()}`
      };

      const docRef = await addDoc(employeesCollectionRef, newEmployeeData);
      
      // If successful, you'll get an alert
      console.log("Document successfully written with ID: ", docRef.id);
      alert("Success! Employee was added to Firebase.");

      // Clear the form and refresh the list
      setNewName('');
      setNewRole('');
      setNewPhoto('');
      setError('');
      getEmployees();

    } catch (error) {
      // If it fails, this code will run and show you the error
      console.error("Firebase error: ", error);
      alert(`Failed to add employee. \n\nError: ${error.message}`);
    }
  };

  const handleDeleteEmployee = async (id) => {
    const employeeDoc = doc(db, "employees", id);
    await deleteDoc(employeeDoc);
    getEmployees();
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