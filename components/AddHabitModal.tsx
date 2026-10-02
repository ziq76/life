'use client';

import { useState } from 'react';
import { createHabit } from '@/app/actions/habit-actions';

export default function AddHabitModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    await createHabit(formData);
    setLoading(false);
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-3 py-1.5 bg-neutral-900 text-white text-xs font-medium rounded-lg hover:bg-neutral-800 transition"
      >
        + Rutin Baru
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-sm w-full p-5 shadow-lg space-y-4">
            <h3 className="text-sm font-bold text-neutral-900">Tambah Rutin / Matlamat</h3>
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-neutral-700 mb-1">Nama Rutin</label>
                <input
                  name="title"
                  type="text"
                  required
                  placeholder="Cth: Coding 1 Jam / Senaman Pagi"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>

              <div>
                <label className="block font-medium text-neutral-700 mb-1">Kategori</label>
                <select
                  name="category"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 bg-white"
                >
                  <option value="Coding">Coding</option>
                  <option value="Kesihatan">Kesihatan</option>
                  <option value="Belajar">Belajar</option>
                  <option value="Kewangan">Kewangan</option>
                  <option value="Umum">Umum</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-1.5 text-neutral-600 hover:text-neutral-900"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-3 py-1.5 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 disabled:opacity-50"
                >
                  {loading ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}