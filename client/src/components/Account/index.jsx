import React, { useState } from 'react';
import { ChevronRight, ShoppingBag } from 'lucide-react';

// Mock React Router Link component (replace with actual react-router-dom Link)
const Link = ({ to, children, className, onClick }) => (
  <a
    href={to}
    className={className}
    onClick={(e) => {
      e.preventDefault();
      if (onClick) onClick();
      // In real app, this would be handled by React Router
      window.history.pushState({}, '', to);
    }}
  >
    {children}
  </a>
);

// Individual page components
const OverviewPage = () => (
  <div className="p-8 text-center">
    <div className="max-w-md mx-auto">
      <div className="mb-8">
        <div className="w-48 h-48 mx-auto mb-6 relative">
          <img
            src="/api/placeholder/200/280"
            alt="Shopping illustration"
            className="w-full h-full object-contain"
          />
        </div>
      </div>
      <h2 className="text-2xl font-bold mb-4">NO ORDERS YET!</h2>
      <p className="text-gray-600 mb-8">
        You haven't placed an order with us. Start shopping to discover your style and enjoy great deals.
      </p>
      <button className="w-full bg-black text-white py-4 font-bold text-lg hover:bg-gray-800 transition-colors">
        START SHOPPING
      </button>
    </div>
  </div>
);



const WishlistPage = () => (
  <div className="p-8 text-center">
    <div className="max-w-md mx-auto">
      <div className="mb-8">
        <div className="w-48 h-48 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
          <ShoppingBag className="w-20 h-20 text-gray-400" />
        </div>
      </div>
      <h2 className="text-2xl font-bold mb-4">YOUR WISHLIST IS EMPTY</h2>
      <p className="text-gray-600 mb-8">
        Add items you love to your wishlist. Review them anytime and easily move them to your bag.
      </p>
      <button className="w-full bg-black text-white py-4 font-bold text-lg hover:bg-gray-800 transition-colors">
        START SHOPPING
      </button>
    </div>
  </div>
);

const AddressesPage = () => (
  <div className="p-8">
    <h2 className="text-2xl font-bold mb-6">Saved Addresses</h2>
    <div className="text-center py-12">
      <p className="text-gray-600 mb-6">No saved addresses found</p>
      <button className="bg-black text-white px-6 py-3 font-medium hover:bg-gray-800">
        Add New Address
      </button>
    </div>
  </div>
);

const RefundsPage = () => (
  <div className="p-8">
    <h2 className="text-2xl font-bold mb-6">Refunds</h2>
    <div className="text-center py-12">
      <p className="text-gray-600">No refund requests found</p>
    </div>
  </div>
);

const GiftCardsPage = () => (
  <div className="p-8">
    <h2 className="text-2xl font-bold mb-6">Gift Cards</h2>
    <div className="text-center py-12">
      <p className="text-gray-600 mb-6">No gift cards available</p>
      <button className="bg-black text-white px-6 py-3 font-medium hover:bg-gray-800">
        Buy Gift Card
      </button>
    </div>
  </div>
);

const RateReviewPage = () => (
  <div className="p-8">
    <h2 className="text-2xl font-bold mb-6">Rate and Review</h2>
    <div className="text-center py-12">
      <p className="text-gray-600">No items to review</p>
    </div>
  </div>
);

const StoresPage = () => (
  <div className="p-8">
    <h2 className="text-2xl font-bold mb-6">Stores Near Me</h2>
    <div className="text-center py-12">
      <p className="text-gray-600 mb-6">Enable location to find stores near you</p>
      <button className="bg-black text-white px-6 py-3 font-medium hover:bg-gray-800">
        Enable Location
      </button>
    </div>
  </div>
);

const PlusStorePage = () => (
  <div className="p-8">
    <h2 className="text-2xl font-bold mb-6">Switch to Plus Store</h2>
    <div className="text-center py-12">
      <p className="text-gray-600 mb-6">Upgrade to Plus Store for exclusive benefits</p>
      <button className="bg-black text-white px-6 py-3 font-medium hover:bg-gray-800">
        Learn More
      </button>
    </div>
  </div>
);

const CreateEarnPage = () => (
  <div className="p-8">
    <div className="flex items-center mb-6">
      <h2 className="text-2xl font-bold">Create and Earn</h2>
      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded ml-3">NEW</span>
    </div>
    <div className="text-center py-12">
      <p className="text-gray-600 mb-6">Start creating content and earn rewards</p>
      <button className="bg-black text-white px-6 py-3 font-medium hover:bg-gray-800">
        Get Started
      </button>
    </div>
  </div>
);

const SettingsPage = () => (
  <div className="p-8">
    <h2 className="text-2xl font-bold mb-6">Settings</h2>
    <div className="max-w-md space-y-4">
      <div className="flex items-center justify-between py-3 border-b">
        <span>Notifications</span>
        <input type="checkbox" className="w-5 h-5" />
      </div>
      <div className="flex items-center justify-between py-3 border-b">
        <span>Email Updates</span>
        <input type="checkbox" className="w-5 h-5" />
      </div>
      <div className="flex items-center justify-between py-3 border-b">
        <span>SMS Alerts</span>
        <input type="checkbox" className="w-5 h-5" />
      </div>
    </div>
  </div>
);

const HelpPage = () => (
  <div className="p-8">
    <h2 className="text-2xl font-bold mb-6">Online Ordering Help</h2>
    <div className="space-y-4">
      <div className="border border-gray-200 rounded p-4">
        <h3 className="font-medium mb-2">How to place an order?</h3>
        <p className="text-gray-600 text-sm">Step-by-step guide to placing your first order...</p>
      </div>
      <div className="border border-gray-200 rounded p-4">
        <h3 className="font-medium mb-2">Payment methods</h3>
        <p className="text-gray-600 text-sm">We accept all major credit cards, debit cards...</p>
      </div>
      <div className="border border-gray-200 rounded p-4">
        <h3 className="font-medium mb-2">Delivery information</h3>
        <p className="text-gray-600 text-sm">Learn about our delivery options and timelines...</p>
      </div>
    </div>
  </div>
);

//& Main ACCOUNT Page Component
const Index = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const menuItems = [
    { key: 'overview', label: 'OVERVIEW', path: '/profile' },
    { key: 'profile', label: 'PROFILE', path: '/profile/edit' },
    { key: 'orders', label: 'ORDERS', path: '/profile/orders' },
    { key: 'wishlist', label: 'WISHLIST', path: '/profile/wishlist' },
    { key: 'addresses', label: 'ADDRESSES', path: '/profile/addresses' },
    { key: 'refunds', label: 'REFUNDS', path: '/profile/refunds' },
    { key: 'giftcards', label: 'GIFT CARDS', path: '/profile/gift-cards' },
    { key: 'review', label: 'RATE AND REVIEW', path: '/profile/reviews' },
    { key: 'stores', label: 'STORES NEAR ME', path: '/profile/stores' },
    { key: 'plus', label: 'SWITCH TO PLUS STORE', path: '/profile/plus' },
    { key: 'earn', label: 'CREATE AND EARN', path: '/profile/create-earn', badge: 'NEW' },
    { key: 'settings', label: 'SETTINGS', path: '/profile/settings' },
    { key: 'help', label: 'ONLINE ORDERING HELP', path: '/profile/help' },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'overview': return <OverviewPage />;
      case 'profile': return <ProfilePage />;
      case 'orders': return <OrdersPage />;
      case 'wishlist': return <WishlistPage />;
      case 'addresses': return <AddressesPage />;
      case 'refunds': return <RefundsPage />;
      case 'giftcards': return <GiftCardsPage />;
      case 'review': return <RateReviewPage />;
      case 'stores': return <StoresPage />;
      case 'plus': return <PlusStorePage />;
      case 'earn': return <CreateEarnPage />;
      case 'settings': return <SettingsPage />;
      case 'help': return <HelpPage />;
      default: return <OverviewPage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto flex">
        {/* Sidebar Navigation */}
        <div className="w-80 bg-white border-r border-gray-200 min-h-screen">
          <div className="p-6">
            <nav className="space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.key}
                  to={item.path}
                  onClick={() => setActiveSection(item.key)}
                  className={`flex items-center justify-between w-full px-4 py-3 text-left text-sm font-medium rounded-lg transition-colors ${activeSection === item.key
                    ? 'bg-gray-100 text-black'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-black'
                    }`}
                >
                  <div className="flex items-center">
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded ml-3">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 bg-white">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Index;