import { useSupabase } from '../hooks/useSupabase';
import { useMemo } from 'react';
import type { ResumeData, ResumeContent } from '../App';
import type { Resume, ResumeTemplate, UserProfile } from '../lib/supabase';

// Types for API responses
interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
}

/**
 * Custom hook for making Supabase API calls
 * This replaces the generic backend API with Supabase integration
 */
export const useApi = () => {
    const supabase = useSupabase();

    // Helper function to wrap Supabase calls in consistent API response format
    const wrapSupabaseCall = async <T>(
        operation: () => Promise<T>
    ): Promise<ApiResponse<T>> => {
        try {
            const data = await operation();
            return {
                success: true,
                data
            };
        } catch (error) {
            console.error('Supabase API error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            };
        }
    };

    // Use useMemo to ensure stable object reference across renders
    return useMemo(() => ({
        // Resume operations
        saveResume: async (resumeContent: ResumeContent, title: string = 'Untitled Resume'): Promise<ApiResponse<Resume>> => {
            return wrapSupabaseCall(() => supabase.saveResume(resumeContent, title));
        },

        getResumes: async (): Promise<ApiResponse<Resume[]>> => {
            return wrapSupabaseCall(() => supabase.getUserResumes());
        },

        getResumeById: async (resumeId: string): Promise<ApiResponse<Resume | null>> => {
            return wrapSupabaseCall(() => supabase.getResumeById(resumeId));
        },

        updateResume: async (resumeId: string, resumeData: Partial<ResumeData>, title?: string): Promise<ApiResponse<Resume>> => {
            return wrapSupabaseCall(() => supabase.updateResume(resumeId, resumeData, title));
        },

        deleteResume: async (resumeId: string): Promise<ApiResponse<void>> => {
            return wrapSupabaseCall(() => supabase.deleteResume(resumeId));
        },

        // Template operations
        getResumeTemplates: async (): Promise<ApiResponse<ResumeTemplate[]>> => {
            return wrapSupabaseCall(() => supabase.getResumeTemplates());
        },

        // User profile operations
        syncUserProfile: async (userData: { email: string; firstName?: string; lastName?: string }): Promise<ApiResponse<UserProfile>> => {
            return wrapSupabaseCall(() => supabase.syncUserProfile(userData));
        },

        // Utility functions
        // Returns ResumeContent, not just ResumeData
        convertResumeFromDb: (dbResume: Resume): ResumeContent => {
            return supabase.convertFromDbFormat(dbResume);
        }, convertResumeToDb: (resumeContent: ResumeContent, title: string) => {
            return supabase.convertToDbFormat(resumeContent, title);
        }
    }), [supabase]); // Only re-create if supabase instance changes
};
