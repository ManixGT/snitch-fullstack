import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { Heart, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";


const ProductGrid = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const loadMoreRef = useRef(null);
  const ITEMS_PER_PAGE = 20;

  // Enhanced API calls with better error handling
  const fetchWithRetry = async (url, retries = 3) => {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return await response.json();
      } catch (error) {
        if (i === retries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
  };

  const getProducts = useCallback(async () => {
    try {
      setError(null);
      const data = await fetchWithRetry(import.meta.env.VITE_getProducts);
      setProducts(data?.data || []);
    } catch (error) {
      setError('Failed to load products. Please try again.');
      setProducts([]);
      console.error("Products fetch error:", error);
    }
  }, []);

  const getCategories = useCallback(async () => {
    try {
      setError(null);
      const data = await fetchWithRetry(import.meta.env.VITE_getCategories);
      setCategories(data?.data || []);
    } catch (error) {
      setError('Failed to load categories. Please try again.');
      setCategories([]);
      console.error("Categories fetch error:", error);
    }
  }, []);

  //Add to cart
  const handleAddToCart = async (productId) => {
    try {
      const token = localStorage.getItem('token'); // or your token storage method

      const response = await fetch(`${import.meta.env.VITE_addToCart}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // Add the token
        },
        body: JSON.stringify({
          productId: productId,
          quantity: 1
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message || "Product added to cart!");
      } else {
        toast.error(result.message || "Failed to add to cart.");
      }
    } catch (err) {
      toast.error("Something went wrong while adding to cart.");
      console.error(err);
    }
  };


  // Initial data loading
  useEffect(() => {
    const loadInitialData = async () => {
      setInitialLoading(true);
      await Promise.all([getCategories(), getProducts()]);
      setInitialLoading(false);
    };
    handleAddToCart();
    loadInitialData();
  }, [getCategories, getProducts]);

  // Memoized filter categories
  const filterCategories = useMemo(() => [
    { id: 'ALL', name: 'ALL' },
    ...categories.map(cat => ({ id: cat._id, name: cat.name.toUpperCase() }))
  ], [categories]);

  // Memoized filtered products
  const filteredProducts = useMemo(() =>
    activeFilter === 'ALL'
      ? products
      : products.filter(p => p.category === activeFilter),
    [products, activeFilter]
  );

  // Reset pagination when filter changes
  useEffect(() => {
    setPage(1);
    setDisplayedProducts(filteredProducts.slice(0, ITEMS_PER_PAGE));
  }, [activeFilter, filteredProducts]);

  // Enhanced load more function
  const loadMore = useCallback(() => {
    if (loading || displayedProducts.length >= filteredProducts.length) return;

    const startIndex = page * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const newProducts = filteredProducts.slice(startIndex, endIndex);

    if (newProducts.length === 0) return;

    setLoading(true);

    // Simulate loading delay (remove in production or replace with actual API call)
    setTimeout(() => {
      setDisplayedProducts(prev => [...prev, ...newProducts]);
      setPage(prev => prev + 1);
      setLoading(false);
    }, 300);
  }, [filteredProducts, page, loading, displayedProducts.length]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && !loading && !initialLoading) {
          loadMore();
        }
      },
      {
        rootMargin: '100px',
        threshold: 0.1
      }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [loadMore, loading, initialLoading]);

  // const toggleFavorite = useCallback((productId) => {
  //   setFavorites(prev =>
  //     prev.includes(productId)
  //       ? prev.filter(id => id !== productId)
  //       : [...prev, productId]
  //   );
  // }, []);

  // Memoized computed values
  const hasMoreProducts = displayedProducts.length < filteredProducts.length;
  const activeCategoryName = useMemo(() => {
    if (activeFilter === 'ALL') return 'ALL';
    const category = categories.find(cat =>
      cat._id === activeFilter || cat.name.toUpperCase() === activeFilter
    );
    return category?.name;
  }, [activeFilter, categories]);

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-gray-200 aspect-[3/4] rounded mb-3"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      ))}
    </div>
  );

  // Error component
  const ErrorState = () => (
    <div className="text-center py-12">
      <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Something went wrong</h3>
      <p className="text-gray-600 mb-4">{error}</p>
      <button
        onClick={() => {
          setError(null);
          getProducts();
          getCategories();
        }}
        className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
      >
        Try Again
      </button>
    </div>
  );

  if (initialLoading) {
    return (
      <section className="py-12">
        <h2 className="text-2xl font-bold text-center mb-8">NEW AND POPULAR</h2>
        <LoadingSkeleton />
      </section>
    );
  }

  if (error && products.length === 0) {
    return (
      <section className="py-12">
        <h2 className="text-2xl font-bold text-center mb-8">NEW AND POPULAR</h2>
        <ErrorState />
      </section>
    );
  }

  return (
    <section className="py-12">
      <h2 className="text-2xl font-bold text-center mb-8">NEW AND POPULAR</h2>

      {/* Filter Buttons */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {filterCategories.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`px-4 py-2 border text-sm font-medium transition-all duration-200 ${activeFilter === filter.id
              ? 'bg-black text-white border-black'
              : 'bg-white text-black border-gray-300 hover:border-black hover:shadow-sm'
              }`}
            aria-pressed={activeFilter === filter.id}
          >
            {filter.name}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
        {displayedProducts.map((product) => (
          <div key={product._id || product.id} className="group">
            <div className="relative border border-gray-100 cursor-pointer overflow-hidden hover:shadow-lg transition-all duration-300" >
              <Link to={`/productDetail/${product._id}`}>
                <img
                  loading="lazy"
                  src={product.images?.[0] || "/no-image.png"}
                  alt={product.name || 'Product'}
                  className="w-full aspect-[3/4] object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src = "/no-image.png";
                  }}
                />
              </Link>
              <button
                onClick={() => handleAddToCart(product._id)}
                className="absolute top-0 right-0 p-2"
                aria-label="Add to cart"
                title="Add to Cart"
              >
                <Heart className="w-4 h-4 text-gray-600 hover:text-red-500 transition-all duration-200" />
              </button>

            </div>

            <div className="mt-3 space-y-1">
              <h3 className="font-medium text-sm line-clamp-2 text-gray-900">
                {product.name} {" "}
                <span className="text-gray-500 text-xs">
                  {categories.find(cat => cat._id === product.category)?.name || 'Uncategorized'}
                </span>
              </h3>

              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-lg font-semibold text-gray-900">₹{product.price}</span>
                {product.originalPrice && product.originalPrice !== product.price && (
                  <span className="text-gray-500 line-through text-sm">₹{product.originalPrice}</span>
                )}
                {product.discount && (
                  <span className="text-red-600 text-xs font-medium bg-red-50 px-1.5 py-0.5 rounded">
                    {product.discount}% OFF
                  </span>
                )}
              </div>

              {product.colors && product.colors.length > 0 && (
                <div className="flex gap-1 pt-1">
                  {product.colors.slice(0, 5).map((color, index) => (
                    <span
                      key={`${product._id || product.id}-color-${index}`}
                      className="inline-block w-3 h-3 border border-gray-300 hover:scale-110 transition-transform cursor-pointer"
                      style={{ backgroundColor: color.toLowerCase() }}
                      title={color}
                    />
                  ))}
                  {product.colors.length > 5 && (
                    <span className="text-xs text-gray-500 self-center ml-1">
                      +{product.colors.length - 5}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Load More Trigger */}
      {hasMoreProducts && (
        <div ref={loadMoreRef} className="w-full h-20 flex items-center justify-center mt-8">
          {loading ? (
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-600 text-sm">
                Loading <span className="text-orange-500 font-semibold">{filteredProducts.length - displayedProducts.length}</span> more products...
              </p>
            </div>
          ) : (
            <p className="text-gray-400 text-sm">Scroll to load more products</p>
          )}
        </div>
      )}

      {/* End Message */}
      {!hasMoreProducts && displayedProducts.length > 0 && (
        <div className="text-center mt-12 py-8 border-t border-gray-100">
          <h4 className="text-lg font-semibold text-gray-900 mb-2">That's all!</h4>
          <p className="text-gray-600">
            You've explored all {filteredProducts.length} products
            {activeFilter !== 'ALL' && ` in ${activeCategoryName}`}
          </p>
        </div>
      )}

      {/* No Products */}
      {filteredProducts.length === 0 && products.length > 0 && (
        <div className="text-center mt-12 py-8">
          <h4 className="text-lg font-semibold text-gray-900 mb-2">No products found</h4>
          <p className="text-gray-600 mb-4">
            We couldn't find any products in "{activeCategoryName}". Try selecting a different category.
          </p>
          <button
            onClick={() => setActiveFilter('ALL')}
            className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
          >
            Show All Products
          </button>
        </div>
      )}
    </section>
  );
};

export default ProductGrid;