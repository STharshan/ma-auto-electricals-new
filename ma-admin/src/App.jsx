import React, { useEffect, useState } from "react";
import {
  Routes,
  Route,
  BrowserRouter,
  Navigate,
  Outlet,
} from "react-router-dom";

import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

import CarList from "./pages/List/CarList";
import ProductList from "./pages/List/ProductList";
import AddCar from "./pages/Add/AddCar";
import AddProduct from "./pages/Add/AddProduct";
import OrdersTable from "./pages/Order";

import Login from "./components/Login";
import Signup from "./components/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import InvoiceGenerator from "./pages/InvoicePage";
import InvoiceDataPage from "./pages/InvoiceDataPage";

const url = import.meta.env.VITE_BACKEND_URL;

/* ---------------- AUTH ROUTE ---------------- */
const AuthRoute = ({ children }) => {
  const [isValid, setIsValid] = useState(null);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await axios.post(`${url}/api/user/checkTokenCorrect`, {});
        setIsValid(response.data.role === "admin");
      } catch {
        setIsValid(false);
      }
    };
    verifyToken();
  }, []);

  if (isValid === null) return null;
  return isValid ? <Navigate to="/list/product" replace /> : children;
};

/* ---------------- LAYOUT ---------------- */
const Layout = () => (
  <div className="flex min-h-screen">
    <Sidebar />
    <div className="flex-1 bg-slate-50 p-4 md:p-8 overflow-auto min-w-0">
      <Navbar />
      <Outlet />
    </div>
  </div>
);

/* ---------------- APP ---------------- */
const App = () => {
  return (
    <BrowserRouter>
      {/* Toast with high z-index so it's never blocked by navbar/sidebar */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        style={{ zIndex: 99999 }}
      />

      <Routes>
        <Route path="/" element={<AuthRoute><Login url={url} /></AuthRoute>} />
        <Route path="/signup" element={<AuthRoute><Signup url={url} /></AuthRoute>} />

        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="/list/product" element={<ProductList url={url} />} />
          <Route path="/list/car"     element={<CarList url={url} />} />
          <Route path="/add/car"      element={<AddCar url={url} />} />
          <Route path="/add/product"  element={<AddProduct url={url} />} />
          <Route path="/list/order"   element={<OrdersTable url={url} />} />
          <Route path="/invoice"      element={<InvoiceGenerator url={url} />} />
          <Route path="/invoice-data" element={<InvoiceDataPage url={url} />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
