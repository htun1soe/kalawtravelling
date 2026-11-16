import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export const AuthPage: React.FC = () => {
  const { signIn, register } = useApp();
  const navigate = useNavigate();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('traveler@kalawtravel.com');
  const [role, setRole] = useState<'traveler' | 'owner'>('traveler');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === 'login') {
        const loggedUser = await signIn(email.trim());
        navigate(loggedUser.role === 'admin' ? '/admin' : '/profile');
      } else {
        await register(name.trim(), email.trim(), role);
        navigate('/profile');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-28 pb-24 max-w-[1360px] mx-auto px-6 md:px-10">
      <div className="max-w-md mx-auto border border-[#D9CCB8] bg-[#F4F0E6] p-8 md:p-10 space-y-6">
        <div className="space-y-2 border-b border-[#D9CCB8] pb-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[#B66F52] font-medium">
            Kalaw Travel Account
          </p>
          <h1 className="font-serif text-3xl text-[#243D32]">
            {mode === 'login' ? 'Welcome Back' : 'Create an Account'}
          </h1>
          <p className="text-xs text-[#52634A]">
            Save favorite places, manage booking requests, or list highland properties.
          </p>
        </div>

        <div className="grid grid-cols-2 border border-[#D9CCB8] p-1 bg-[#EBE5D8]/60">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError(null);
            }}
            className={`py-2 text-xs font-medium transition-colors cursor-pointer ${
              mode === 'login' ? 'bg-[#243D32] text-[#F4F0E6]' : 'text-[#292B27]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setEmail('');
              setError(null);
            }}
            className={`py-2 text-xs font-medium transition-colors cursor-pointer ${
              mode === 'register' ? 'bg-[#243D32] text-[#F4F0E6]' : 'text-[#292B27]'
            }`}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-xs text-[#52634A] mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Su Myat Noe"
                className="w-full px-3 py-2.5 bg-white/80 border border-[#D9CCB8] text-sm focus:outline-none focus:border-[#243D32]"
              />
            </div>
          )}

          <div>
            <label className="block text-xs text-[#52634A] mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-3 py-2.5 bg-white/80 border border-[#D9CCB8] text-sm focus:outline-none focus:border-[#243D32]"
            />
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-xs text-[#52634A] mb-1">Account Type</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as 'traveler' | 'owner')}
                className="w-full px-3 py-2.5 bg-white/80 border border-[#D9CCB8] text-sm focus:outline-none focus:border-[#243D32]"
              >
                <option value="traveler">Traveler / Visitor</option>
                <option value="owner">Property Owner / Local Host</option>
              </select>
            </div>
          )}

          {error && (
            <div role="alert" className="p-3 border border-[#B66F52] bg-[#B66F52]/10 text-xs text-[#292B27]">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#243D32] text-[#F4F0E6] text-sm font-medium rounded-sm hover:bg-[#52634A] transition-colors cursor-pointer"
          >
            {loading
              ? 'Authenticating...'
              : mode === 'login'
                ? 'Sign In'
                : 'Create Account'}
          </button>
        </form>

        {mode === 'login' && (
          <div className="border-t border-[#D9CCB8] pt-4 space-y-2 text-xs text-[#52634A]">
            <p className="font-medium text-[#243D32]">Quick Sign-In Accounts for Testing:</p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setEmail('traveler@kalawtravel.com')}
                className="px-3 py-1.5 border border-[#D9CCB8] hover:border-[#243D32] text-[#243D32] cursor-pointer"
              >
                Traveler Demo
              </button>
              <button
                type="button"
                onClick={() => setEmail('admin@kalawtravel.com')}
                className="px-3 py-1.5 border border-[#D9CCB8] hover:border-[#243D32] text-[#243D32] cursor-pointer"
              >
                Admin Demo
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
