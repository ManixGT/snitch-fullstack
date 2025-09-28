import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header.jsx";
import HeroSwiper from "./components/LandingPage/HeroSwiper.jsx";
import FeaturedCategories from "./components/LandingPage/FeaturedCategory.jsx";
import PromotionalBanner from "./components/LandingPage/PromotionalBanner.jsx";
import ProductGrid from "./components/LandingPage/ProductGrid.jsx";
import Sidebar from "./components/Insiders/Sidebar.jsx";
import Footer from "./components/Footer.jsx";
import CategoryProductPage from "./components/Insiders/CategoryProductPage.jsx";
import ProductDetailPage from "./components/Insiders/ProductDetailPage.jsx";
import Cart from "./components/Insiders/Cart.jsx";
import Account from "./components/Account/index.jsx"
import AuthModal from "./components/Auth/index.jsx"
import { useState } from "react";

// Layout component - uses useLocation hook
const Layout = ({ children, onSidebarOpen, sidebarOpen, setSidebarOpen, onAuthButtonClick }) => {
  const location = useLocation();

  // Define which pages should show header and footer
  const isLandingPage = location.pathname === '/';
  const isCategoriesPage = location.pathname === '/categories';
  const isProductDetailPage = location.pathname === '/productDetail';

  // Pages where header should be shown
  const showHeader = isLandingPage || isCategoriesPage || isProductDetailPage;

  // Pages where footer should be shown
  const showFooter = !(location.pathname === '/cart' || location.pathname === '/account');

  return (
    <div className="min-h-screen bg-white">
      {showHeader && <Header onSidebarOpen={onSidebarOpen} onAuthButtonClick={onAuthButtonClick} />}
      {/* ↑ ADD onAuthButtonClick HERE */}
      {children}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {showFooter && (
        <div className={isCategoriesPage ? "ml-90 mr-15" : ""}>
          <Footer />
        </div>
      )}
    </div>
  );
};

// Home Page Component
const HomePage = () => {
  return (
    <div className="mx-5">

      <HeroSwiper />
      <FeaturedCategories />
      <PromotionalBanner />
      <ProductGrid />
    </div>
  );
};

// Category Page Component
const CategoryPage = () => {
  return (
    <div>
      <CategoryProductPage />
    </div>
  );
};

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState(null);

  // ADD THIS FUNCTION
  const handleAuthButtonClick = () => {
    setIsAuthModalOpen(true);
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setIsAuthModalOpen(false);
  };

  return (
    <Router>
      <Layout
        onSidebarOpen={() => setSidebarOpen(true)}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onAuthButtonClick={handleAuthButtonClick}
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/categories" element={<CategoryPage />} />
          <Route path="/productDetail/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/account" element={<Account />} />
          <Route path="*" element={<div className="mx-60 text-center py-20">Page Not Found</div>} />
        </Routes>
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      </Layout>
    </Router>
  );
};

export default App;





