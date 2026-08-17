import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import useAuth from "../hooks/useAuth";

export default function AuthLayout() {
  const { status, verifyAuth } = useAuth();

  useEffect(() => {
    if (status === "idle") {
      verifyAuth();
    }
  }, [status, verifyAuth]);

  if (status === "idle" || status === "loading") {
    return null;
  }

  if (status !== "authenticated") {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 bg-slate-50 p-4 md:p-8 overflow-auto min-w-0">
        <Navbar />
        <Outlet />
      </div>
    </div>
  );
}
