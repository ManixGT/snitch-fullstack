import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const SUGGESTIONS = [
  "Jeans", "Shirts", "Polo", "Kurta", "Linen", "White Shirt",
  "Printed Shirt", "T-Shirt", "Overshirt", "Formal Wear", "Bootcut", "Baggy Fit",
];

const Header = ({ onSidebarOpen, onAuthButtonClick }) => {
  const [search, setSearch] = useState("");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [cartCount, setCartCount] = useState(0);

  // Simple, clean cycle
  useEffect(() => {
    if (search) return;

    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % SUGGESTIONS.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [search]);


  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const fetchCartCount = async () => {
    console.log("fetchCartCount");
    try {
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
      const count = data?.products?.length || 0;
      setCartCount(count);

      console.log("Cart items:", data);
      console.log("Set cart count to:", count);

    } catch (error) {
      console.error('Error fetching cart:', error);
      setCartCount(0);
    }
  };

  // Fetch cart count on component mount
  useEffect(() => {
    fetchCartCount();
  }, []);


  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Menu and Location */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onSidebarOpen}
              className="cursor-pointer hover:opacity-70 transition-opacity"
              aria-label="Open menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 25" fill="none">
                <line y1="5" x2="24" y2="5" stroke="black" />
                <line y1="13" x2="24" y2="13" stroke="#E16E50" />
                <line y1="21" x2="24" y2="21" stroke="black" />
              </svg>
            </button>
            <div className="hidden lg:block text-sm text-gray-800">
              <span className="font-medium">Enter Pincode</span>
              <br />
              <span className="text-xs text-gray-600">Use your pincode to find delivery est...</span>
            </div>
          </div>

          {/* Center - Logo */}
          <Link
            to="/"
            className="flex-1 flex justify-center lg:flex-none cursor-pointer hover:opacity-80 transition-opacity"
            onClick={handleLogoClick}
          >
            <img
              src="assets/loader&Icon/imgi_1_SNITCH_LOGO_NEW_BLACK.png"
              alt="Snitch Logo"
              loading="lazy"
              width={150}
              height={40}
              decoding="async"
              className="object-contain"
            />
          </Link>

          {/* Right side - Search, Account, Cart */}
          <div className="flex items-center space-x-4">
            {/* Desktop Search */}
            <div className="hidden lg:flex items-center">
              <div className="relative flex items-center h-10 mx-4 border border-black min-w-[280px]">
                <div className="ml-2 flex-shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <g stroke="black" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M8.866 16.59a7.723 7.723 0 1 0 0-15.447 7.723 7.723 0 0 0 0 15.446ZM22.878 22.768l-8.605-8.495" />
                    </g>
                  </svg>
                </div>

                <input
                  type="text"
                  className="flex-1 h-full bg-transparent focus:outline-none px-3 text-sm"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder=""
                  autoComplete="off"
                  aria-label="Search products"
                />

                {/* Smooth Animated Placeholder */}
                {!search && (
                  <div className="absolute left-10 top-0 bottom-0 right-4 overflow-hidden pointer-events-none flex items-center">
                    <div className="relative h-full w-full">
                      <div
                        key={currentIdx}
                        className="absolute inset-0 flex items-center animate-textCycle"
                        style={{
                          fontSize: "12px",
                          color: "rgba(0, 0, 0, 0.7)",
                        }}
                      >
                        <span className="uppercase tracking-wide whitespace-nowrap">
                          {`Search "${SUGGESTIONS[currentIdx]}"`}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Search Button */}
            <button className="lg:hidden hover:opacity-70 transition-opacity" aria-label="Search">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <g stroke="black" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8.866 16.59a7.723 7.723 0 1 0 0-15.447 7.723 7.723 0 0 0 0 15.446ZM22.878 22.768l-8.605-8.495" />
                </g>
              </svg>
            </button>

            {/* Account Button */}
            <button
              className="cursor-pointer hover:opacity-70 transition-opacity"
              onClick={onAuthButtonClick}
              aria-label="Account"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M11.7802 11.9614C9.1921 11.9614 7.09399 9.86326 7.09399 7.27512C7.09399 4.68697 9.1921 2.58887 11.7802 2.58887C14.3684 2.58887 16.4665 4.68697 16.4665 7.27512C16.4665 9.86326 14.3684 11.9614 11.7802 11.9614Z"
                  fill="#FFF"
                  stroke="black"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M19.8314 21.3342C19.8314 17.707 16.223 14.7734 11.7805 14.7734C7.3379 14.7734 3.72949 17.707 3.72949 21.3342"
                  fill="#FFF"
                  stroke="black"
                  strokeLinecap="square"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {/* Cart Button */}
            <Link to="/cart">
              <button
                className="relative hover:opacity-70 transition-opacity"
                aria-label="Shopping cart"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M17 9V7.86177C17 5.17669 14.7614 3 12 3C9.23858 3 7 5.17669 7 7.86177V9"
                    stroke="#000"
                    strokeLinecap="square"
                    strokeLinejoin="round"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M19.9657 22L21 7L3 7L4.03434 22L19.9657 22Z"
                    stroke="#000"
                    strokeLinecap="round"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M15.9133 11.8345C15.5285 11.3311 14.9458 11 14.1887 11C13.4316 11 12.8807 11.3131 12.5144 11.6184C12.4043 11.7102 12.3108 11.8018 12.2337 11.8854C12.1563 11.8017 12.0624 11.71 11.9521 11.6182C11.5855 11.3133 11.0257 11 10.2801 11C9.53449 11 8.943 11.3314 8.55774 11.8343C8.17944 12.3283 8 12.9739 8 13.613C8 14.3218 8.27734 14.9871 8.66481 15.5728C9.05292 16.1594 9.56445 16.6858 10.0658 17.1239C10.5683 17.5631 11.0694 17.9208 11.4441 18.1685C11.6318 18.2926 11.7884 18.3895 11.8989 18.4558C11.9541 18.4889 11.9977 18.5144 12.028 18.5318C12.0431 18.5405 12.0549 18.5472 12.063 18.5519C12.0672 18.5542 12.0703 18.556 12.0725 18.5573L12.0752 18.5587L12.0762 18.5594L12.2345 18.6471L12.3927 18.5594L12.3938 18.5587L12.3964 18.5573C12.3986 18.556 12.4018 18.5542 12.4059 18.5519C12.414 18.5472 12.4258 18.5406 12.4409 18.5318C12.4712 18.5144 12.5149 18.4889 12.57 18.4558C12.6805 18.3895 12.8371 18.2926 13.0248 18.1685C13.3995 17.9208 13.9005 17.5631 14.4032 17.1239C14.9046 16.6859 15.416 16.1594 15.8041 15.5728C16.1916 14.9871 16.4689 14.3217 16.4689 13.613C16.4689 12.9744 16.2911 12.3288 15.9133 11.8345Z"
                    fill="#E16E50"
                  />
                </svg>
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                  {cartCount}
                </span>
              </button>
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes textCycle {
          0% {
            transform: translateY(100%);
            opacity: 0;
          }
          10% {
            transform: translateY(0);
            opacity: 1;
          }
          90% {
            transform: translateY(0);
            opacity: 1;
          }
          100% {
            transform: translateY(-100%);
            opacity: 0;
          }
        }

        .animate-textCycle {
          animation: textCycle 2.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Header;