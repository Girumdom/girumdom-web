import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard'; // Ensure you have this file created
import { useAuth } from './context/authContext';
import MainLayout from './layouts/MainLayout';

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
          <Route path="/reminders" element={<div>Reminders Page</div>} />
          <Route path="/memories" element={<div>Memories Page</div>} />
          <Route path="/collaboration" element={<div>Collaboration Page</div>} />
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