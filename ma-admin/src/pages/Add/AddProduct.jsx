import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Upload, PoundSterling, Layers, Tag, Package, FileText, Star, ImagePlus, X, Plus, ChevronDown } from "lucide-react";

const AddProduct = ({ url }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    count: "",
    category: "",
    isBestSelling: false,
  });

  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  // Category dropdown state
  const [categories, setCategories] = useState([]);
  const [catDropdownOpen, setCatDropdownOpen] = useState(false);
  const [addingNew, setAddingNew] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const dropdownRef = useRef(null);

  // Fetch existing categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${url}/api/products/categories`);
        if (res.data.success) setCategories(res.data.categories);
      } catch {
        // silently fail, categories just won't pre-populate
      }
    };
    fetchCategories();
  }, [url]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setCatDropdownOpen(false);
        setAddingNew(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleChange = (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData((prev) => ({ ...prev, [e.target.name]: value }));
  };

  const selectCategory = (cat) => {
    setFormData((prev) => ({ ...prev, category: cat }));
    setCatDropdownOpen(false);
    setAddingNew(false);
  };

  const confirmNewCategory = () => {
    const trimmed = newCategory.trim();
    if (!trimmed) return;
    if (!categories.includes(trimmed)) setCategories((prev) => [...prev, trimmed]);
    selectCategory(trimmed);
    setNewCategory("");
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 5) {
      toast.error("You can upload a maximum of 5 images");
      return;
    }
    setImages((prev) => [...prev, ...files]);
    setPreviews((prev) => [...prev, ...files.map((file) => URL.createObjectURL(file))]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.description || !formData.price || !formData.count || !formData.category) {
      toast.error("Please fill in all fields");
      return;
    }
    if (images.length === 0) {
      toast.error("Please select at least one image");
      return;
    }

    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    images.forEach((img) => data.append("images", img));
    try {
      setLoading(true);
      const res = await axios.post(`${url}/api/products`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (res.data.success) {
        toast.success(res.data.message);
        setFormData({ name: "", description: "", price: "", count: "", category: "", isBestSelling: false });
        setImages([]);
        setPreviews([]);
      } else {
        toast.error(res.data.message || "Failed to add product");
      }
    } catch {
      toast.error("Error uploading product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Add New Product</h1>
        <p className="text-slate-500 text-sm mt-0.5">Fill in the details below to add a product to your inventory</p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">

          {/* Image Upload */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <ImagePlus className="w-4 h-4 text-green-700" />
              Product Images <span className="text-slate-400 font-normal">(Max 5)</span>
            </label>
            <label
              htmlFor="images"
              className="group cursor-pointer w-full min-h-40 border-2 border-dashed border-gray-200 rounded-xl hover:border-green-500 transition-all duration-200 overflow-hidden flex items-center justify-center bg-slate-50 hover:bg-green-50/30"
            >
              {previews.length > 0 ? (
                <div className="flex flex-wrap gap-3 p-4 w-full">
                  {previews.map((src, idx) => (
                    <div key={idx} className="relative w-24 h-24 rounded-xl overflow-hidden border border-gray-200 shadow-sm group/img">
                      <img src={src} alt={`preview-${idx}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center shadow"
                        onClick={(e) => { e.preventDefault(); removeImage(idx); }}
                      >
                        <X size={11} />
                      </button>
                    </div>
                  ))}
                  {previews.length < 5 && (
                    <div className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-green-500 hover:text-green-600 transition-colors">
                      <Upload size={20} />
                      <span className="text-xs mt-1">Add more</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-gray-400 group-hover:text-green-600 transition-colors">
                  <Upload className="w-10 h-10 mb-2" />
                  <p className="text-sm font-medium">Click to upload images</p>
                  <p className="text-xs mt-1 text-gray-400">PNG, JPG up to 10MB each</p>
                </div>
              )}
              <input type="file" id="images" multiple accept="image/*" onChange={handleImagesChange} className="hidden" />
            </label>
          </div>

          {/* Product Name */}
          <div className="space-y-2">
            <label htmlFor="name" className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Package className="w-4 h-4 text-green-700" />
              Product Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Alternator Belt 12V"
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-sm"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label htmlFor="description" className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <FileText className="w-4 h-4 text-green-700" />
              Description
            </label>
            <textarea
              name="description"
              id="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Write a detailed product description..."
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all resize-none text-sm"
            />
          </div>

          {/* Price + Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label htmlFor="price" className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <PoundSterling className="w-4 h-4 text-green-700" />
                Price (£)
              </label>
              <input
                type="number"
                name="price"
                id="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-sm"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="count" className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Layers className="w-4 h-4 text-green-700" />
                Stock Count
              </label>
              <input
                type="number"
                name="count"
                id="count"
                value={formData.count}
                onChange={handleChange}
                placeholder="0"
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-sm"
              />
            </div>
          </div>

          {/* Category Dropdown */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Tag className="w-4 h-4 text-green-700" />
              Category
            </label>
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => { setCatDropdownOpen((o) => !o); setAddingNew(false); }}
                className={`w-full px-4 py-3 border rounded-xl text-sm text-left flex items-center justify-between transition-all outline-none
                  ${catDropdownOpen ? "border-green-500 ring-2 ring-green-500" : "border-gray-200"}
                  ${formData.category ? "text-slate-800" : "text-gray-400"}`}
              >
                <span>{formData.category || "Select or add a category..."}</span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${catDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {catDropdownOpen && (
                
                <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                   <div className="border-t border-gray-100">
                    {!addingNew ? (
                      <button
                        type="button"
                        onClick={() => setAddingNew(true)}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-green-700 hover:bg-green-50 transition-colors font-medium"
                      >
                        <Plus className="w-4 h-4" /> Add new category
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 px-3 py-2.5">
                        <input
                          autoFocus
                          type="text"
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value)}
                          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); confirmNewCategory(); } if (e.key === "Escape") setAddingNew(false); }}
                          placeholder="New category name..."
                          className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500"
                        />
                        <button
                          type="button"
                          onClick={confirmNewCategory}
                          className="px-3 py-1.5 bg-green-700 hover:bg-green-800 text-white text-sm rounded-lg font-medium transition-colors"
                        >
                          Add
                        </button>
                      </div>
                    )}
                  </div>
                  {/* Existing categories */}
                  {categories.length > 0 ? (
                    <ul className="max-h-48 overflow-y-auto">
                      {categories.map((cat) => (
                        <li key={cat}>
                          <button
                            type="button"
                            onClick={() => selectCategory(cat)}
                            className={`w-full text-left px-4 py-2.5 text-sm hover:bg-green-50 hover:text-green-700 transition-colors
                              ${formData.category === cat ? "bg-green-50 text-green-700 font-semibold" : "text-slate-700"}`}
                          >
                            {cat}
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="px-4 py-3 text-sm text-gray-400">No categories yet</p>
                  )}

                  {/* Divider + Add new */}
                 
                </div>
              )}
            </div>
          </div>

          {/* Best Selling Toggle */}
          <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-100">
            <Star className="w-4 h-4 text-green-700 shrink-0" />
            <label htmlFor="isBestSelling" className="text-sm font-semibold text-slate-700 flex-1 cursor-pointer">
              Mark as Best Selling
            </label>
            <input
              type="checkbox"
              name="isBestSelling"
              id="isBestSelling"
              checked={formData.isBestSelling}
              onChange={handleChange}
              className="w-5 h-5 accent-green-700 cursor-pointer rounded"
            />
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3 bg-green-700 hover:bg-green-800 disabled:opacity-60 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 text-sm"
            >
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Adding...</>
              ) : (
                <><Package size={16} />Add Product</>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddProduct;
