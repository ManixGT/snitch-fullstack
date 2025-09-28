const OrdersPage = () => (
  <div className="p-8">
    <div className="flex justify-center mb-6">
      <div className="flex border-b">
        <button className="px-6 py-3 text-orange-500 border-b-2 border-orange-500 font-medium">
          Online
        </button>
        <button className="px-6 py-3 text-gray-500 font-medium hover:text-black">
          In store
        </button>
      </div>
    </div>
    <div className="text-center">
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
  </div>
);

export default OrdersPage;