import { useState, useEffect } from "react";
import { Heart, Plus, Minus, X } from "lucide-react";

const CategoryProductPage = ({ category = 'T-SHIRTS' }) => {

  // Mock data for products
  const generateProducts = (category, count = 100) => {
    const colors = ['Black', 'White', 'Grey', 'Navy', 'Brown', 'Green', 'Red', 'Blue'];
    const patterns = ['Solid', 'Striped', 'Printed', 'Checked', 'Textured'];
    const fits = ['Slim', 'Regular', 'Relaxed', 'Oversized'];
    const materials = ['Cotton', 'Polyester', 'Cotton Blend', 'Linen'];
    const sleeves = ['Short Sleeve', 'Long Sleeve', 'Sleeveless'];
    const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', '5XL', '6XL'];

    return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      name: `${category.charAt(0).toUpperCase() + category.slice(1)} ${i + 1}`,
      image: `/api/placeholder/300/400`,
      price: Math.floor(Math.random() * 2000) + 500,
      originalPrice: Math.floor(Math.random() * 1000) + 1500,
      colors: colors[Math.floor(Math.random() * colors.length)],
      pattern: patterns[Math.floor(Math.random() * patterns.length)],
      fit: fits[Math.floor(Math.random() * fits.length)],
      material: materials[Math.floor(Math.random() * materials.length)],
      sleeves: sleeves[Math.floor(Math.random() * sleeves.length)],
      sizes: sizes,
      category: category,
      isNew: Math.random() > 0.7,
      discount: Math.floor(Math.random() * 50) + 10
    }));
  };

  // Filter options
  const filterOptions = {
    deliveryTime: ['60 MINS', 'TODAY'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', '5XL', '6XL'],
    colors: ['Black', 'White', 'Grey', 'Navy', 'Brown', 'Green', 'Red', 'Blue', 'Yellow', 'Pink'],
    patterns: ['Solid', 'Striped', 'Printed', 'Checked', 'Textured', 'Geometric'],
    fits: ['Slim', 'Regular', 'Relaxed', 'Oversized'],
    materials: ['Cotton', 'Polyester', 'Cotton Blend', 'Linen', 'Denim', 'Wool'],
    sleeves: ['Short Sleeve', 'Long Sleeve', 'Sleeveless'],
    priceRanges: [
      { label: '₹0 - ₹500', min: 0, max: 500 },
      { label: '₹500 - ₹1000', min: 500, max: 1000 },
      { label: '₹1000 - ₹1500', min: 1000, max: 1500 },
      { label: '₹1500 - ₹2000', min: 1500, max: 2000 },
      { label: '₹2000+', min: 2000, max: Infinity }
    ]
  };

  const categoryFilters = {
    'T-SHIRTS': ['ALL', 'NEW', 'PLUS SIZE', 'CORE LAB', 'CROCHET', 'STITCHLESS', 'SLIM', 'OVERSIZED', 'BOXY', 'REGULAR', 'RELAXED', 'STRIPES'],
    'SHIRTS': ['ALL', 'NEW', 'FORMAL', 'CASUAL', 'PRINTED', 'SOLID', 'CHECKED', 'SLIM FIT', 'REGULAR FIT'],
    'JEANS': ['ALL', 'NEW', 'SKINNY', 'STRAIGHT', 'RELAXED', 'BAGGY', 'CORE LAB', 'PLUS SIZE'],
    'TROUSERS': ['ALL', 'NEW', 'FORMAL', 'CASUAL', 'CARGO', 'CHINOS', 'PLUS SIZE']
  };

  const [products, setProducts] = useState(generateProducts(category.toLowerCase(), 100));
  const [filteredProducts, setFilteredProducts] = useState(products.slice(0, 20));
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    deliveryTime: [],
    sizes: [],
    colors: [],
    patterns: [],
    fits: [],
    materials: [],
    sleeves: [],
    priceRange: null,
    categoryFilter: 'ALL'
  });

  // Collapsible sections state
  const [openSections, setOpenSections] = useState({
    deliveryTime: false,
    size: false,
    color: false,
    pattern: false,
    fit: false,
    material: false,
    sleeves: false,
    price: false
  });

  const [sortBy, setSortBy] = useState('featured');
  const activeFilters = categoryFilters[category] || categoryFilters['T-SHIRTS'];

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const toggleFilter = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter(item => item !== value)
        : [...prev[filterType], value]
    }));
  };

  const toggleFavorite = (productId) => {
    setFavorites(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const clearFilters = () => {
    setFilters({
      deliveryTime: [],
      sizes: [],
      colors: [],
      patterns: [],
      fits: [],
      materials: [],
      sleeves: [],
      priceRange: null,
      categoryFilter: 'ALL'
    });
  };

  // Apply filters
  useEffect(() => {
    let filtered = products;
    // Apply filters here...
    setFilteredProducts(filtered.slice(0, 20));
  }, [filters, products]);

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const nearBottom = scrollTop + windowHeight >= documentHeight - 500;

      if (nearBottom && !loading && filteredProducts.length < products.length) {
        setLoading(true);
        setTimeout(() => {
          const currentLength = filteredProducts.length;
          const nextProducts = products.slice(currentLength, currentLength + 20);
          setFilteredProducts(prev => [...prev, ...nextProducts]);
          setLoading(false);
        }, 800);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, filteredProducts.length, products.length]);

  const activeFilterCount = Object.values(filters).flat().filter(Boolean).length;

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-5 py-2">
        {/* Main Content Layout */}
        <div className="flex">
          {/* LEFT SIDE FILTERS - Always Visible Column */}
          <div className="w-60 h-screen fixed overflow-y-auto">
            <h2 className="font-bold text-lg mb-4">FILTERS</h2>
            <div className="space-y-1">
              {/* Delivery Time */}
              <div className="border-b border-gray-200">
                <button
                  onClick={() => toggleSection('deliveryTime')}
                  className="w-full flex items-center justify-between py-4 text-left"
                >
                  <span className="font-medium">DELIVERY TIME</span>
                  {openSections.deliveryTime ?
                    <Minus className="w-5 h-5 cursor-pointer" /> :
                    <Plus className="w-5 h-5 cursor-pointer" />
                  }
                </button>
                {openSections.deliveryTime && (
                  <div className="pb-4 space-y-2">
                    {filterOptions.deliveryTime.map(time => (
                      <button
                        key={time}
                        onClick={() => toggleFilter('deliveryTime', time)}
                        className={`block px-3 py-2 text-sm border border-gray-300 mr-2 mb-2 ${filters.deliveryTime.includes(time)
                          ? 'bg-black text-white border-black'
                          : 'bg-white text-black hover:border-black'
                          }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Size */}
              <div className="border-b border-gray-200">
                <button
                  onClick={() => toggleSection('size')}
                  className="w-full flex items-center justify-between py-4 text-left"
                >
                  <span className="font-medium">SIZE</span>
                  {openSections.size ?
                    <Minus className="w-5 h-5 cursor-pointer" /> :
                    <Plus className="w-5 h-5 cursor-pointer" />
                  }
                </button>
                {openSections.size && (
                  <div className="pb-4">
                    <div className="flex flex-wrap gap-2">
                      {filterOptions.sizes.map(size => (
                        <button
                          key={size}
                          onClick={() => toggleFilter('sizes', size)}
                          className={`px-3 py-2 text-sm border border-gray-300 ${filters.sizes.includes(size)
                            ? 'bg-black text-white border-black'
                            : 'bg-white text-black hover:border-black'
                            }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Color */}
              <div className="border-b border-gray-200">
                <button
                  onClick={() => toggleSection('color')}
                  className="w-full flex items-center justify-between py-4 text-left"
                >
                  <span className="font-medium">COLOR</span>
                  {openSections.color ?
                    <Minus className="w-5 h-5 cursor-pointer" /> :
                    <Plus className="w-5 h-5 cursor-pointer" />
                  }
                </button>
                {openSections.color && (
                  <div className="pb-4">
                    <div className="flex flex-wrap gap-2">
                      {filterOptions.colors.map(color => (
                        <button
                          key={color}
                          onClick={() => toggleFilter('colors', color)}
                          className={`px-3 py-2 text-sm border border-gray-300 ${filters.colors.includes(color)
                            ? 'bg-black text-white border-black'
                            : 'bg-white text-black hover:border-black'
                            }`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Pattern */}
              <div className="border-b border-gray-200">
                <button
                  onClick={() => toggleSection('pattern')}
                  className="w-full flex items-center justify-between py-4 text-left"
                >
                  <span className="font-medium">PATTERN</span>
                  {openSections.pattern ?
                    <Minus className="w-5 h-5 cursor-pointer" /> :
                    <Plus className="w-5 h-5 cursor-pointer" />
                  }
                </button>
                {openSections.pattern && (
                  <div className="pb-4">
                    <div className="flex flex-wrap gap-2">
                      {filterOptions.patterns.map(pattern => (
                        <button
                          key={pattern}
                          onClick={() => toggleFilter('patterns', pattern)}
                          className={`px-3 py-2 text-sm border border-gray-300 ${filters.patterns.includes(pattern)
                            ? 'bg-black text-white border-black'
                            : 'bg-white text-black hover:border-black'
                            }`}
                        >
                          {pattern}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Fit */}
              <div className="border-b border-gray-200">
                <button
                  onClick={() => toggleSection('fit')}
                  className="w-full flex items-center justify-between py-4 text-left"
                >
                  <span className="font-medium">FIT</span>
                  {openSections.fit ?
                    <Minus className="w-5 h-5 cursor-pointer" /> :
                    <Plus className="w-5 h-5 cursor-pointer" />
                  }
                </button>
                {openSections.fit && (
                  <div className="pb-4">
                    <div className="flex flex-wrap gap-2">
                      {filterOptions.fits.map(fit => (
                        <button
                          key={fit}
                          onClick={() => toggleFilter('fits', fit)}
                          className={`px-3 py-2 text-sm border border-gray-300 ${filters.fits.includes(fit)
                            ? 'bg-black text-white border-black'
                            : 'bg-white text-black hover:border-black'
                            }`}
                        >
                          {fit}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Material */}
              <div className="border-b border-gray-200">
                <button
                  onClick={() => toggleSection('material')}
                  className="w-full flex items-center justify-between py-4 text-left"
                >
                  <span className="font-medium">MATERIAL</span>
                  {openSections.material ?
                    <Minus className="w-5 h-5 cursor-pointer" /> :
                    <Plus className="w-5 h-5 cursor-pointer" />
                  }
                </button>
                {openSections.material && (
                  <div className="pb-4">
                    <div className="flex flex-wrap gap-2">
                      {filterOptions.materials.map(material => (
                        <button
                          key={material}
                          onClick={() => toggleFilter('materials', material)}
                          className={`px-3 py-2 text-sm border border-gray-300 ${filters.materials.includes(material)
                            ? 'bg-black text-white border-black'
                            : 'bg-white text-black hover:border-black'
                            }`}
                        >
                          {material}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sleeves */}
              <div className="border-b border-gray-200">
                <button
                  onClick={() => toggleSection('sleeves')}
                  className="w-full flex items-center justify-between py-4 text-left"
                >
                  <span className="font-medium">SLEEVES</span>
                  {openSections.sleeves ?
                    <Minus className="w-5 h-5 cursor-pointer" /> :
                    <Plus className="w-5 h-5 cursor-pointer" />
                  }
                </button>
                {openSections.sleeves && (
                  <div className="pb-4">
                    <div className="flex flex-wrap gap-2">
                      {filterOptions.sleeves.map(sleeve => (
                        <button
                          key={sleeve}
                          onClick={() => toggleFilter('sleeves', sleeve)}
                          className={`px-3 py-2 text-sm border border-gray-300 ${filters.sleeves.includes(sleeve)
                            ? 'bg-black text-white border-black'
                            : 'bg-white text-black hover:border-black'
                            }`}
                        >
                          {sleeve}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Price */}
              <div>
                <button
                  onClick={() => toggleSection('price')}
                  className="w-full flex items-center justify-between py-4 text-left"
                >
                  <span className="font-medium">PRICE</span>
                  {openSections.price ?
                    <Minus className="w-5 h-5" /> :
                    <Plus className="w-5 h-5" />
                  }
                </button>
                {openSections.price && (
                  <div className="pb-4">
                    <div className="space-y-2">
                      {filterOptions.priceRanges.map(range => (
                        <button
                          key={range.label}
                          onClick={() => setFilters(prev => ({ ...prev, priceRange: range }))}
                          className={`block w-full text-left px-3 py-2 text-sm border border-gray-300 ${filters.priceRange?.label === range.label
                            ? 'bg-black text-white border-black'
                            : 'bg-white text-black hover:border-black'
                            }`}
                        >
                          {range.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* CLEAR and APPLY Buttons */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={clearFilters}
                className="flex-1 py-3 border border-gray-400 text-black font-medium text-sm uppercase"
              >
                CLEAR
              </button>
              <button className="flex-1 py-3 bg-black text-white font-medium text-sm uppercase">
                APPLY (503)
              </button>
            </div>
          </div>

          {/* RIGHT SIDE - PRODUCTS GRID */}
          <div className="flex-1 ml-85">
            <div className="flex mb-4 justify-between">
              <h1 className="text-4xl font-bold">{category}</h1>
              <div className="flex items-center space-x-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-400 bg-white text-sm min-w-[100px]"
                >
                  <option value="featured">Sort</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest First</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
              {activeFilters.map(filter => (
                <button
                  key={filter}
                  onClick={() => setFilters(prev => ({ ...prev, categoryFilter: filter }))}
                  className={`px-4 py-2 text-sm font-medium border ${filters.categoryFilter === filter
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-black border-gray-400 hover:border-black'
                    }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredProducts.map(product => (
                <div key={product.id} className="group cursor-pointer bg-white overflow-hidden shadow-sm hover:shadow-md transition-all">
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full aspect-[3/4] object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <button
                      onClick={() => toggleFavorite(product.id)}
                      className="absolute top-2 right-2 bg-white/80 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all hover:bg-white"
                    >
                      <Heart
                        className={`w-4 h-4 ${favorites.includes(product.id)
                          ? "text-red-500 fill-red-500"
                          : "text-gray-600"
                          }`}
                      />
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-sm mb-1">{product.name}</h3>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-bold">₹{product.price}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 rounded-full bg-black" title={product.colors}></div>
                      <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Loading Spinner */}
            {loading && (
              <div className="flex justify-center mt-8">
                <div className="w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
              </div>
            )}
          </div>
        </div>

        {showMobileFilters && (
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden"
              onClick={() => setShowMobileFilters(false)}
            />
            <div className="fixed top-0 right-0 h-full w-80 z-50 lg:hidden overflow-y-auto">
              <div className="p-4">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-bold text-lg">FILTERS</h2>
                  <button onClick={() => setShowMobileFilters(false)}>
                    <X className="w-6 h-6" />
                  </button>
                </div>
                {/* Same filter content as desktop but simplified */}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CategoryProductPage;