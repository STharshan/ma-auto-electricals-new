import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Trash2, Car, Calendar, Edit, Plus, X, Search,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  ArrowUpDown, ArrowUp, ArrowDown, AlertTriangle,
} from "lucide-react";
import AddCar from "../Add/AddCar";
import EditCar from "../Edit/EditCar";

const CarList = ({ url }) => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [editingCar, setEditingCar] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [carToDelete, setCarToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const fetchList = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${url}/api/cars`);
      setList(res.data);
    } catch {
      toast.error("Failed to fetch cars");
    } finally {
      setLoading(false);
    }
  }, [url]);

  const removeCar = async (id) => {
    try {
      setDeleteId(id);
      await axios.delete(`${url}/api/cars/${id}`);
      toast.success("Car deleted successfully");
      fetchList();
      setCarToDelete(null);
    } catch (err) {
      const message = err.response?.status === 401 ? "Unauthorized: Please login" : "Failed to delete car";
      toast.error(message);
    } finally {
      setDeleteId(null);
    }
  };

  const openEdit = (car) => setEditingCar(car);
  const closeModal = () => { setEditingCar(null); setShowAddModal(false); };
  const openDeleteConfirmation = (car) => setCarToDelete(car);
  const closeDeleteConfirmation = () => setCarToDelete(null);

  useEffect(() => { fetchList(); }, [fetchList]);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") direction = "desc";
    setSortConfig({ key, direction });
  };

  const filteredAndSortedData = useMemo(() => {
    let data = [...list];
    if (searchTerm) {
      data = data.filter((item) =>
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.year?.toString().includes(searchTerm) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (sortConfig.key) {
      data.sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];
        if (aVal == null) return 1;
        if (bVal == null) return -1;
        if (typeof aVal === "string") { aVal = aVal.toLowerCase(); bVal = bVal.toLowerCase(); }
        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return data;
  }, [list, searchTerm, sortConfig]);

  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredAndSortedData.slice(startIndex, endIndex);

  useEffect(() => { setCurrentPage(1); }, [searchTerm]);

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) return <ArrowUpDown size={14} className="opacity-40" />;
    return sortConfig.direction === "asc" ? <ArrowUp size={14} /> : <ArrowDown size={14} />;
  };

  if (loading) {
    return (
      <div className="p-4 md:p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 rounded w-1/4"></div>
          {[1,2,3].map((i) => <div key={i} className="h-24 bg-slate-200 rounded"></div>)}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">All Cars</h1>
          <p className="text-slate-500 text-sm mt-0.5">Manage your car inventory ({filteredAndSortedData.length} total)</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-md text-sm whitespace-nowrap"
        >
          <Plus size={18} /> Add Car
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Search + Controls */}
        <div className="p-4 border-b border-slate-200">
          <div className="flex flex-col sm:flex-row gap-3 justify-between">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search cars..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none text-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-slate-500 whitespace-nowrap">Show:</label>
              <select
                value={itemsPerPage}
                onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-400 outline-none"
              >
                {[5,10,25,50,100].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-slate-800 to-slate-700 text-white">
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Image</th>
                {[["name","Name"],["model","Model"],["year","Year"],["price","Price"]].map(([key,label]) => (
                  <th key={key} className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer hover:bg-slate-600 transition-colors" onClick={() => handleSort(key)}>
                    <div className="flex items-center gap-2">{label}<SortIcon columnKey={key} /></div>
                  </th>
                ))}
                <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentData.length > 0 ? currentData.map((car) => (
                <tr key={car._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-100">
                      <img src={`${url}/images/${car.images?.[0]}`} alt={car.name} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-800">{car.name}</td>
                  <td className="px-6 py-4 text-slate-600">{car.model}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-100 rounded-full text-blue-700 text-xs font-medium">
                      <Calendar size={12} />{car.year}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-green-600 font-bold">£{car.price?.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => openEdit(car)} className="p-2 bg-green-50 hover:bg-green-100 rounded-lg transition-colors" title="Edit">
                        <Edit size={16} className="text-green-600" />
                      </button>
                      <button onClick={() => openDeleteConfirmation(car)} className="p-2 bg-red-50 hover:bg-red-100 rounded-lg transition-colors" title="Delete">
                        <Trash2 size={16} className="text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="6" className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Car size={40} className="text-slate-300" />
                    <p className="text-slate-500 font-medium">No cars found</p>
                    <p className="text-slate-400 text-sm">{searchTerm ? "Try adjusting your search" : "Start adding cars to your inventory"}</p>
                  </div>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile/Tablet Cards */}
        <div className="lg:hidden divide-y divide-slate-100">
          {currentData.length > 0 ? currentData.map((car) => (
            <div key={car._id} className="p-4 hover:bg-slate-50 transition-colors">
              <div className="flex gap-3">
                <div className="shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-slate-100 shadow-sm">
                  <img src={`${url}/images/${car.images?.[0]}`} alt={car.name} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0">
                      <h3 className="font-bold text-slate-800 truncate text-base">{car.name}</h3>
                      <p className="text-sm text-slate-500 truncate">{car.model}</p>
                    </div>
                    <div className="flex gap-1.5 shrink-0">
                      <button onClick={() => openEdit(car)} className="p-1.5 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                        <Edit size={15} className="text-green-600" />
                      </button>
                      <button onClick={() => openDeleteConfirmation(car)} className="p-1.5 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
                        <Trash2 size={15} className="text-red-500" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 rounded-full text-blue-700 text-xs font-medium">
                      <Calendar size={11} />{car.year}
                    </span>
                    <span className="text-green-600 font-bold text-sm">£{car.price?.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          )) : (
            <div className="py-12 text-center">
              <Car size={40} className="text-slate-300 mx-auto mb-2" />
              <p className="text-slate-500 font-medium">No cars found</p>
              <p className="text-slate-400 text-sm">{searchTerm ? "Try adjusting your search" : "Start adding cars"}</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredAndSortedData.length > 0 && (
          <div className="p-4 border-t border-slate-200 bg-slate-50">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-sm text-slate-500">
                Showing <span className="font-semibold text-slate-700">{startIndex + 1}</span> to <span className="font-semibold text-slate-700">{Math.min(endIndex, filteredAndSortedData.length)}</span> of <span className="font-semibold text-slate-700">{filteredAndSortedData.length}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button onClick={() => setCurrentPage(1)} disabled={currentPage===1} className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"><ChevronsLeft size={16} /></button>
                <button onClick={() => setCurrentPage(p=>Math.max(1,p-1))} disabled={currentPage===1} className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"><ChevronLeft size={16} /></button>
                <div className="flex items-center gap-1">
                  {Array.from({length:totalPages},(_,i)=>i+1).filter(p=>p===1||p===totalPages||Math.abs(p-currentPage)<=1).map((page,idx,arr)=>(
                    <React.Fragment key={page}>
                      {idx>0&&arr[idx-1]!==page-1&&<span className="px-1 text-slate-400 text-sm">...</span>}
                      <button onClick={()=>setCurrentPage(page)} className={`min-w-8 px-2.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${currentPage===page?"bg-green-700 text-white":"border border-slate-200 hover:bg-slate-100"}`}>{page}</button>
                    </React.Fragment>
                  ))}
                </div>
                <button onClick={()=>setCurrentPage(p=>Math.min(totalPages,p+1))} disabled={currentPage===totalPages} className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"><ChevronRight size={16} /></button>
                <button onClick={()=>setCurrentPage(totalPages)} disabled={currentPage===totalPages} className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"><ChevronsRight size={16} /></button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {carToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="bg-gradient-to-r from-red-500 to-red-600 p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-lg"><AlertTriangle size={20} /></div>
                <h3 className="text-lg font-bold">Confirm Delete</h3>
              </div>
              <button onClick={closeDeleteConfirmation} className="p-1 hover:bg-white/20 rounded-lg" disabled={deleteId===carToDelete._id}><X size={18} /></button>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-4 mb-5 p-3 bg-slate-50 rounded-xl">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                  <img src={`${url}/images/${carToDelete.images?.[0]}`} alt={carToDelete.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">{carToDelete.name}</h4>
                  <p className="text-sm text-slate-500">{carToDelete.model} · {carToDelete.year}</p>
                  <p className="text-sm font-semibold text-green-600">£{carToDelete.price?.toLocaleString()}</p>
                </div>
              </div>
              <p className="text-slate-700 font-medium mb-1">Are you sure you want to delete this car?</p>
              <p className="text-sm text-slate-500 mb-5">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={closeDeleteConfirmation} disabled={deleteId===carToDelete._id} className="flex-1 px-4 py-2.5 border-2 border-slate-200 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50">Cancel</button>
                <button onClick={()=>removeCar(carToDelete._id)} disabled={deleteId===carToDelete._id} className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 rounded-xl font-semibold text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                  {deleteId===carToDelete._id ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>Deleting...</> : <><Trash2 size={16}/>Delete Car</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {(editingCar || showAddModal) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto relative">
            <button onClick={closeModal} className="absolute top-4 right-4 z-10 p-2 bg-white rounded-lg shadow-lg hover:bg-slate-100"><X size={18} /></button>
            {editingCar ? (
              <EditCar url={url} existingData={editingCar} onSuccess={()=>{closeModal();fetchList();}} onClose={closeModal} />
            ) : (
              <AddCar url={url} onSuccess={()=>{closeModal();fetchList();}} onClose={closeModal} />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CarList;
