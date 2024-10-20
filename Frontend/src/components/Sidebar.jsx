import React from 'react';
import { Link } from 'react-router-dom';

function Sidebar() {
  return (
    <div className="sidebar bg-white w-64 h-screen shadow-lg fixed top-17 left-0 flex flex-col p-6 space-y-8">
      <h2 className="sidebar-title text-2xl font-bold text-black m-0 text-center">
        MENU
      </h2>
      <div className="flex flex-col space-y-2">
        <Link to="classes" className="sidebar-item bg-gray-700 hover:bg-blue-700 text-white transition duration-300 rounded-lg p-4 cursor-pointer font-medium">
          Classes
        </Link>
        <Link to="assignments" className="sidebar-item bg-gray-700 hover:bg-blue-700 text-white transition duration-300 rounded-lg p-4 cursor-pointer font-medium">
          Assignments
        </Link>
        <Link to="doubts" className="sidebar-item bg-gray-700 hover:bg-blue-700 text-white transition duration-300 rounded-lg p-4 cursor-pointer font-medium">
          Doubts
        </Link>
      </div>
    </div>
  );
}

export default Sidebar;