import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Heart, Plus, Minus, Gift } from 'lucide-react';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [showCoupons, setShowCoupons] = useState(false);
  const [loading, setLoading] = useState(true);

  // Cart calculations
  const bagTotal = cartItems.reduce((total, item) => total + (item.originalPrice * item.quantity), 0);
  const totalDiscount = cartItems.reduce((total, item) => total + (item.discount * item.quantity), 0);
  const couponDiscount = 0;
  const grandTotal = bagTotal - totalDiscount - couponDiscount;

  // Fetch cart items
  const fetchCartItem = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(import.meta.env.VITE_getCart, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      if (!response.ok) throw new Error('Failed to fetch cart');
      const data = await response.json();
      setCartItems(data?.products);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   fetchCartItem();
  // }, []);

  // Update quantity
  const updateQuantity = async (id, newQuantity) => {
    if (newQuantity === 0) {
      removeItem(id);
      return;
    }

    // Optimistic update
    setCartItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );

    // API call to update quantity
    try {
      await fetch(`${import.meta.env.VITE_updateCartItem}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQuantity })
      });
    } catch (error) {
      console.error('Error updating quantity:', error);
      fetchCartItem();
    }
  };

  // Remove item
  const removeItem = async (id) => {
    // Optimistic update
    setCartItems(prev => prev.filter(item => item.id !== id));

    // API call to remove item
    try {
      await fetch(`${import.meta.env.VITE_removeCartItem}/${id}`, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error('Error removing item:', error);
      // Revert on error
      fetchCartItem();
    }
  };

  // Move to wishlist
  const moveToWishlist = async (id) => {
    try {
      // Add to wishlist API call
      await fetch(import.meta.env.VITE_addToWishlist, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: id })
      });

      // Remove from cart
      removeItem(id);
    } catch (error) {
      console.error('Error moving to wishlist:', error);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
      </div>
    );
  }

  // Empty Cart State
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-full max-w-md text-center px-4 py-12">
          <div className="mb-6">
            <img
              src="/assets/empty_bag.png"
              alt="empty bag"
              width={200}
              height={200}
              className="mx-auto"
              onError={(e) => {
                e.target.src = '/api/placeholder/200/200';
              }}
            />
          </div>

          <h2 className="text-2xl font-semibold text-gray-900 mb-2 uppercase">
            Your bag is empty
          </h2>

          <p className="text-gray-600 mt-4 mb-8 text-sm">
            Your cart is ready to roll, but it's feeling a bit empty without some stylish finds.
          </p>

          <div className="flex flex-col md:flex-row gap-3">
            <Link to="/" className="flex-1">
              <button className="w-full py-3 text-white bg-black hover:bg-gray-800 transition-colors uppercase font-medium">
                Start Shopping
              </button>
            </Link>
            <Link to="/wishlist" className="flex-1">
              <button className="w-full py-3 text-black bg-white border border-black hover:bg-gray-100 transition-colors uppercase font-medium">
                Add From Wishlist
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Filled Cart State
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-8">
          Shopping Cart ({cartItems.length} item{cartItems.length > 1 ? 's' : ''})
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (

              <div key={item.id || item._id} className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex gap-4">
                  {/* Product Image */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={item.image || item.images?.[0] || '/no-image.png'}
                      alt={item.name}
                      className="w-24 h-28 object-cover rounded"
                      onError={(e) => {
                        e.target.src = '/no-image.png';
                      }}
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
                        onClick={() => removeItem(item.id || item._id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
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
                        onClick={() => moveToWishlist(item.id || item._id)}
                        className="flex items-center text-sm text-gray-600 hover:text-black transition-colors"
                      >
                        <Heart className="w-4 h-4 mr-1" />
                        MOVE TO WISHLIST
                      </button>

                      {/* Price and Quantity */}
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold">₹{item.price}</span>
                            {item.originalPrice && (
                              <span className="text-sm text-gray-500 line-through">
                                ₹{item.originalPrice}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center border border-gray-300 rounded">
                          <button
                            onClick={() => updateQuantity(item.id || item._id, item.quantity - 1)}
                            className="p-2 hover:bg-gray-100 transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-3 py-2 min-w-[40px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id || item._id, item.quantity + 1)}
                            className="p-2 hover:bg-gray-100 transition-colors"
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
                    <p className="text-sm text-gray-600">
                      Please login to view available coupons and gift cards.
                    </p>
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