import { X, ChevronRight } from "lucide-react";

const Sidebar = ({ isOpen, onClose }) => {
  const sidebarCategories = [
    { name: 'shirts', image: 'https://res.cloudinary.com/dhqxhxpzh/image/upload/v1758949329/featuredCategory/imgi_8_1757500061_y34gqk.jpg' },
    { name: 'trousers', image: 'https://res.cloudinary.com/dhqxhxpzh/image/upload/v1758949329/featuredCategory/imgi_9_1756448740_aodqjy.jpg' },
    { name: 'jeans', image: 'https://res.cloudinary.com/dhqxhxpzh/image/upload/v1758949329/featuredCategory/imgi_10_1756448755_dgnqyk.jpg' },
    { name: 'ready to party', image: 'https://res.cloudinary.com/dhqxhxpzh/image/upload/v1758949330/featuredCategory/imgi_11_1756450022_tgdqk5.jpg' },
    { name: 'perfume', image: 'https://res.cloudinary.com/dhqxhxpzh/image/upload/v1758949331/featuredCategory/imgi_12_1758356227_n1spq6.jpg' },
    { name: 'essentials', image: 'https://res.cloudinary.com/dhqxhxpzh/image/upload/v1758949333/featuredCategory/imgi_13_1757586970_jdo8fm.jpg' },
    { name: 'work wear', image: 'https://res.cloudinary.com/dhqxhxpzh/image/upload/v1758949334/featuredCategory/imgi_14_1758356247_nluosh.jpg' },
    { name: 'work wear', image: 'https://res.cloudinary.com/dhqxhxpzh/image/upload/v1758949334/featuredCategory/imgi_15_1756448771_mjrqj4.jpg' },
    { name: 'plus size', image: 'https://res.cloudinary.com/dhqxhxpzh/image/upload/v1758949335/featuredCategory/imgi_16_1756448786_rs4pxj.jpg' },
    { name: 'snitch luxe', image: 'https://res.cloudinary.com/dhqxhxpzh/image/upload/v1758949337/featuredCategory/imgi_18_1757586866_fbxoyo.jpg' },
    { name: "", image: 'https://res.cloudinary.com/dhqxhxpzh/image/upload/v1758949336/featuredCategory/imgi_17_1756449362_spqmjn.jpg' }
  ];

  return (
    <>
      {/* Overlay for all screens when sidebar is open */}
      <div
        className={`fixed inset-0 bg-black/65 z-40 transition-opacity duration-300
          ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Sidebar - visible on all screens */}
      <div
        className={`fixed top-0 left-0 h-full w-100 bg-white z-50 transform transition-transform duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="p-4 h-full overflow-y-auto">
          {/* Header with close button */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">CATEGORIES</h2>
            {/* Close button visible on all screens */}
            <button onClick={onClose}>
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Category Items */}
          <div className="space-y-1 border-b border-b-gray-600 ">
            {sidebarCategories.map((category, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 hover:bg-gray-5 cursor-pointer border-b border-b-gray-300"
                onClick={onClose} // Close sidebar when category is clicked
              >
                <div className="flex items-center space-x-3">
                  <img
                    loading='lazy'
                    src={category.image}
                    alt={category.name}
                    className="w-20 h-20 object-cover"
                  />
                  <span className="uppercase font-bold">{category.name}</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;