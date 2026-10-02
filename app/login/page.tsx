'use client';

import { useState } from 'react';
import { login, signup } from '@/app/actions/habit-actions';

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const formData = new FormData(e.currentTarget);
    const res = isRegister ? await signup(formData) : await login(formData);

    if (res?.error) {
      setErrorMsg(res.error);
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-neutral-50">
      <div className="w-full max-w-sm p-6 bg-white border rounded-2xl shadow-sm space-y-5">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">
            {isRegister ? 'Cipta Akaun Tracker' : 'Log Masuk'}
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Sistem konsistensi & adaptasi peribadi.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 text-xs bg-red-50 text-red-700 border border-red-200 rounded-lg">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">Emel</label>
            <input
              name="email"
              type="email"
              required
              className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
              placeholder="nama@email.com"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">Kata Laluan</label>
            <input
              name="password"
              type="password"
              required
              className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-neutral-900 text-white rounded-lg text-sm font-medium hover:bg-neutral-800 transition disabled:opacity-50"
          >
            {loading ? 'Memproses...' : isRegister ? 'Daftar Akaun' : 'Masuk'}
          </button>
        </form>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setErrorMsg('');
            }}
            className="text-xs text-neutral-500 hover:text-neutral-900"
          >
            {isRegister
              ? 'Dah ada akaun? Log masuk di sini.'
              : 'Belum ada akaun? Daftar sekarang.'}
          </button>
        </div>
      </div>
    </main>
  );
}