import React, { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';

export const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <section className="py-16 bg-white dark:bg-zinc-950 transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-brand-50 dark:bg-zinc-900/50 p-8 sm:p-12 md:p-16 border border-brand-100/50 dark:border-zinc-800 flex flex-col items-center text-center">
          
          {/* Radial visual glows */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-200/30 dark:bg-zinc-800/10 rounded-full filter blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-100/30 dark:bg-zinc-800/10 rounded-full filter blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl">
            <span className="text-xs font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-widest">Stay Updated</span>
            <h2 className="text-2xl sm:text-3xl font-display font-black text-gray-900 dark:text-white mt-2">
              Join the Collector's Club
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400 mt-3 max-w-md mx-auto leading-relaxed">
              Subscribe to get early notifications of limited drops, custom color availability, and behind-the-scenes 3D printing workflows.
            </p>

            {subscribed ? (
              <div className="mt-8 flex flex-col items-center gap-2 text-green-600 dark:text-green-400 animate-in zoom-in-95 duration-200">
                <CheckCircle size={32} />
                <span className="text-sm font-semibold">Thank you! You have successfully subscribed.</span>
                <span className="text-[10px] text-gray-400 dark:text-zinc-500">We drop limited runs once or twice a month. No spam.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto w-full">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-grow bg-white dark:bg-zinc-950 text-xs sm:text-sm text-gray-900 dark:text-white px-5 py-3 rounded-xl border border-gray-200 dark:border-zinc-800 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center px-6 py-3.5 border border-transparent text-xs sm:text-sm font-semibold rounded-xl text-white bg-brand-600 hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-600 shadow-sm transition-all duration-300 gap-2 flex-shrink-0"
                >
                  <span>Subscribe</span>
                  <Send size={12} />
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};
