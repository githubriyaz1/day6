import React, { useState, useEffect } from 'react';
import './App.css';
// Note: I'm moving EmployeeCard back out of App.jsx to keep things clean.
// Ensure you still have your 'src/components/EmployeeCard.jsx' file.
import EmployeeCard from './components/EmployeeCard'; 
import { db } from './firebase-config';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";

// PASTE YOUR ADMIN UID HERE
const ADMIN_UID = "x5QGeNpBTnfTPvDDPRGQ66xHoJC2"; // Don't forget to paste your UID here!

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
    // Cleanup subscription on unmount
    return () => unsubscribe(); 
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
      setLoginError("Login failed. Check email or password.");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <div className="App">
      <nav className="navbar">
        <h1>Employee Directory</h1>
        {/* If a user is logged in, show their status and a logout button */}
        {user && (
          <div className="user-info">
            <span>Welcome, Admin</span>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        )}
      </nav>

      <main className="container">
        {/* The Login form is now only shown if you are NOT logged in */}
        {/* It no longer hides the rest of the page */}
        {!user && (
          <div className="login-container">
            <h2>Admin Login to Delete</h2>
            <form onSubmit={handleLogin}>
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <button type="submit">Login</button>
              {loginError && <p className="error-message">{loginError}</p>}
            </form>
          </div>
        )}

        {/* This "Add Employee" form is now ALWAYS visible */}
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

        {/* The employee grid is now ALWAYS visible */}
        <div className="employee-grid">
          {employees.map(employee => (
            <EmployeeCard
              key={employee.id}
              employee={employee}
              // Pass the user and admin UID to the card component
              user={user}
              adminUid={ADMIN_UID}
              onDelete={handleDeleteEmployee}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;