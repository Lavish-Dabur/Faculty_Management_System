import React from 'react';
import { Zap, Database } from 'lucide-react';
import PrimaryButton from '../components/PrimaryButton';

const CENTRAL_ILLUSTRATION = "https://placehold.co/200x200/4f46e5/ffffff?text=U+M+S";

const HomePage = ({ navigate }) => (
  <div className="text-center p-8 bg-white rounded-xl">
    <img src={CENTRAL_ILLUSTRATION} alt="UMS Logo" className="w-24 h-24 mx-auto mb-6 rounded-full shadow-lg border-4 border-indigo-100" />
    <h1 className="text-4xl font-extrabold mb-4">User Management System</h1>
    <p className="text-lg mb-12">Select an operation below to manage records or view data.</p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
      <div className="p-8 bg-indigo-50 border-indigo-300 rounded-xl shadow-lg">
        <Zap className="h-8 w-8 text-indigo-700 mx-auto mb-4" />
        <h3 className="text-2xl font-bold mb-2 text-indigo-800">Update Records</h3>
        <PrimaryButton onClick={() => navigate('auth_gate')} color="bg-indigo-600" Icon={Zap}>
          Update Information
        </PrimaryButton>
      </div>
      <div className="p-8 bg-cyan-50 border-cyan-300 rounded-xl shadow-lg">
        <Database className="h-8 w-8 text-cyan-700 mx-auto mb-4" />
        <h3 className="text-2xl font-bold mb-2 text-cyan-800">View Data</h3>
        <PrimaryButton onClick={() => navigate('retrieve')} color="bg-cyan-600" Icon={Database}>
          Retrieve Information
        </PrimaryButton>
      </div>
    </div>
  </div>
);

export default HomePage;
