import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

interface LogRecord {
  id: string;
  log_date: string;
  what_failed: string | null;
  lesson_learned: string | null;
  habits_or_goals: {
    title: string;
    category: string;
  } | null;
}

export default async function ReflectionsPage() {
  const supabase = await createClient();

  // Semak authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Tarik data kegagalan dan refleksi, susun dari yang terkini
  const { data: logs, error } = await supabase
    .from('daily_logs')
    .select(`
      id,
      log_date,
      what_failed,
      lesson_learned,
      habits_or_goals (
        title,
        category
      )
    `)
    .eq('status', 'Failed')
    .not('lesson_learned', 'is', null)
    .order('log_date', { ascending: false });

  if (error) {
    console.error('Error fetching reflections:', error.message);
  }

  const reflections = (logs as unknown as LogRecord[]) || [];

  return (
    <main className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Header & Navigasi */}
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">Arkib Refleksi & Adaptasi</h1>
          <p className="text-xs text-neutral-500 mt-1">
            Rekod lompang sistem dan penambahbaikan untuk iterasi seterusnya.
          </p>
        </div>
        <Link
          href="/"
          className="text-xs px-3 py-1.5 border rounded-lg font-medium text-neutral-700 hover:bg-neutral-50 transition"
        >
          ← Kembali ke Tracker
        </Link>
      </div>

      {/* Ringkasan Statistik Ringkas */}
      <div className="p-4 bg-neutral-50 border rounded-xl flex items-center justify-between">
        <div>
          <p className="text-xs text-neutral-500">Jumlah Kegagalan Diadaptasi</p>
          <p className="text-2xl font-bold text-neutral-900">{reflections.length}</p>
        </div>
        <div className="text-right text-xs text-neutral-400">
          <span>Prinsip: Gagal → Nampak Kosong → Tambah Baik</span>
        </div>
      </div>

      {/* Senarai Pengajaran */}
      <section className="space-y-4">
        {reflections.length > 0 ? (
          reflections.map((log) => {
            const dateFormatted = new Date(log.log_date).toLocaleDateString('ms-MY', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            });

            return (
              <div
                key={log.id}
                className="p-5 border rounded-xl bg-white shadow-sm space-y-3"
              >
                {/* Header item: Tarikh & Habit */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                    {dateFormatted}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-neutral-100 text-neutral-700 px-2.5 py-0.5 rounded-full font-medium">
                      {log.habits_or_goals?.title || 'Umum'}
                    </span>
                    <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">
                      {log.habits_or_goals?.category || 'Tabiat'}
                    </span>
                  </div>
                </div>

                {/* Kandungan Lompang vs Adaptasi */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-xs">
                  {/* Poin 5: Lompang / Apa yang tak kena */}
                  <div className="p-3 bg-red-50/60 border border-red-100 rounded-lg">
                    <p className="font-semibold text-red-800 mb-1 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                      Ruang Kosong / Punca Terlepas
                    </p>
                    <p className="text-neutral-700 leading-relaxed">
                      {log.what_failed || 'Tiada catatan punca.'}
                    </p>
                  </div>

                  {/* Poin 4: Tindakan Adaptasi / Tambah Baik */}
                  <div className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-lg">
                    <p className="font-semibold text-emerald-800 mb-1 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      Tindakan Adaptasi (Next Action)
                    </p>
                    <p className="text-neutral-700 leading-relaxed">
                      {log.lesson_learned || 'Tiada tindakan refleksi.'}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 border border-dashed rounded-xl text-neutral-400 text-sm">
            Belum ada rekod refleksi. Bila ada tugasan yang terlepas atau gagal, log di sini untuk diadaptasi.
          </div>
        )}
      </section>
    </main>
  );
}