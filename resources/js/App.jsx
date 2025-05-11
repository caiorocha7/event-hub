import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './Components/layout/Header';
import ProtectedRoute from './Components/layout/ProtectedRoute';
import Login from './Components/auth/Login';
import Register from './Components/auth/Register';
import EventList from './Components/events/EventList';
import CreateEvent from './Components/events/CreateEvent';
import EditEvent from './Components/events/EditEvent';
import EventDetails from './Components/events/EventDetails';
import MyEvents from './Components/events/MyEvents';
import '../css/app.css';

const App = () => {
  return (
    <BrowserRouter>
      <div className="app">
        <Header />
        <main className="container">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<EventList />} />
              <Route path="/events/create" element={<CreateEvent />} />
              <Route path="/events/edit/:uuid" element={<EditEvent />} />
              <Route path="/events/:uuid" element={<EventDetails />} />
              <Route path="/my-events" element={<MyEvents />} />
            </Route>
            
            {/* Fallback Route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;
