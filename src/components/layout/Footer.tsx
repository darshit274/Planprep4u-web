import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 ml-64">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div>
            © 2025 PlanPrep4u. All rights reserved.
          </div>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-primary-600">Privacy Policy</a>
            <a href="#" className="hover:text-primary-600">Terms of Service</a>
            <a href="#" className="hover:text-primary-600">Support</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;