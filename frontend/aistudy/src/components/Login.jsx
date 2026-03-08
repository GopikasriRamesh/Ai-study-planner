import React from 'react';
import { useAuth } from '../context/AuthContext';
import { GraduationCap } from 'lucide-react';

const Login = () => {
  const { googleSignIn } = useAuth();

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white p-10 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-50 text-center">
        <div className="bg-indigo-600 w-16 h-16 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-lg shadow-indigo-100">
          <GraduationCap size={32} />
        </div>
        <h1 className="text-3xl font-black text-slate-900 mb-2">StudyFlow AI</h1>
        <p className="text-slate-500 mb-10 font-medium">Precision study planning for high-achievers.</p>
        
        <button 
          onClick={googleSignIn}
          className="w-full py-4 px-6 bg-white border border-slate-200 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-slate-50 transition-all shadow-sm active:scale-95"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5" alt="google" />
          Continue with Google
        </button>
      </div>
    </div>
  );
};

export default Login;