import { useAuth } from '@clerk/clerk-react';
import { createClient } from '@supabase/supabase-js';
import { TABLES, type Resume, type ResumeInsert, type ResumeUpdate, type ResumeTemplate } from '../lib/supabase';
import type { ResumeData, ResumeContent } from '../App';

/**
 * Custom hook for Supabase operations with Clerk authentication
 */
export const useSupabase = () => {
    const { userId, getToken } = useAuth();

    // Helper to get Clerk JWT
    const getJwt = async () => {
        const token = await getToken({ template: 'supabase' });
        if (!token) throw new Error('Failed to get auth token from Clerk');
        return token;
    };

    // Create a Supabase client with a custom fetch that injects the JWT
    const getSupabaseWithAuth = async () => {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
        const jwt = await getJwt();
        // Custom fetch to inject Authorization header
        const customFetch = async (input: RequestInfo | URL, init?: RequestInit) => {
            const headers = new Headers(init?.headers || {});
            headers.set('Authorization', `Bearer ${jwt}`);
            return fetch(input, { ...init, headers });
        };
        return createClient(supabaseUrl, supabaseAnonKey, { global: { fetch: customFetch } });
    };

    // Convert ResumeContent to database format
    const convertToDbFormat = (resumeContent: ResumeContent, title: string): ResumeInsert => {
        return {
            user_id: userId!,
            title,
            content: resumeContent,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
    };

    // Convert database resume to ResumeContent format (with fallback for legacy data)
    const convertFromDbFormat = (dbResume: Resume): ResumeContent => {
        const content = dbResume.content;
        if (content && typeof content === 'object' && 'resumeData' in content && 'theme' in content) {
            return content as ResumeContent;
        } else {
            // Legacy: only ResumeData stored
            return {
                resumeData: content as ResumeData,
                theme: {
                    primaryColor: '#1E88E5',
                    secondaryColor: '#ffffff',
                    textColor: '#333333',
                    backgroundColor: '#f5f5f5',
                    headingFont: '"Roboto", sans-serif',
                    bodyFont: '"Open Sans", sans-serif',
                }
            };
        }
    };

    return {
        // Resume operations
        saveResume: async (resumeContent: ResumeContent, title: string): Promise<Resume> => {
            if (!userId) {
                throw new Error('User must be authenticated to save resume');
            }
            const supabase = await getSupabaseWithAuth();
            const resumeToInsert = convertToDbFormat(resumeContent, title);
            const { data, error } = await supabase
                .from(TABLES.RESUMES)
                .upsert(resumeToInsert, { onConflict: 'user_id' })
                .select()
                .single();
            if (error) {
                console.error('Error saving resume:', error);
                throw new Error(`Failed to save resume: ${error.message}`);
            }
            return data;
        },

        getUserResumes: async (): Promise<Resume[]> => {
            if (!userId) {
                throw new Error('User must be authenticated to fetch resumes');
            }
            const supabase = await getSupabaseWithAuth();
            const { data, error } = await supabase
                .from(TABLES.RESUMES)
                .select('*')
                .eq('user_id', userId)
                .order('updated_at', { ascending: false });
            if (error) {
                console.error('Error fetching resumes:', error);
                throw new Error(`Failed to fetch resumes: ${error.message}`);
            }
            return data || [];
        },

        getResumeById: async (resumeId: string): Promise<Resume | null> => {
            if (!userId) {
                throw new Error('User must be authenticated to fetch resume');
            }
            const supabase = await getSupabaseWithAuth();
            const { data, error } = await supabase
                .from(TABLES.RESUMES)
                .select('*')
                .eq('id', resumeId)
                .eq('user_id', userId)
                .single();
            if (error) {
                if (error.code === 'PGRST116') {
                    return null; // Resume not found
                }
                console.error('Error fetching resume:', error);
                throw new Error(`Failed to fetch resume: ${error.message}`);
            }
            return data;
        },

        updateResume: async (resumeId: string, resumeData: Partial<ResumeData>, title?: string): Promise<Resume> => {
            if (!userId) {
                throw new Error('User must be authenticated to update resume');
            }
            const supabase = await getSupabaseWithAuth();
            const updateData: ResumeUpdate = {
                updated_at: new Date().toISOString()
            };
            if (resumeData) {
                // Get current resume to merge with new data
                const currentResume = await supabase
                    .from(TABLES.RESUMES)
                    .select('content')
                    .eq('id', resumeId)
                    .eq('user_id', userId)
                    .single();
                if (currentResume.error) {
                    throw new Error(`Resume not found: ${currentResume.error.message}`);
                }
                updateData.content = {
                    ...currentResume.data.content,
                    ...resumeData
                };
            }
            if (title) {
                updateData.title = title;
            }
            const { data, error } = await supabase
                .from(TABLES.RESUMES)
                .update(updateData)
                .eq('id', resumeId)
                .eq('user_id', userId)
                .select()
                .single();
            if (error) {
                console.error('Error updating resume:', error);
                throw new Error(`Failed to update resume: ${error.message}`);
            }
            return data;
        },

        deleteResume: async (resumeId: string): Promise<void> => {
            if (!userId) {
                throw new Error('User must be authenticated to delete resume');
            }
            const supabase = await getSupabaseWithAuth();
            const { error } = await supabase
                .from(TABLES.RESUMES)
                .delete()
                .eq('id', resumeId)
                .eq('user_id', userId);
            if (error) {
                console.error('Error deleting resume:', error);
                throw new Error(`Failed to delete resume: ${error.message}`);
            }
        },

        // Template operations
        getResumeTemplates: async (): Promise<ResumeTemplate[]> => {
            const supabase = await getSupabaseWithAuth();
            const { data, error } = await supabase
                .from(TABLES.RESUME_TEMPLATES)
                .select('*')
                .order('created_at', { ascending: false });
            if (error) {
                console.error('Error fetching templates:', error);
                throw new Error(`Failed to fetch templates: ${error.message}`);
            }
            return data || [];
        },

        // User profile operations
        syncUserProfile: async (userData: { email: string; firstName?: string; lastName?: string }) => {
            if (!userId) {
                throw new Error('User must be authenticated to sync profile');
            }
            const supabase = await getSupabaseWithAuth();
            const { data, error } = await supabase
                .from(TABLES.USER_PROFILES)
                .upsert({
                    clerk_user_id: userId,
                    email: userData.email,
                    first_name: userData.firstName,
                    last_name: userData.lastName,
                    updated_at: new Date().toISOString()
                }, { onConflict: 'clerk_user_id' })
                .select()
                .single();
            if (error) {
                console.error('Error syncing user profile:', error);
                throw new Error(`Failed to sync user profile: ${error.message}`);
            }
            return data;
        },

        // Utility functions
        convertFromDbFormat,
        convertToDbFormat,
    };
};

export default useSupabase;
