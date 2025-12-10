import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard'; // Ensure you have this file created
import Seniors from './pages/Seniors/Seniors';
import SeniorProfile from './pages/Seniors/SeniorProfile';
import { useAuth } from './context/authContext';
import MainLayout from './layouts/MainLayout';
import CreateMemory from './pages/Memories/CreateMemory';
import CreateReminder from './pages/Reminders/CreateReminder';
import Reminders from './pages/Reminders/Reminders';
import Memories from './pages/Memories/Memories';

// 1. A Helper Component to protect pages
// If user is not logged in, it bounces them back to Login
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  const { user, isLoading } = useAuth();

  // 2. Wait for the AuthContext to check local storage before rendering
  // This prevents the app from flickering to the Login screen while loading
  if (isLoading) {
    return <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>Loading...</div>;
  }

  return (
    // 3. Define your Routes
    <Routes>
      
      {/* LOGIN ROUTE */}
      {/* If user is ALREADY logged in, force them to Dashboard. Otherwise, show Login. */}
      <Route 
        path="/login" 
        element={!user ? <Login /> : <Navigate to="/dashboard" replace />} 
      />

      {/* DASHBOARD ROUTE (PROTECTED) */}
      {/* Only accessible if ProtectedRoute approves it */}
      <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          {/* Dashboard will now render INSIDE MainLayout */}
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Future pages go here */}
          <Route path="/collaboration" element={<div>Collaboration Page</div>} />
          <Route path="/seniors" element={<Seniors />} />
          <Route path="/seniors/:id" element={<SeniorProfile />} />
          
          <Route path="/create-reminder" element={<CreateReminder />} />
          <Route path="/reminders" element={<Reminders />} />

          <Route path="/memories" element={<Memories />} />
          <Route path="/create-memory" element={<CreateMemory />} />
      </Route>

      {/* DEFAULT CATCH-ALL */}
      {/* If they type a random URL, send them to Dashboard (if logged in) or Login */}
      <Route 
        path="*" 
        element={<Navigate to={user ? "/dashboard" : "/login"} replace />} 
      />
      
    </Routes>
  );
}

export default App;