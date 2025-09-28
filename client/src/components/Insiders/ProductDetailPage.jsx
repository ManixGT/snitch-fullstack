import { useState, useCallback, useEffect } from 'react';
import { Heart, Share, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useParams, Link } from 'react-router-dom';


const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [openSections, setOpenSections] = useState({
    details: false,
    offers: false,
    reviews: false,
    delivery: false,
    returns: false
  });

  // Fetch product details
  const fetchProduct = useCallback(async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_getProducts}/${id}`);
      const data = await res.json();
      setProduct(data?.data);
      setSelectedSize(data?.sizes?.[0] || '');
      setSelectedColor(0);
    } catch (err) {
      setProduct(null);
    }
  }, [id]);

  // Fetch related products (all products except current)
  const fetchRelatedProducts = useCallback(async () => {
    try {
      const res = await fetch(import.meta.env.VITE_getProducts);
      const data = await res.json();
      setRelatedProducts((data?.data || []).filter(p => p._id !== id).slice(0, 10));
    } catch (err) {
      setRelatedProducts([]);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
    fetchRelatedProducts();
    setSelectedImage(0);
  }, [fetchProduct, fetchRelatedProducts]);

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const nextImage = () => {
    if (!product?.images) return;
    setSelectedImage((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    if (!product?.images) return;
    setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading product details...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-9xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-0">
          {/* Left Side - Product Images */}
          <div className="flex gap-4">
            {/* Thumbnail Images */}
            <div className="flex flex-col gap-2 w-30">
              {product.images?.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-25 h-30 border-2 rounded overflow-hidden ${selectedImage === index ? 'border-black' : 'border-gray-200'
                    }`}
                >
                  <img
                    loading='lazy'
                    src={image}
                    alt={`Product ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Main Product Image */}
            <div className="flex-1 relative">
              <div className="relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden">
                <img
                  loading='lazy'
                  src={product.images?.[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />

                {/* Navigation Arrows */}
                {product.images?.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/40 rounded-full p-2"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/40 rounded-full p-2 hover:bg-white"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Heart and Share icons */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className="bg-white/80 rounded-full p-2 hover:bg-white"
                  >
                    <Heart
                      className={`w-5 h-5 ${isFavorite ? "text-red-500 fill-red-500" : "text-gray-600"
                        }`}
                    />
                  </button>
                  <button className="bg-white/80 rounded-full p-2 hover:bg-white">
                    <Share className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                {/* Bottom offer banner */}
                <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-white py-2 px-4 text-center text-sm">
                  <span className="text-yellow-300">FINAL PRICES REFLECT</span>
                  <span className="text-orange-300 ml-2">GST BENEFIT</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Product Details */}
          <div className="space-y-2 max-w-7xl m-20 mt-0">
            {/* Product Title and Price */}
            <div>
              <h1 className="text-2xl font-semibold mb-2">{product.name}</h1>
              <div className="flex items-center mb-2">
                <span className="text-2xl font-bold">₹{product.price}</span>
                {product.originalPrice && (
                  <span className="text-lg text-gray-500 line-through ml-2">₹{product.originalPrice}</span>
                )}
              </div>

              {/* Rating */}
              {product.ratings && (
                <div className="flex items-center space-x-2 mb-4">
                  <div className="bg-green-600 text-white px-2 py-1 rounded text-sm font-medium flex items-center">
                    <span>{product?.ratings}</span>
                    <span className="ml-1">★</span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {product.totalRatings || 0} Ratings and {product.totalReviews || 0} Reviews
                  </span>
                </div>
              )}

              {/* Offer */}
              {product.discount && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
                  <div className="text-sm">
                    <span className="text-black font-medium">Get This Style For {" "}</span>
                    <span className="text-black font-medium">{product.discount}%</span>
                    <span className="text-orange-500 ml-2 cursor-pointer hover:underline">How?</span>
                  </div>
                </div>
              )}
            </div>

            {/* Colors */}
            {product.images && product.images.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">COLORS</h3>
                <div className="grid grid-cols-6 gap-2">
                  {product.images.map((p, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedColor(index)}
                      className={`w-12 h-12 border-2 rounded overflow-hidden ${selectedColor === index ? 'border-black' : 'border-gray-200'
                        }`}
                      title={typeof color === "string" ? p : p}
                    >
                      <img
                        loading='lazy'
                        src={p.images}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">SIZES</h3>
                  <button className="text-sm text-blue-600 hover:underline">SIZE CHART</button>
                </div>
                <div className="flex gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border text-sm font-medium ${selectedSize === size
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-black border-gray-300 hover:border-black'
                        }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                {/* Delivery Info */}
                {product.deliveryText && (
                  <div className="text-sm text-gray-600 mt-2 flex items-center">
                    <span className="text-red-500 mr-2">🚚</span>
                    {product.deliveryText}
                  </div>
                )}
              </div>
            )}

            <Link to="/cart">
              <button className="w-full bg-black text-white py-4 font-semibold text-lg hover:bg-gray-800 transition-colors cursor-pointer">
                ADD TO BAG
              </button>
            </Link>

            {/* Collapsible Sections */}
            <div className="space-y-1">
              {/* Details */}
              <div className="border-b border-gray-200">
                <button
                  onClick={() => toggleSection('details')}
                  className="w-full flex items-center justify-between py-4 text-left"
                >
                  <span className="font-medium">DETAILS</span>
                  <Plus className={`w-5 h-5 transition-transform ${openSections.details ? 'rotate-45' : ''}`} />
                </button>
                {openSections.ratings && product.ratings && (
                  <div className="pb-4 text-sm text-gray-600 space-y-2">
                    {Object.entries(product.ratings).map(([key, value]) => (
                      <p key={key}><strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {value}</p>
                    ))}
                  </div>
                )}
              </div>

              {/* Offers */}
              <div className="border-b border-gray-200">
                <button
                  onClick={() => toggleSection('offers')}
                  className="w-full flex items-center justify-between py-4 text-left"
                >
                  <span className="font-medium">OFFERS</span>
                  <Plus className={`w-5 h-5 transition-transform ${openSections.offers ? 'rotate-45' : ''}`} />
                </button>
                {openSections.offers && product.offers && (
                  <div className="pb-4 text-sm text-gray-600 space-y-2">
                    {product.offers.map((offer, index) => (
                      <p key={index}>• {offer}</p>
                    ))}
                  </div>
                )}
              </div>

              {/* Reviews */}
              <div className="border-b border-gray-200">
                <button
                  onClick={() => toggleSection('reviews')}
                  className="w-full flex items-center justify-between py-4 text-left"
                >
                  <span className="font-medium">REVIEWS</span>
                  <Plus className={`w-5 h-5 transition-transform ${openSections.reviews ? 'rotate-45' : ''}`} />
                </button>
                {openSections.reviews && (
                  <div className="pb-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="bg-green-600 text-white px-2 py-1 rounded text-sm font-medium">
                        {product.rating || 0} ★
                      </div>
                      <span>Based on {product.totalReviews || 0} reviews</span>
                    </div>
                    <p>Great quality product, perfect fit and comfortable fabric. Highly recommended!</p>
                  </div>
                )}
              </div>

              {/* Delivery */}
              <div className="border-b border-gray-200">
                <button
                  onClick={() => toggleSection('delivery')}
                  className="w-full flex items-center justify-between py-4 text-left"
                >
                  <span className="font-medium">DELIVERY</span>
                  <Plus className={`w-5 h-5 transition-transform ${openSections.delivery ? 'rotate-45' : ''}`} />
                </button>
                {openSections.delivery && (
                  <div className="pb-4 text-sm text-gray-600 space-y-2">
                    <p>• Free delivery on orders above ₹999</p>
                    <p>• Express delivery available in major cities</p>
                    <p>• Standard delivery: 3-7 business days</p>
                    <p>• Express delivery: 1-2 business days</p>
                  </div>
                )}
              </div>

              {/* Returns */}
              <div>
                <button
                  onClick={() => toggleSection('returns')}
                  className="w-full flex items-center justify-between py-4 text-left"
                >
                  <span className="font-medium">RETURNS</span>
                  <Plus className={`w-5 h-5 transition-transform ${openSections.returns ? 'rotate-45' : ''}`} />
                </button>
                {openSections.returns && (
                  <div className="pb-4 text-sm text-gray-600 space-y-2">
                    <p>• Easy 30-day return policy</p>
                    <p>• Free return pickup available</p>
                    <p>• Items must be in original condition</p>
                    <p>• Refund processed within 5-7 business days</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* You may also like */}
        <p className='uppercase text-black mb-3.5 font-bold mt-10 text-4xl italic'>you may also like</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
          {relatedProducts.map((prod) => (
            <div key={prod._id || prod.id} className="group">
              <div className="relative border border-gray-100 cursor-pointer overflow-hidden hover:shadow-lg transition-all duration-300" >
                <Link to={`/productDetail/${prod._id}`}>
                  <img
                    loading="lazy"
                    src={prod.images?.[0] || "/no-image.png"}
                    alt={prod.name || 'Product'}
                    className="w-full aspect-[3/4] object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = "/no-image.png";
                    }}
                  />
                  <button
                    className="absolute top-0 right-0 p-2"
                    aria-label="Add to favorites"
                  >
                    <Heart className="w-4 h-4 text-gray-600 hover:text-red-500 transition-all duration-200" />
                  </button>
                </Link>
              </div>
              <div className="mt-3 space-y-1">
                <h3 className="font-medium text-sm line-clamp-2 text-gray-900">
                  {prod.name}
                </h3>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-lg font-semibold text-gray-900">₹{prod.price}</span>
                  {prod.originalPrice && prod.originalPrice !== prod.price && (
                    <span className="text-gray-500 line-through text-sm">₹{prod.originalPrice}</span>
                  )}
                  {prod.discount && (
                    <span className="text-red-600 text-xs font-medium bg-red-50 px-1.5 py-0.5 rounded">
                      {prod.discount}% OFF
                    </span>
                  )}
                </div>
                {prod.colors && prod.colors.length > 0 && (
                  <div className="flex gap-1 pt-1">
                    {prod.colors.slice(0, 5).map((color, index) => (
                      <span
                        key={`${prod._id || prod.id}-color-${index}`}
                        className="inline-block w-3 h-3 border border-gray-300 hover:scale-110 transition-transform cursor-pointer"
                        style={{ backgroundColor: typeof color === "string" ? color.toLowerCase() : color.name?.toLowerCase() }}
                        title={typeof color === "string" ? color : color.name}
                      />
                    ))}
                    {prod.colors.length > 5 && (
                      <span className="text-xs text-gray-500 self-center ml-1">
                        +{prod.colors.length - 5}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;