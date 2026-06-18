import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Plus, List, Car, Package, LogOut, Package2, FileText, Database } from "lucide-react";
import axios from "axios";

const Sidebar = () => {
  const navigate = useNavigate();

  const menuItems = [
    { to: "/add/product",   icon: <Plus size={20} />,     label: "Add Product"   },
    { to: "/add/car",       icon: <Car size={20} />,      label: "Add Car"       },
    { to: "/list/product",  icon: <Package size={20} />,  label: "List Products" },
    { to: "/list/car",      icon: <List size={20} />,     label: "List Cars"     },
    { to: "/list/order",    icon: <Package2 size={20} />, label: "Orders"        },
    { to: "/invoice",       icon: <FileText size={20} />, label: "Invoices"      },
    { to: "/invoice-data",  icon: <Database size={20} />, label: "Invoice Data"  },
  ];

  const handleLogout = () => {
    axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/user/logout`)
      .catch(() => {})
      .finally(() => navigate("/"));
  };

  return (
    <div className="flex flex-col justify-between w-56 min-h-screen bg-white border-r border-slate-200 max-md:w-16 transition-all duration-300 shrink-0">

      <div>
        {/* Logo */}
        <div className="p-4 border-b border-slate-200 max-md:p-3">
          <div className="flex items-center gap-3 max-md:justify-center">
            <img
              src="/logo.png"
              alt="MA Auto Electrics"
              className="h-10 w-10 object-contain rounded-xl"
            />
            <div className="max-md:hidden leading-tight">
              <p className="font-bold text-green-700 text-sm leading-none">MA Auto</p>
              <p className="font-bold text-green-700 text-sm">Electrics</p>
              <p className="text-xs text-slate-400 mt-0.5">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="p-3 space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-3 py-2.5 rounded-xl border-2 transition-all duration-200
                 max-md:justify-center max-md:px-2
                 ${isActive
                   ? "bg-green-50 border-green-600 text-green-700 shadow-sm"
                   : "border-transparent text-slate-600 hover:bg-green-50/50 hover:border-green-200 hover:text-green-700"
                 }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`transition-transform duration-200 shrink-0
                    ${isActive ? "scale-110 text-green-700" : "group-hover:scale-110 text-slate-500 group-hover:text-green-700"}`}>
                    {item.icon}
                  </div>
                  <span className={`font-medium text-sm max-md:hidden truncate
                    ${isActive ? "font-semibold text-green-700" : ""}`}>
                    {item.label}
                  </span>
                  {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-green-600 max-md:hidden shrink-0" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Logout */}
      <div className="p-3 border-t border-slate-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-medium transition-all duration-200 max-md:justify-center"
        >
          <LogOut size={18} className="shrink-0" />
          <span className="max-md:hidden text-sm">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
