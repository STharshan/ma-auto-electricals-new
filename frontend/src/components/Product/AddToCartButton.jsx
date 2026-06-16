import React from "react";
import { ShoppingCart } from "lucide-react";

export default function AddToCartButton({ product }) {
  const handleAddToCart = () => {
    // LocalStorage-il irunthu cart-ai edukka
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Product munnadiye cart-la irukkanu check panna
    const existingItem = cart.find((item) => item._id === product._id);
    
    if (existingItem) {
      existingItem.quantity += 1; // Quantity-ai increment seiya
    } else {
      cart.push({ ...product, quantity: 1 }); // Puthu item add seiya
    }

    // LocalStorage-il save seiya
    localStorage.setItem("cart", JSON.stringify(cart));

    // --- FIX: Navbar-ku notification anuppa ---
    window.dispatchEvent(new Event("cartUpdated"));

    alert(`${product.name} added to cart `);
  };

  return (
    <button
      onClick={handleAddToCart}
      className="mt-8 flex items-center justify-center gap-3 bg-[#317F21] hover:bg-[#3ad81a] text-white text-lg font-semibold py-4 rounded-xl transition w-full"
    >
      <ShoppingCart />
      Add to Cart
    </button>
  );
}