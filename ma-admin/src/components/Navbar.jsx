import React from "react";

const Navbar = () => {
  return (
    <div className="bg-white border-b border-slate-200 shadow-sm mb-6 -mx-4 -mt-4 md:-mx-8 md:-mt-8 px-4 md:px-8 py-3">
      <div className="flex items-center gap-3">
        <img
          src="/logo.png"
          alt="MA Auto Electrics"
          className="h-9 w-9 object-contain rounded-lg"
          onError={(e) => { e.target.style.display = "none"; }}
        />
        <div className="leading-tight">
          <p className="font-bold text-green-700 text-base leading-none">MA Auto Electrics</p>
          <p className="text-xs text-slate-400">Admin Dashboard</p>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
