import React, { useState } from 'react';
import { Trash2, Heart, Plus, Minus, Gift } from 'lucide-react';

// Mock cart data - you'll get this from your API/context
const mockCartItems = [
  {
    id: 1,
    name: "Blue Grey Regular Fit Shirt",
    image: "/api/placeholder/150/180",
    size: "L",
    color: "Blue Grey",
    quantity: 1,
    price: 1199,
    originalPrice: 1299,
    discount: 100
  }
];

const Cart = () => {
  const [cartItems, setCartItems] = useState([]); // Start empty, change to mockCartItems to see filled state
  const [showCoupons, setShowCoupons] = useState(false);

  // Cart calculations
  const bagTotal = cartItems.reduce((total, item) => total + (item.originalPrice * item.quantity), 0);
  const totalDiscount = cartItems.reduce((total, item) => total + (item.discount * item.quantity), 0);
  const couponDiscount = 0; // You can add coupon logic
  const grandTotal = bagTotal - totalDiscount - couponDiscount;

  // Update quantity
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity === 0) {
      removeItem(id);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Remove item
  const removeItem = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  // Move to wishlist
  const moveToWishlist = (id) => {
    // Add your wishlist logic here
    console.log('Moving to wishlist:', id);
    removeItem(id);
  };

  // Empty Cart State
  if (cartItems.length === 0) {
    return (
      <div className="bg-white flex items-center justify-center max-w-full">
        <div className="w-[60%] text-center px-4">
          <div className="mb-6">
            <img
              src="/assets/empty_bag.png"
              alt="empty bag"
              width={200}
              height={200}
              className="mx-auto"
            />
          </div>

          <h2 className="text-2xl font-semibold text-gray-900 mb-2 uppercase">
            Your bag is empty
          </h2>

          <p className="text-black mt-8 text-xs">
            Your cart is ready to roll, but it's feeling a bit empty without some stylish finds.
          </p>

          <div className="flex flex-col md:flex md:flex-row items-center pb-2 px-4 md:gap-x-2">
            <button
              onClick={() => setCartItems(mockCartItems)} // Demo: Add items to cart
              className="transition uppercase w-full py-3  text-white bg-black hover:bg-gray-800"
            >
              Start Shopping
            </button>
            <button className="transition uppercase w-full py-3 text-black bg-white border border-black hover:bg-gray-200 mt-2 md:mt-0">
              Add From Wishlist
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Filled Cart State (only one return statement remains)
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-8">Shopping Cart ({cartItems.length} item{cartItems.length > 1 ? 's' : ''})</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex gap-4">
                  {/* Product Image */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-28 object-cover rounded"
                    />
                    {/* Timer badge */}
                    <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-white text-xs py-1 px-2 text-center">
                      Ends in 00 : 21 : 42
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="text-sm text-gray-600 mb-3">
                      {item.size} | {item.color} | QTY | {item.quantity}
                    </div>

                    <div className="flex items-center justify-between">
                      {/* Move to Wishlist */}
                      <button
                        onClick={() => moveToWishlist(item.id)}
                        className="flex items-center text-sm text-gray-600 hover:text-black"
                      >
                        <Heart className="w-4 h-4 mr-1" />
                        MOVE TO WISHLIST
                      </button>

                      {/* Price and Quantity */}
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold">₹{item.price}</span>
                            <span className="text-sm text-gray-500 line-through">₹{item.originalPrice}</span>
                          </div>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center border border-gray-300 rounded">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-2 hover:bg-gray-100"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-3 py-2 min-w-[40px] text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-2 hover:bg-gray-100"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-sm sticky top-4">
              {/* Coupons Section */}
              <div className="mb-6">
                <button
                  onClick={() => setShowCoupons(!showCoupons)}
                  className="flex items-center justify-between w-full text-left"
                >
                  <div className="flex items-center">
                    <Gift className="w-5 h-5 mr-2 text-gray-600" />
                    <span className="text-sm">Login to view Coupons and Gift Cards</span>
                  </div>
                  <span className="text-xl">{showCoupons ? '−' : '+'}</span>
                </button>

                {showCoupons && (
                  <div className="mt-4 p-4 bg-gray-50 rounded">
                    <p className="text-sm text-gray-600">Please login to view available coupons and gift cards.</p>
                  </div>
                )}
              </div>

              {/* Price Details */}
              <div className="border-t pt-6">
                <h3 className="font-bold text-lg mb-4 text-center">PRICE DETAILS</h3>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bag Total</span>
                    <span>₹{bagTotal}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Product Discount</span>
                    <span className="text-green-600">- ₹{totalDiscount}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Coupon Discount</span>
                    <span className="text-green-600">- ₹{couponDiscount}</span>
                  </div>

                  <div className="border-t pt-3 flex justify-between font-bold text-lg">
                    <span>Grand Total</span>
                    <span>₹{grandTotal}</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <button className="w-full bg-black text-white py-4 font-bold text-lg hover:bg-gray-800 transition-colors">
                  PAY ₹{grandTotal}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;