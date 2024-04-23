import React from 'react';

const Header = ({ isLoggedIn }) => {
  return (
    <header className="bg-gray-800 py-4 px-6 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <a href="/" className="text-white text-lg font-semibold">
          Your Blog
        </a>
        <a href="#" className="text-white hover:text-gray-300">
          Explore
        </a>
        <a href="#" className="text-white hover:text-gray-300">
          Categories
        </a>
      </div>
      <div className="flex items-center space-x-4">
        <input
          type="text"
          placeholder="Search..."
          className="px-2 py-1 rounded-lg bg-gray-700 text-white focus:outline-none"
        />
        {isLoggedIn ? (
          <>
            <a href="#" className="text-white hover:text-gray-300">
              Profile
            </a>
            <a href="#" className="text-white hover:text-gray-300">
              Logout
            </a>
          </>
        ) : (
          <a href="#" className="text-white hover:text-gray-300">
            Login
          </a>
        )}
      </div>
    </header>
  );
};

export default Header;
