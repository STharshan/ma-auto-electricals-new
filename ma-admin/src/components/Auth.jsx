import React from "react";

export default function AuthContainer({ title, children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-100 to-gray-300 p-4">
      <div className="w-full max-w-md bg-white/30 backdrop-blur-lg shadow-xl rounded-2xl p-8 border border-white/40">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
}
