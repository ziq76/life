import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import HabitCard from '@/components/HabitCard';
import AddHabitModal from '@/components/AddHabitModal';
import { logout } from '@/app/actions/habit-actions';

export default async function Dashboard() {
  const supabase = await createClient();
  const today = new Date().toISOString().split('T')[0];

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: habits } = await supabase
    .from('habits_or_goals')
    .select(`
      id,
      title,
      category,
      daily_logs (
        status,
        log_date
      )
    `)
    .eq('is_active', true);

  return (
    <main className="max-w-xl mx-auto p-6 space-y-6">
      {/* Top Bar: Info User & Logout */}
      <div className="flex items-center justify-between text-xs text-neutral-500 border-b pb-3">
        <span>Log masuk sebagai: <strong className="text-neutral-700">{user.email}</strong></span>
        <form action={logout}>
          <button type="submit" className="text-red-600 hover:underline">
            Log Keluar
          </button>
        </form>
      </div>

      {/* Header Utama */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">Life Iteration Tracker</h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Buat → Rekod → Adaptasi.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/reflections"
            className="text-xs px-3 py-1.5 border rounded-lg font-medium text-neutral-700 hover:bg-neutral-50 transition"
          >
            Arkib Refleksi
          </Link>
          <AddHabitModal />
        </div>
      </header>

      {/* Senarai Tugasan Harian */}
      <div className="space-y-3">
        {habits && habits.length > 0 ? (
          habits.map((h) => {
            const todayLog = Array.isArray(h.daily_logs)
              ? (h.daily_logs as any[]).find((log) => log.log_date === today)
              : null;

            return (
              <HabitCard
                key={h.id}
                id={h.id}
                title={h.title}
                category={h.category}
                currentStatus={todayLog ? todayLog.status : null}
              />
            );
          })
        ) : (
          <div className="text-center py-12 border border-dashed rounded-xl text-neutral-400 text-xs space-y-2">
            <p>Belum ada rutin didaftarkan.</p>
            <p>Klik butang <strong>"+ Rutin Baru"</strong> di atas untuk mula.</p>
          </div>
        )}
      </div>
    </main>
  );
}