import React from 'react';
import { Outlet } from 'react-router-dom';
import MockTaleLogo from '../../assets/planprep4u-logo.jpg';

const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 rounded-full overflow-hidden shadow-lg">
                  <img
                    src={MockTaleLogo}
                    alt="PlanPrep4u Logo"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-primary-600 mb-2">
                PlanPrep4u
              </h1>
              <p className="text-gray-600">
                Your Gateway to Educational Excellence
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;