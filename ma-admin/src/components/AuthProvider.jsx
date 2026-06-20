import React, { useCallback, useMemo, useRef, useState } from "react";
import axios from "axios";

import AuthContext from "../context/authContext";

export default function AuthProvider({ children }) {
  const [status, setStatus] = useState("idle");
  const [userRole, setUserRole] = useState(null);
  const verifyPromiseRef = useRef(null);

  const verifyAuth = useCallback(async () => {
    if (verifyPromiseRef.current) {
      return verifyPromiseRef.current;
    }

    setStatus((currentStatus) => (currentStatus === "authenticated" ? currentStatus : "loading"));

    verifyPromiseRef.current = axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/api/user/checkTokenCorrect`, {})
      .then((response) => {
        const isAdmin = response.data.success && response.data.role === "admin";
        setStatus(isAdmin ? "authenticated" : "unauthenticated");
        setUserRole(isAdmin ? response.data.role : null);
        return isAdmin;
      })
      .catch(() => {
        setStatus("unauthenticated");
        setUserRole(null);
        return false;
      })
      .finally(() => {
        verifyPromiseRef.current = null;
      });

    return verifyPromiseRef.current;
  }, []);

  const value = useMemo(
    () => ({
      status,
      userRole,
      verifyAuth,
      isAuthenticated: status === "authenticated",
    }),
    [status, userRole, verifyAuth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
