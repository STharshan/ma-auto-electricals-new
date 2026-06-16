import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Trash2, Package, Tag, Layers, Edit, Search,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  ArrowUpDown, ArrowUp, ArrowDown, AlertTriangle, X,
} from "lucide-react";
import EditProduct from "../Edit/EditProduct";

const ProductList = ({ url }) => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const fetchList = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${url}/api/products`);
      setList(response.data);
    } catch (error) {
      toast.error("Error fetching products");
    } finally {
      setLoading(false);
    }
  }, [url]);

  const removeProduct = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      setDeleteId(productId);
      await axios.delete(`${url}/api/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Product deleted successfully");
      fetchList();
      setProductToDelete(null);
    } catch (error) {
      const errorMessage = error.response?.status === 401 ? "Unauthorized: Please log in again" : "Failed to delete product";
      toast.error(errorMessage);
    } finally {
      setDeleteId(null);
    }
  };

  const openEdit = (product) => setEditingProduct(product);
  const closeModal = () => setEditingProduct(null);
  const openDeleteConfirmation = (product) => setProductToDelete(product);
  const closeDeleteConfirmation = () => setProductToDelete(null);

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
        item.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
      <div className="mb-5">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">All Products</h1>
        <p className="text-slate-500 text-sm mt-0.5">Manage your product inventory ({filteredAndSortedData.length} total)</p>
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
                placeholder="Search products..."
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
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider">Image</th>
                {[["name","Name"],["count","Stock"],["category","Category"],["price","Price"]].map(([key,label])=>(
                  <th key={key} className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer hover:bg-slate-600 transition-colors" onClick={()=>handleSort(key)}>
                    <div className="flex items-center gap-2">{label}<SortIcon columnKey={key} /></div>
                  </th>
                ))}
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider">Description</th>
                <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wider">Best Selling</th>
                <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentData.length > 0 ? currentData.map((item) => (
                <tr key={item._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="w-14 h-14 rounded-lg overflow-hidden bg-slate-100">
                      <img src={`${url}/images/${item.images?.[0]}`} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                  </td>
                  <td className="px-5 py-4 font-semibold text-slate-800 max-w-[180px]"><div className="truncate">{item.name}</div></td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-100 rounded-full text-blue-700 text-xs font-medium">
                      <Layers size={12} />{item.count}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-purple-100 rounded-full text-purple-700 text-xs font-medium">
                      <Tag size={12} />{item.category}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-green-600 font-bold">£{item.price?.toLocaleString()}</td>
                  <td className="px-5 py-4 text-slate-600 text-sm max-w-[200px]"><div className="line-clamp-2">{item.description}</div></td>
                  <td className="px-5 py-4 text-center">
                    {item.isBestSelling ? (
                      <span className="inline-block px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Yes</span>
                    ) : (
                      <span className="inline-block px-2 py-0.5 bg-red-100 text-red-600 rounded-full text-xs font-semibold">No</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-center gap-2">
                      <button onClick={()=>openEdit(item)} className="p-2 bg-green-50 hover:bg-green-100 rounded-lg transition-colors" title="Edit">
                        <Edit size={15} className="text-green-600" />
                      </button>
                      <button onClick={()=>openDeleteConfirmation(item)} className="p-2 bg-red-50 hover:bg-red-100 rounded-lg transition-colors" title="Delete">
                        <Trash2 size={15} className="text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="8" className="px-6 py-12 text-center">
                  <Package size={40} className="text-slate-300 mx-auto mb-2" />
                  <p className="text-slate-500 font-medium">No products found</p>
                  <p className="text-slate-400 text-sm">{searchTerm ? "Try adjusting your search" : "Start adding products"}</p>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile/Tablet Cards */}
        <div className="lg:hidden divide-y divide-slate-100">
          {currentData.length > 0 ? currentData.map((item) => (
            <div key={item._id} className="p-4 hover:bg-slate-50 transition-colors">
              <div className="flex gap-3">
                <div className="shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-slate-100 shadow-sm">
                  <img src={`${url}/images/${item.images?.[0]}`} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0">
                      <h3 className="font-bold text-slate-800 truncate text-base">{item.name}</h3>
                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{item.description}</p>
                    </div>
                    <div className="flex gap-1.5 shrink-0">
                      <button onClick={()=>openEdit(item)} className="p-1.5 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                        <Edit size={14} className="text-green-600" />
                      </button>
                      <button onClick={()=>openDeleteConfirmation(item)} className="p-1.5 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
                        <Trash2 size={14} className="text-red-500" />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-100 rounded-full text-purple-700 text-xs font-medium">
                      <Tag size={10} />{item.category}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 rounded-full text-blue-700 text-xs font-medium">
                      <Layers size={10} />Stock: {item.count}
                    </span>
                    <span className="text-green-600 font-bold text-sm">£{item.price?.toLocaleString()}</span>
                    {item.isBestSelling && (
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Best Seller</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )) : (
            <div className="py-12 text-center">
              <Package size={40} className="text-slate-300 mx-auto mb-2" />
              <p className="text-slate-500 font-medium">No products found</p>
              <p className="text-slate-400 text-sm">{searchTerm ? "Try adjusting your search" : "Start adding products"}</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredAndSortedData.length > 0 && (
          <div className="p-4 border-t border-slate-200 bg-slate-50">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-sm text-slate-500">
                Showing <span className="font-semibold text-slate-700">{startIndex+1}</span> to <span className="font-semibold text-slate-700">{Math.min(endIndex,filteredAndSortedData.length)}</span> of <span className="font-semibold text-slate-700">{filteredAndSortedData.length}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button onClick={()=>setCurrentPage(1)} disabled={currentPage===1} className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"><ChevronsLeft size={16} /></button>
                <button onClick={()=>setCurrentPage(p=>Math.max(1,p-1))} disabled={currentPage===1} className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"><ChevronLeft size={16} /></button>
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
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="bg-gradient-to-r from-red-500 to-red-600 p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-lg"><AlertTriangle size={20} /></div>
                <h3 className="text-lg font-bold">Confirm Delete</h3>
              </div>
              <button onClick={closeDeleteConfirmation} className="p-1 hover:bg-white/20 rounded-lg" disabled={deleteId===productToDelete._id}><X size={18} /></button>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-4 mb-5 p-3 bg-slate-50 rounded-xl">
                <div className="w-14 h-14 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                  <img src={`${url}/images/${productToDelete.images?.[0]}`} alt={productToDelete.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">{productToDelete.name}</h4>
                  <p className="text-sm font-semibold text-green-600">£{productToDelete.price?.toLocaleString()}</p>
                </div>
              </div>
              <p className="text-slate-700 font-medium mb-1">Are you sure you want to delete this product?</p>
              <p className="text-sm text-slate-500 mb-5">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={closeDeleteConfirmation} disabled={deleteId===productToDelete._id} className="flex-1 px-4 py-2.5 border-2 border-slate-200 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50">Cancel</button>
                <button onClick={()=>removeProduct(productToDelete._id)} disabled={deleteId===productToDelete._id} className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 rounded-xl font-semibold text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                  {deleteId===productToDelete._id ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>Deleting...</> : <><Trash2 size={16}/>Delete Product</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <EditProduct url={url} existingData={editingProduct} onSuccess={()=>{fetchList();closeModal();}} onClose={closeModal} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
