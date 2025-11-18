// Generated types placeholder.
// Run `supabase gen types typescript --project-id <PROJECT_ID> > src/app/models/database.types.ts`

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: { Row: { id: string; email: string | null; display_name: string | null; role: string | null }};
      progress: { Row: { id: string; user_id: string; experiencia_id: string; completada: boolean; score?: number | null; meta?: Json | null; created_at: string; updated_at: string }};
      quizzes: { Row: { id: string; user_id: string; quiz_id: string; score?: number | null; respuestas?: Json | null; created_at: string }};
    }
  }
}
