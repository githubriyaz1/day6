import React, { useState, useEffect } from 'react';
import './App.css';
import { db } from './firebase-config';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";

// PASTE YOUR ADMIN UID HERE
const ADMIN_UID = "x5QGeNpBTnfTPvDDPRGQ66xHoJC2";

function App() {
  const [employees, setEmployees] = useState([]);
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newPhoto, setNewPhoto] = useState('');
  const [error, setError] = useState('');
  
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const auth = getAuth();
  const employeesCollectionRef = collection(db, "employees");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    getEmployees();
    return () => unsubscribe(); // Cleanup subscription on unmount
  }, [auth]);

  const getEmployees = async () => {
    const data = await getDocs(employeesCollectionRef); 
    setEmployees(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    if (!newName.trim() || !newRole.trim()) {
      setError('Name and Role fields cannot be empty.');
      return;
    }
    await addDoc(employeesCollectionRef, { 
      name: newName,
      role: newRole,
      photo: newPhoto || `https://i.pravatar.cc/150?u=${Date.now()}`
    });
    setNewName(''); setNewRole(''); setNewPhoto(''); setError('');
    getEmployees(); 
  };

  const handleDeleteEmployee = async (id) => {
    const employeeDoc = doc(db, "employees", id);
    await deleteDoc(employeeDoc);
    getEmployees();
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setLoginError("Failed to log in. Please check your email and password.");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  // This is a separate component now to keep the main return clean
  const EmployeeCard = ({ employee, onDelete, user }) => (
    <div className="employee-card">
      <img src={employee.photo} alt={employee.name} className="employee-photo" />
      <h3 className="employee-name">{employee.name}</h3>
      <p className="employee-role">{employee.role}</p>
      {user && user.uid === ADMIN_UID && (
        <button className="delete-btn" onClick={() => onDelete(employee.id)}>
          🗑️ Delete
        </button>
      )}
    </div>
  );

  return (
    <div className="App">
      <nav className="navbar">
        <h1>Employee Directory</h1>
        {user && (
          <div className="user-info">
            <span>Welcome, Admin</span>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        )}
      </nav>

      <main className="container">
        {!user ? (
          <div className="login-container">
            <h2>Admin Login</h2>
            <form onSubmit={handleLogin}>
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <button type="submit">Login</button>
              {loginError && <p className="error-message">{loginError}</p>}
            </form>
          </div>
        ) : (
          <>
            <div className="form-container">
              <h2>Add New Employee</h2>
              <form onSubmit={handleAddEmployee}>
                <input type="text" placeholder="Name" value={newName} onChange={(e) => setNewName(e.target.value)} />
                <input type="text" placeholder="Role" value={newRole} onChange={(e) => setNewRole(e.target.value)} />
                <input type="text" placeholder="Image URL (Optional)" value={newPhoto} onChange={(e) => setNewPhoto(e.target.value)} />
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
                  user={user}
                />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default App;