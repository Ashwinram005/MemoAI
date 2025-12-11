import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Chat from './pages/Chat';
import Dashboard from './pages/Dashboard';
import IdeaIncubator from './pages/IdeaIncubator';
import Documents from './pages/Documents';
import Tasks from './pages/Tasks';
import Memory from './pages/Memory';
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <Toaster position="top-right" />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                <Route path="/" element={<Chat />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/incubator" element={<IdeaIncubator />} />
                <Route path="/documents" element={<Documents />} />
                <Route path="/tasks" element={<Tasks />} />
                <Route path="/memory" element={<Memory />} />
                <Route path="/profile" element={<Profile />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
