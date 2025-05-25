import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables. Please check your .env.local file.');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database table names
export const TABLES = {
    RESUMES: 'resumes',
    RESUME_TEMPLATES: 'resume_templates',
    USER_PROFILES: 'user_profiles'
} as const;

// Database types
export interface Database {
    public: {
        Tables: {
            resumes: {
                Row: {
                    id: string;
                    user_id: string;
                    title: string;
                    content: Record<string, any>;
                    template_id?: string;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    title: string;
                    content: Record<string, any>;
                    template_id?: string;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    title?: string;
                    content?: Record<string, any>;
                    template_id?: string;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            resume_templates: {
                Row: {
                    id: string;
                    name: string;
                    structure: Record<string, any>;
                    tags: string[];
                    is_premium: boolean;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    name: string;
                    structure: Record<string, any>;
                    tags?: string[];
                    is_premium?: boolean;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    name?: string;
                    structure?: Record<string, any>;
                    tags?: string[];
                    is_premium?: boolean;
                    created_at?: string;
                };
            };
            user_profiles: {
                Row: {
                    id: string;
                    clerk_user_id: string;
                    email: string;
                    first_name?: string;
                    last_name?: string;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    clerk_user_id: string;
                    email: string;
                    first_name?: string;
                    last_name?: string;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    clerk_user_id?: string;
                    email?: string;
                    first_name?: string;
                    last_name?: string;
                    created_at?: string;
                    updated_at?: string;
                };
            };
        };
    };
}

export type Resume = Database['public']['Tables']['resumes']['Row'];
export type ResumeInsert = Database['public']['Tables']['resumes']['Insert'];
export type ResumeUpdate = Database['public']['Tables']['resumes']['Update'];

export type ResumeTemplate = Database['public']['Tables']['resume_templates']['Row'];
export type UserProfile = Database['public']['Tables']['user_profiles']['Row'];
