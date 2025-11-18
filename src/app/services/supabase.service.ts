import { Injectable, inject } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from './config.service';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private supabase: SupabaseClient | null = null;
  private configService = inject(ConfigService);

  constructor() {
    // Lazy create supabase client only when env vars are present
    const url = this.configService.get('SUPABASE_URL');
    const key = this.configService.get('SUPABASE_ANON_KEY');
    
    if (url && key) {
      try {
        this.supabase = createClient(url, key);
      } catch (err) {
        console.error('Failed creating supabase client', err);
        this.supabase = null;
      }
    } else {
      console.warn('Supabase not configured - set SUPABASE_URL and SUPABASE_ANON_KEY');
      this.supabase = null;
    }
  }

  // Auth helpers
  async getCurrentUser() {
    if (!this.supabase) return null;
    const res = await this.supabase.auth.getUser();
    return res.data.user;
  }

  async getProfile(userId: string) {
    if (!this.supabase) return null;
    const { data, error } = await this.supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
    if (error) throw error;
    return data;
  }

  async upsertProfile(userId: string, payload: any) {
    if (!this.supabase) throw new Error('Supabase not configured');
    const row = { id: userId, ...payload };
    const { data, error } = await this.supabase.from('profiles').upsert(row).select();
    if (error) throw error;
    return data;
  }

  async signInWithEmail(email: string) {
    if (!this.supabase) throw new Error('Supabase not configured');
    return await this.supabase.auth.signInWithOtp({ email });
  }

  async signInWithPassword(email: string, password: string) {
    if (!this.supabase) throw new Error('Supabase not configured');
    return await this.supabase.auth.signInWithPassword({ email, password });
  }

  async signOut() {
    if (!this.supabase) throw new Error('Supabase not configured');
    return await this.supabase.auth.signOut();
  }

  isConfigured(): boolean {
    return !!this.supabase;
  }

  onAuthStateChange(callback: (event: string, session: any) => void) {
    if (!this.supabase) return () => {};
    const { data } = this.supabase.auth.onAuthStateChange((event, session) => callback(event, session));
    // return unsubscribe
    // data.subscription is an object with unsubscribe() on some supabase versions
    // use optional chaining to be resilient
    return () => (data as any)?.subscription?.unsubscribe?.();
  }

  // Progress CRUD
  async getProgress(userId: string) {
    if (!this.supabase) return [];
    const { data, error } = await this.supabase.from('progress').select('*').eq('user_id', userId);
    if (error) throw error;
    return data;
  }

  async upsertProgress(userId: string, experienciaId: string, payload: any = {}) {
    if (!this.supabase) return null;
    // Use upsert to either insert or update existing (unique user+experiencia enforced in DB)
    const row = { user_id: userId, experiencia_id: experienciaId, ...payload };
    const { data, error } = await this.supabase.from('progress').upsert(row, { onConflict: 'user_id,experiencia_id' }).select();
    if (error) throw error;
    return data;
  }

  async getAllProgress() {
    if (!this.supabase) return [];
    const { data, error } = await this.supabase.from('progress').select('*, profiles(email, display_name, role)');
    if (error) throw error;
    return data;
  }

  subscribeProgress(callback: (payload: any) => void) {
    // Returns channel object; remember to .unsubscribe() when done
    if (!this.supabase) return null;
    const channel = this.supabase.channel('public:progress')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'progress' }, (payload) => callback(payload))
      .subscribe();
    return channel;
  }
}
