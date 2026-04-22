import React from 'react';
import { AlertCircle, Terminal } from 'lucide-react';
import { motion } from 'motion/react';

export default function Home() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gray-50">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-200 border border-gray-100 max-w-sm w-full text-center"
        id="notice-card"
      >
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="text-red-600" size={48} />
        </div>
        
        <h2 className="text-2xl font-black text-gray-900 mb-2">Notice</h2>
        <div className="h-1 w-12 bg-red-600 mx-auto mb-6 rounded-full" />
        
        <div className="bg-red-50/50 p-4 rounded-2xl border border-red-100 mb-6">
          <p className="text-red-800 font-bold text-lg leading-snug">
            Server is currently down. Please try again later.
          </p>
        </div>

        <p className="text-gray-400 text-sm italic">
          Maintenance in progress. Estimated recovery: 2 hours.
        </p>
        
        <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-center gap-2 text-gray-400">
          <Terminal size={14} />
          <span className="text-[10px] font-mono uppercase tracking-widest">System Status: Maintenance</span>
        </div>
      </motion.div>
    </div>
  );
}
