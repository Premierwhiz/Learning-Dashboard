'use client'; // Error components must be Client Components

import { ServerCrash } from 'lucide-react';

export default function Error({ error, reset }) {
  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mb-6 border border-red-500/20">
        <ServerCrash className="w-8 h-8 text-red-500" />
      </div>
      <h1 className="text-2xl font-bold text-white mb-2">Database Connection Failed</h1>
      <p className="text-white/50 mb-6 max-w-md">{error?.message || "Failed to fetch data."}</p>
      <button 
        onClick={() => reset()} 
        className="px-6 py-2 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors"
      >
        Try Again
      </button>
    </div>
  );
}
