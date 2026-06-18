import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

export default function ProtectedRoute({ children }) {
  const [isVerified, setIsVerified] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/user/checkTokenCorrect`,
          {}
        );

        setIsVerified(response.data.success && response.data.role === "admin");
      } catch {
        setIsVerified(false);
      }
    };

    checkAuth();
  }, []);

  if (isVerified === null) return null;

  return isVerified ? children : <Navigate to="/" replace />;
}
