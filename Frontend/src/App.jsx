import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import { Header, Footer } from "./components/index";
import Home from './pages/Home';
import User from './pages/User';
import Signup from './pages/Signup';
import Login from './pages/Login';
import AddTransaction from './pages/AddTransaction';
import EditTransaction from './pages/EditTransaction';
import ProtectedRoute from './utils/ProtectedRoute';

function App() {
  return (
    <main>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/user"
          element={
            <ProtectedRoute>
              <User />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-finance"
          element={
            <ProtectedRoute>
              <AddTransaction />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit/:transactionType/:transactionId"
          element={
            <ProtectedRoute>
              <EditTransaction />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Outlet />
      <Footer />
    </main>
  );
}

export default App;