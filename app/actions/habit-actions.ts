'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// 1. Tambah Habit / Matlamat Baru
export async function createHabit(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Sila log masuk.');

  const title = formData.get('title') as string;
  const category = (formData.get('category') as string) || 'Umum';

  if (!title) return { error: 'Tajuk rutin wajib diisi.' };

  const { error } = await supabase.from('habits_or_goals').insert({
    user_id: user.id,
    title,
    category,
    frequency: 'Daily',
    is_active: true,
  });

  if (error) return { error: error.message };

  revalidatePath('/');
  return { success: true };
}

// 2. Auth: Sign In
export async function login(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };

  redirect('/');
}

// 3. Auth: Sign Up
export async function signup(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const { error } = await supabase.auth.signUp({ email, password });
  if (error) return { error: error.message };

  redirect('/');
}

// 4. Auth: Sign Out
export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}