import React, { useEffect } from "react";
import {
  Routes,
  Route,
  BrowserRouter,
  Navigate,
} from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import CarList from "./pages/List/CarList";
import ProductList from "./pages/List/ProductList";
import AddCar from "./pages/Add/AddCar";
import AddProduct from "./pages/Add/AddProduct";
import OrdersTable from "./pages/Order";

import Login from "./components/Login";
import Signup from "./components/Signup";
import AuthLayout from "./components/AuthLayout";
import AuthProvider from "./components/AuthProvider";
import InvoiceGenerator from "./pages/InvoicePage";
import InvoiceDataPage from "./pages/InvoiceDataPage";
import useAuth from "./hooks/useAuth";

const url = import.meta.env.VITE_BACKEND_URL;

/* ---------------- AUTH ROUTE ---------------- */
const AuthRoute = ({ children }) => {
  const { status, isAuthenticated, verifyAuth } = useAuth();

  useEffect(() => {
    if (status === "idle") {
      verifyAuth();
    }
  }, [status, verifyAuth]);

  if (status === "idle" || status === "loading") return null;
  return isAuthenticated ? <Navigate to="/list/product" replace /> : children;
};

/* ---------------- APP ---------------- */
const App = () => {
  return (
    <AuthProvider>
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

          <Route element={<AuthLayout />}>
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
    </AuthProvider>
  );
};

export default App;
