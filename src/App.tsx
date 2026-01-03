import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/authContext';

// routes
import LandingPage from './pages/Landing/LandingPage';
import Layout from './components/Layout';
import About from './pages/Landing/About'; 
import Login from './pages/Auth/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Seniors from './pages/Seniors/Seniors';
import SeniorProfile from './pages/Seniors/SeniorProfile';
import MainLayout from './layouts/MainLayout';
import CreateMemory from './pages/Memories/CreateMemory';
import CreateReminder from './pages/Reminders/CreateReminder';
import Reminders from './pages/Reminders/Reminders';
import Memories from './pages/Memories/Memories';
import Signup from './pages/Auth/Signup';
import ForgotPassword from './pages/Auth/ForgotPassword';
import VerifyReset from './pages/Auth/VerifyReset';


// Helper Component to protect pages
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

function App() {
  const { user, isLoading } = useAuth();

  // Wait for Auth check
  if (isLoading) {
    return <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>Loading...</div>;
  }

  return (
    <Routes>
      
      {/* This is the default page ("/") everyone sees first */}
      <Route element={<Layout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<About />} />
      </Route>
      


      {/* --- AUTH ROUTES --- */}
      <Route 
        path="/login" 
        // If logged in, send to Dashboard. If not, show Login form.
        element={!user ? <Login /> : <Navigate to="/dashboard" replace />} 
      />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-reset" element={<VerifyReset />} />


      {/* --- PROTECTED DASHBOARD ROUTES --- */}
      <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          
          <Route path="/collaboration" element={<div>Collaboration Page</div>} />
          <Route path="/seniors" element={<Seniors />} />
          <Route path="/seniors/:id" element={<SeniorProfile />} />
          
          <Route path="/create-reminder" element={<CreateReminder />} />
          <Route path="/reminders" element={<Reminders />} />

          <Route path="/memories" element={<Memories />} />
          <Route path="/create-memory" element={<CreateMemory />} />
      </Route>


      {/* --- CATCH-ALL --- */}
      {/* If unknown URL: 
          - Logged In? -> Go to Dashboard
          - Not Logged In? -> Go to Landing Page ("/") 
      */}
      <Route 
        path="*" 
        element={<Navigate to={user ? "/dashboard" : "/"} replace />} 
      />
      
    </Routes>
  );
}

export default App;