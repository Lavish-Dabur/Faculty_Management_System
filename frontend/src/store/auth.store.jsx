import React from 'react';
import { ArrowLeft, LogIn, UserPlus } from 'lucide-react';
import PrimaryButton from '../components/PrimaryButton';

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";


const AuthGate = ({ navigate }) => (
  <div className="p-6 text-center">
    <h2 className="text-3xl font-bold mb-4">Authentication Gateway</h2>
    <div className="flex flex-col sm:flex-row gap-6 max-w-md mx-auto">
      <PrimaryButton onClick={() => navigate('login')} color="bg-blue-600" Icon={LogIn}>
        Login
      </PrimaryButton>
      <PrimaryButton onClick={() => navigate('signup')} color="bg-purple-600" Icon={UserPlus}>
        Sign Up
      </PrimaryButton>
    </div>
    <button onClick={() => navigate('home')} className="mt-10 flex items-center gap-1 text-gray-500 hover:text-indigo-600">
      <ArrowLeft className="h-4 w-4" /> Back to Home
    </button>
  </div>
);

export default AuthGate;