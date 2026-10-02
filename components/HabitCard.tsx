'use client';

import { useState } from 'react';
import { submitDailyLog, LogStatus } from '@/app/actions/log-actions';

interface HabitProps {
  id: string;
  title: string;
  category: string;
  currentStatus?: LogStatus | null;
}

export default function HabitCard({ id, title, category, currentStatus }: HabitProps) {
  const [showFailureModal, setShowFailureModal] = useState(false);
  const [whatFailed, setWhatFailed] = useState('');
  const [lessonLearned, setLessonLearned] = useState('');
  const [loading, setLoading] = useState(false);

  const handleQuickComplete = async () => {
    setLoading(true);
    await submitDailyLog({ habitId: id, status: 'Completed' });
    setLoading(false);
  };

  const handleFailureSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await submitDailyLog({
      habitId: id,
      status: 'Failed',
      whatFailed,
      lessonLearned,
    });
    setLoading(false);
    setShowFailureModal(false);
  };

  return (
    <div className="p-4 border rounded-xl bg-white shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
            {category}
          </span>
        </div>

        {/* Paparan status jika sudah direkod hari ini */}
        {currentStatus ? (
          <span
            className={`text-xs px-2.5 py-1 rounded-full font-medium ${
              currentStatus === 'Completed'
                ? 'bg-green-100 text-green-800'
                : 'bg-amber-100 text-amber-800'
            }`}
          >
            {currentStatus === 'Completed' ? '✓ Selesai' : '⚠ Perlu Adapt'}
          </span>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleQuickComplete}
              disabled={loading}
              className="px-3 py-1.5 text-xs font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Selesai
            </button>
            <button
              onClick={() => setShowFailureModal(true)}
              disabled={loading}
              className="px-3 py-1.5 text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 rounded-lg hover:bg-amber-100 transition"
            >
              Gagal / Belajar
            </button>
          </div>
        )}
      </div>

      {/* Modal / Borang Refleksi Kegagalan */}
      {showFailureModal && (
        <form onSubmit={handleFailureSubmit} className="mt-3 p-3 bg-neutral-50 rounded-lg border space-y-3 text-sm">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Punca Tak Selesai (Nampak mana kosong)
            </label>
            <input
              type="text"
              required
              placeholder="Cth: Tak sempat sebab tidur lambat semalam"
              value={whatFailed}
              onChange={(e) => setWhatFailed(e.target.value)}
              className="w-full px-2.5 py-1.5 border rounded-md text-xs focus:ring-1 focus:ring-neutral-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Pengajaran / Tindakan Adaptasi
            </label>
            <input
              type="text"
              required
              placeholder="Cth: Kunci alarm awal, block 30 minit pagi terus"
              value={lessonLearned}
              onChange={(e) => setLessonLearned(e.target.value)}
              className="w-full px-2.5 py-1.5 border rounded-md text-xs focus:ring-1 focus:ring-neutral-800"
            />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowFailureModal(false)}
              className="px-2.5 py-1 text-xs text-neutral-600 hover:text-neutral-900"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-3 py-1 text-xs bg-neutral-900 text-white rounded-md hover:bg-neutral-800"
            >
              {loading ? 'Menyimpan...' : 'Simpan Refleksi'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}