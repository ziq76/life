'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export type LogStatus = 'Completed' | 'Failed' | 'Skipped';

interface LogPayload {
  habitId: string;
  status: LogStatus;
  whatFailed?: string;
  lessonLearned?: string;
}

export async function submitDailyLog({
  habitId,
  status,
  whatFailed,
  lessonLearned,
}: LogPayload) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const today = new Date().toISOString().split('T')[0];

  // Upsert daily log berdasarkan habit_id dan tarikh hari ini
  const { error } = await supabase
    .from('daily_logs')
    .upsert(
      {
        user_id: user.id,
        habit_id: habitId,
        log_date: today,
        status,
        what_failed: whatFailed || null,
        lesson_learned: lessonLearned || null,
      },
      { onConflict: 'habit_id, log_date' }
    );

  if (error) {
    console.error('Error submitting log:', error);
    throw new Error('Gagal menyimpan log');
  }

  // Muat semula halaman dashboard secara automatik
  revalidatePath('/');
}