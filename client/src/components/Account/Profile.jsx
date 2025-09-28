const ProfilePage = () => (
  <div className="p-8">
    <h2 className="text-2xl font-bold mb-6">Profile Information</h2>
    <div className="max-w-md">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <input type="text" className="w-full border border-gray-300 rounded px-3 py-2" placeholder="Enter your name" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input type="email" className="w-full border border-gray-300 rounded px-3 py-2" placeholder="Enter your email" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <input type="tel" className="w-full border border-gray-300 rounded px-3 py-2" placeholder="Enter your phone" />
        </div>
        <button className="w-full bg-black text-white py-3 font-medium hover:bg-gray-800">
          Update Profile
        </button>
      </div>
    </div>
  </div>
);

export default ProfilePage;