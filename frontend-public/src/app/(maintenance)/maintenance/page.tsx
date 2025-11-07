import React from "react";
import { FiAlertCircle } from "react-icons/fi";

export default function MaintenancePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <div className="max-w-md">
        <div className="text-6xl mb-6 text-red-600 flex justify-center">
          <FiAlertCircle />
        </div>
        <h1 className="text-4xl font-bold mb-4">🚧 We'll Be Back Soon!</h1>
        <p className="text-gray-600 mb-6">
          Our website is currently undergoing scheduled maintenance. We are
          working hard to improve your experience and will be back online
          shortly.
        </p>
        <p className="text-gray-400 text-sm">
          Please check back later or contact support if you need assistance.
        </p>
      </div>

      <footer className="mt-12 text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} My Website. All rights reserved.
      </footer>
    </div>
  );
}
