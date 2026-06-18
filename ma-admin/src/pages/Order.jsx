import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import {
  User, Mail, Phone, MapPin, ShoppingCart, CreditCard,
  Check, X, Clock, AlertTriangle, ChevronDown, ChevronUp,
  Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  RefreshCw, Trash2, RotateCcw, FileText,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function OrdersTable({ url }) {
  const [orders, setOrders]               = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState("");
  const [searchTerm, setSearchTerm]       = useState("");
  const [sortField, setSortField]         = useState("createdAt");
  const [sortDir, setSortDir]             = useState("desc");
  const [expandedRow, setExpandedRow]     = useState(null);
  const [currentPage, setCurrentPage]     = useState(1);
  const [itemsPerPage, setItemsPerPage]   = useState(10);
  const [filterStatus, setFilterStatus]   = useState("all");
  const [actionLoading, setActionLoading] = useState(false);
  const [modal, setModal]                 = useState(null);
  const [cancelNote, setCancelNote]       = useState("");

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${url}/api/orders`);
      setOrders(Array.isArray(res.data) ? res.data : res.data.orders || []);
    } catch { setError("Failed to fetch orders."); }
    finally { setLoading(false); }
  }, [url]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);
  useEffect(() => { setCurrentPage(1); }, [searchTerm, filterStatus]);

  const handleCancel = async () => {
    if (!cancelNote.trim()) return toast.error("Please enter a reason");
    setActionLoading(true);
    try {
      const res = await axios.post(
        `${url}/api/orders/${modal.order.orderId}/admin-cancel`,
        { cancelNote },
      );
      if (res.data.success) { toast.success("Order cancelled. Customer notified."); closeModal(); fetchOrders(); }
      else toast.error(res.data.message || "Failed");
    } catch (err) { toast.error(err.response?.data?.error || "Error"); }
    finally { setActionLoading(false); }
  };

  const handleRestore = async () => {
    setActionLoading(true);
    try {
      const res = await axios.post(
        `${url}/api/orders/${modal.order.orderId}/admin-restore`,
        {},
      );
      if (res.data.success) { toast.success("Order restored. Customer notified."); closeModal(); fetchOrders(); }
      else toast.error(res.data.message || "Failed");
    } catch (err) { toast.error(err.response?.data?.error || "Error"); }
    finally { setActionLoading(false); }
  };

  const openModal  = (type, order) => { setModal({ type, order }); setCancelNote(""); };
  const closeModal = () => { setModal(null); setCancelNote(""); };

  const handleSort = (field) => {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("asc"); }
  };

  const filtered = orders
    .filter(o => {
      const q = searchTerm.toLowerCase();
      const mq = o.user?.toLowerCase().includes(q) || o.email?.toLowerCase().includes(q) || o.orderId?.toLowerCase().includes(q);
      const ms = filterStatus === "all" ? true : filterStatus === "cancelled" ? o.isCancelled : !o.isCancelled;
      return mq && ms;
    })
    .sort((a, b) => {
      let av = a[sortField], bv = b[sortField];
      if (sortField === "createdAt") { av = new Date(av); bv = new Date(bv); }
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIdx   = (currentPage - 1) * itemsPerPage;
  const paginated  = filtered.slice(startIdx, startIdx + itemsPerPage);
  const goTo = p => setCurrentPage(Math.max(1, Math.min(p, totalPages)));

  const pageNums = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 3) return [1, 2, 3, 4, "...", totalPages];
    if (currentPage >= totalPages - 2) return [1, "...", totalPages-3, totalPages-2, totalPages-1, totalPages];
    return [1, "...", currentPage-1, currentPage, currentPage+1, "...", totalPages];
  };

  const cancelledCount = orders.filter(o => o.isCancelled).length;
  const activeCount    = orders.length - cancelledCount;
  const fmtDate = d => d ? new Date(d).toLocaleDateString("en-GB", { day:"2-digit", month:"short", year:"numeric" }) : "—";

  const Badge = ({ order }) => {
    if (order.isCancelled) return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold"><X className="w-3 h-3"/>Cancelled</span>;
    if (order.payment_status === "paid") return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-100 text-green-800 text-xs font-semibold"><Check className="w-3 h-3"/>Paid</span>;
    if (order.payment_status === "pending") return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-semibold"><Clock className="w-3 h-3"/>Pending</span>;
    return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold capitalize">{order.payment_status}</span>;
  };

  if (loading) return (
    <div className="flex flex-col justify-center items-center h-64 gap-4">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-[#317F21]/20 border-t-[#317F21] rounded-full animate-spin"/>
        <ShoppingCart className="w-6 h-6 text-[#317F21] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"/>
      </div>
      <p className="text-gray-600 font-medium">Loading orders...</p>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center h-64">
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center max-w-sm">
        <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2"/>
        <p className="text-red-600 font-medium mb-3">{error}</p>
        <button onClick={fetchOrders} className="bg-red-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition">Retry</button>
      </div>
    </div>
  );

  if (orders.length === 0) return (
    <div className="flex flex-col items-center justify-center h-64">
      <ShoppingCart className="w-16 h-16 text-gray-200 mb-4"/>
      <h2 className="text-xl font-bold text-gray-600 mb-1">No Orders Yet</h2>
      <p className="text-gray-400 text-sm">Orders will appear here once placed.</p>
    </div>
  );

  return (
    <div className="w-full p-4 md:p-6">
      <Toaster position="top-right"/>

      {/* Header */}
      <div className="mb-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Order Management</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {orders.length} total · <span className="text-green-600 font-medium">{activeCount} active</span> · <span className="text-red-500 font-medium">{cancelledCount} cancelled</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-500">Show:</label>
          <select value={itemsPerPage} onChange={e => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-[#317F21]">
            {[5,10,25,50].map(n => <option key={n}>{n}</option>)}
          </select>
          <button onClick={fetchOrders} className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50" title="Refresh">
            <RefreshCw className="w-4 h-4 text-gray-500"/>
          </button>
        </div>
      </div>

      {/* Search + filter */}
      <div className="mb-5 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4"/>
          <input type="text" placeholder="Search name, email, order ID..."
            value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#317F21] focus:border-transparent"/>
        </div>
        <div className="flex rounded-xl border border-gray-200 overflow-hidden bg-white text-sm font-medium shrink-0">
          {[
            { key: "all",       label: `All (${orders.length})` },
            { key: "active",    label: `Active (${activeCount})` },
            { key: "cancelled", label: `Cancelled (${cancelledCount})` },
          ].map(({ key, label }) => (
            <button key={key} onClick={() => setFilterStatus(key)}
              className={`px-4 py-2.5 transition ${filterStatus === key ? "bg-[#317F21] text-white" : "text-gray-600 hover:bg-gray-50"}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ✅ FIX 1: Desktop/Tablet table — changed lg:block → block, added overflow-x-auto for tablet scroll */}
      <div className="hidden sm:block bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-[#317F21]">
              <tr>
                {[
                  { label:"Customer", field:"user",      icon:<User className="w-3.5 h-3.5"/> },
                  { label:"Contact",  field:null,        icon:<Mail className="w-3.5 h-3.5"/> },
                  { label:"Products", field:null,        icon:<ShoppingCart className="w-3.5 h-3.5"/> },
                  { label:"Amount",   field:"amount",    icon:<CreditCard className="w-3.5 h-3.5"/> },
                  { label:"Status",   field:null,        icon:<FileText className="w-3.5 h-3.5"/> },
                  { label:"Date",     field:"createdAt", icon:<Clock className="w-3.5 h-3.5"/> },
                  { label:"Actions",  field:null,        icon:<RefreshCw className="w-3.5 h-3.5"/> },
                ].map(({ label, field, icon }) => (
                  <th key={label} onClick={field ? () => handleSort(field) : undefined}
                    className={`px-5 py-3.5 text-left text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap ${field ? "cursor-pointer hover:bg-[#265f18]" : ""} transition`}>
                    <div className="flex items-center gap-1.5">
                      {icon}{label}
                      {field && sortField===field && (sortDir==="asc" ? <ChevronUp className="w-3 h-3"/> : <ChevronDown className="w-3 h-3"/>)}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginated.map((order, idx) => (
                <tr key={order._id}
                  className={`transition-colors ${order.isCancelled ? "bg-red-50/50 hover:bg-red-50" : "hover:bg-[#317F21]/5"}`}
                  style={{ animation:`fadeIn 0.2s ease-out ${idx*0.03}s both` }}>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${order.isCancelled ? "bg-red-100" : "bg-[#317F21]/10"}`}>
                        <User className={`w-4 h-4 ${order.isCancelled ? "text-red-400" : "text-[#317F21]"}`}/>
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900 whitespace-nowrap">{order.user}</div>
                        <div className="text-[11px] text-gray-400 font-mono">{order.orderId?.slice(0,14)}…</div>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <div className="text-sm text-gray-700 flex items-center gap-1.5 whitespace-nowrap"><Mail className="w-3 h-3 text-gray-400"/>{order.email}</div>
                    <div className="text-xs text-gray-500 flex items-center gap-1.5 mt-1 whitespace-nowrap"><Phone className="w-3 h-3 text-gray-400"/>{order.phone||"—"}</div>
                  </td>

                  <td className="px-5 py-4">
                    {order.products?.length > 0 ? (
                      <div>
                        <div className="text-sm font-medium text-gray-800 whitespace-nowrap">{order.products.length} item{order.products.length>1?"s":""}</div>
                        <div className="text-xs text-gray-400 truncate max-w-[160px]">{order.products[0].name}{order.products.length>1?` +${order.products.length-1}`:""}</div>
                      </div>
                    ) : <span className="text-gray-400 text-sm">—</span>}
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap"><div className="text-sm font-bold text-gray-900">£{order.amount?.toFixed(2)}</div></td>

                  <td className="px-5 py-4">
                    <Badge order={order}/>
                    {order.isCancelled && order.cancelNote && (
                      <div className="text-[11px] text-red-400 mt-1 max-w-[140px] truncate" title={order.cancelNote}>{order.cancelNote}</div>
                    )}
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">{fmtDate(order.createdAt)}</td>

                  <td className="px-5 py-4 whitespace-nowrap">
                    {!order.isCancelled ? (
                      <button onClick={() => openModal("cancel", order)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-600 hover:text-white hover:border-red-600 transition-all">
                        <Trash2 className="w-3 h-3"/>Cancel
                      </button>
                    ) : (
                      <button onClick={() => openModal("restore", order)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-green-700 bg-green-50 border border-green-300 rounded-lg hover:bg-[#317F21] hover:text-white hover:border-[#317F21] transition-all">
                        <RotateCcw className="w-3 h-3"/>Restore
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ✅ FIX 2: Mobile cards — changed lg:hidden → sm:hidden (only show below 640px) */}
      <div className="sm:hidden space-y-3">
        {paginated.map((order, idx) => (
          <div key={order._id}
            className={`rounded-xl border overflow-hidden shadow-sm ${order.isCancelled ? "border-red-200 bg-red-50/30" : "border-gray-200 bg-white"}`}
            style={{ animation:`fadeIn 0.2s ease-out ${idx*0.03}s both` }}>

            <div className={`px-4 py-3 flex items-center justify-between ${order.isCancelled ? "bg-red-600" : "bg-[#317F21]"}`}>
              <div>
                <div className="text-white/60 text-[10px] uppercase tracking-wider">Order</div>
                <div className="text-white font-bold text-sm font-mono">{order.orderId?.slice(0,18)}…</div>
              </div>
              <Badge order={order}/>
            </div>

            <div className="p-4 space-y-3">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${order.isCancelled ? "bg-red-100" : "bg-[#317F21]/10"}`}>
                  <User className={`w-5 h-5 ${order.isCancelled ? "text-red-400" : "text-[#317F21]"}`}/>
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">{order.user}</div>
                  <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5"><Mail className="w-3 h-3"/>{order.email}</div>
                  <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5"><Phone className="w-3 h-3"/>{order.phone||"—"}</div>
                </div>
              </div>

              <div className="flex justify-between border-t border-gray-100 pt-3">
                <div><div className="text-xs text-gray-400">Amount</div><div className="text-lg font-black text-gray-900">£{order.amount?.toFixed(2)}</div></div>
                <div className="text-right"><div className="text-xs text-gray-400">Date</div><div className="text-sm text-gray-700">{fmtDate(order.createdAt)}</div></div>
              </div>

              {order.address && <div className="flex items-start gap-1.5 text-xs text-gray-500"><MapPin className="w-3 h-3 mt-0.5 shrink-0 text-gray-400"/>{order.address}</div>}

              <button onClick={() => setExpandedRow(expandedRow===order._id ? null : order._id)}
                className="w-full flex items-center justify-between py-2 px-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition text-sm font-medium text-gray-700">
                <span className="flex items-center gap-2"><ShoppingCart className="w-4 h-4"/>Products ({order.products?.length||0})</span>
                {expandedRow===order._id ? <ChevronUp className="w-4 h-4 text-gray-400"/> : <ChevronDown className="w-4 h-4 text-gray-400"/>}
              </button>

              {expandedRow===order._id && (
                <div className="bg-gray-50 rounded-xl p-3 space-y-2">
                  {order.products?.map((p,i) => (
                    <div key={i} className="flex justify-between items-center text-sm bg-white rounded-lg px-3 py-2 border border-gray-100">
                      <div><div className="font-medium text-gray-800">{p.name}</div><div className="text-xs text-gray-400">Qty:{p.quantity}</div></div>
                      <div className="font-bold text-gray-800">£{(p.price*p.quantity).toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              )}

              {order.isCancelled && order.cancelNote && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-3 py-2.5">
                  <p className="text-xs font-semibold text-red-600 mb-0.5">Cancellation Reason</p>
                  <p className="text-xs text-red-500">{order.cancelNote}</p>
                  {order.cancelledAt && <p className="text-[11px] text-red-400 mt-1">{fmtDate(order.cancelledAt)}</p>}
                </div>
              )}

              {!order.isCancelled ? (
                <button onClick={() => openModal("cancel", order)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-bold text-red-600 border-2 border-red-200 rounded-xl hover:bg-red-600 hover:text-white hover:border-red-600 transition-all">
                  <Trash2 className="w-4 h-4"/>Cancel Order
                </button>
              ) : (
                <button onClick={() => openModal("restore", order)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-bold text-green-700 border-2 border-green-300 rounded-xl hover:bg-[#317F21] hover:text-white hover:border-[#317F21] transition-all">
                  <RotateCcw className="w-4 h-4"/>Restore Order
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-14 bg-white rounded-xl border border-gray-200 shadow-sm">
          <Search className="w-10 h-10 text-gray-300 mx-auto mb-3"/>
          <p className="text-gray-500 font-semibold">No orders found</p>
          <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filter</p>
        </div>
      )}

      {filtered.length > 0 && totalPages > 1 && (
        <div className="mt-5 bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <div className="hidden md:flex items-center justify-between">
            <p className="text-sm text-gray-500">Showing <span className="font-semibold">{startIdx+1}</span>–<span className="font-semibold">{Math.min(startIdx+itemsPerPage,filtered.length)}</span> of <span className="font-semibold">{filtered.length}</span></p>
            <div className="flex items-center gap-1">
              <button onClick={()=>goTo(1)} disabled={currentPage===1} className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition"><ChevronsLeft className="w-4 h-4"/></button>
              <button onClick={()=>goTo(currentPage-1)} disabled={currentPage===1} className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition"><ChevronLeft className="w-4 h-4"/></button>
              {pageNums().map((p,i) => p==="..."
                ? <span key={`e${i}`} className="px-2 text-gray-400">…</span>
                : <button key={p} onClick={()=>goTo(p)} className={`min-w-[36px] h-9 rounded-lg text-sm font-medium transition ${currentPage===p?"bg-[#317F21] text-white":"border border-gray-200 text-gray-700 hover:bg-gray-50"}`}>{p}</button>
              )}
              <button onClick={()=>goTo(currentPage+1)} disabled={currentPage===totalPages} className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition"><ChevronRight className="w-4 h-4"/></button>
              <button onClick={()=>goTo(totalPages)} disabled={currentPage===totalPages} className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition"><ChevronsRight className="w-4 h-4"/></button>
            </div>
          </div>
          <div className="md:hidden flex items-center gap-2">
            <button onClick={()=>goTo(currentPage-1)} disabled={currentPage===1} className="flex-1 py-2.5 text-sm font-medium border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 transition">Prev</button>
            <span className="bg-[#317F21] text-white font-bold px-4 py-2.5 rounded-xl text-sm">{currentPage}/{totalPages}</span>
            <button onClick={()=>goTo(currentPage+1)} disabled={currentPage===totalPages} className="flex-1 py-2.5 text-sm font-medium border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 transition">Next</button>
          </div>
        </div>
      )}

      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}`}</style>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">

            <div className={`px-6 py-4 flex items-center justify-between ${modal.type==="cancel" ? "bg-red-600" : "bg-[#317F21]"}`}>
              <div>
                <h3 className="text-white font-bold text-lg">{modal.type==="cancel" ? "Cancel Order" : "Restore Order"}</h3>
                <p className="text-white/70 text-xs mt-0.5">#{modal.order.orderId?.slice(0,20)}…</p>
              </div>
              <button onClick={closeModal} className="text-white/80 hover:text-white"><X size={20}/></button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Customer</span><span className="font-semibold text-gray-800">{modal.order.user}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Email</span><span className="text-gray-600 text-xs">{modal.order.email}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Amount</span><span className="font-bold text-[#317F21]">£{Number(modal.order.amount).toFixed(2)}</span></div>
                <div className="flex justify-between items-center"><span className="text-gray-500">Status</span><Badge order={modal.order}/></div>
                {modal.order.products?.length > 0 && (
                  <div className="pt-2 border-t border-gray-200 space-y-1">
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Items</p>
                    {modal.order.products.map((p,i) => (
                      <div key={i} className="flex justify-between text-xs text-gray-600">
                        <span>{p.name} × {p.quantity}</span>
                        <span className="font-medium">£{(p.price*p.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className={`rounded-xl p-3 border flex gap-2 text-xs ${modal.type==="cancel" ? "bg-amber-50 border-amber-200 text-amber-700" : "bg-green-50 border-green-200 text-green-700"}`}>
                {modal.type==="cancel" ? <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5"/> : <RotateCcw className="w-4 h-4 shrink-0 mt-0.5"/>}
                <p>
                  {modal.type==="cancel"
                    ? `This will mark the order as cancelled and send a notification email to ${modal.order.email}.`
                    : `This will restore the order to active status and send a notification email to ${modal.order.email}.`
                  }
                </p>
              </div>

              {modal.type==="cancel" && (
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1.5">Reason <span className="text-red-500">*</span></label>
                  <textarea value={cancelNote} onChange={e => setCancelNote(e.target.value)} rows={3}
                    placeholder="Enter reason for cancelling..."
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-400 resize-none transition"/>
                </div>
              )}

              <div className="flex gap-3">
                <button onClick={closeModal} disabled={actionLoading}
                  className="flex-1 border-2 border-gray-200 text-gray-600 font-bold py-3 rounded-xl hover:bg-gray-50 transition text-sm disabled:opacity-60">
                  Back
                </button>
                {modal.type==="cancel" ? (
                  <button onClick={handleCancel} disabled={actionLoading || !cancelNote.trim()}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition text-sm disabled:opacity-60 flex items-center justify-center gap-2">
                    {actionLoading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>Cancelling…</> : <><Trash2 className="w-4 h-4"/>Confirm Cancel</>}
                  </button>
                ) : (
                  <button onClick={handleRestore} disabled={actionLoading}
                    className="flex-1 bg-[#317F21] hover:bg-[#265f18] text-white font-bold py-3 rounded-xl transition text-sm disabled:opacity-60 flex items-center justify-center gap-2">
                    {actionLoading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>Restoring…</> : <><RotateCcw className="w-4 h-4"/>Confirm Restore</>}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
