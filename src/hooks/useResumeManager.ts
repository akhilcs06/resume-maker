import { useState, useEffect, useCallback } from 'react';
import { useApi } from '../services/api';
import type { ResumeData, ResumeContent } from '../App';
import type { Resume } from '../lib/supabase';

export interface ResumeState {
    currentResume: ResumeData | null;
    savedResumes: Resume[];
    isLoading: boolean;
    isSaving: boolean;
    error: string | null;
    saveStatus: 'idle' | 'saving' | 'saved' | 'error';
}

/**
 * Hook for managing resume state and operations
 * Provides CRUD operations for resumes with auto-save functionality
 */
export const useResumeManager = () => {
    const api = useApi();

    const [state, setState] = useState<ResumeState>({
        currentResume: null,
        savedResumes: [],
        isLoading: false,
        isSaving: false,
        error: null,
        saveStatus: 'idle'
    });

    // Load user's saved resumes
    const loadResumes = useCallback(async () => {
        setState(prev => ({ ...prev, isLoading: true, error: null }));

        try {
            const response = await api.getResumes();
            if (response.success) {
                setState(prev => ({
                    ...prev,
                    savedResumes: response.data || [],
                    isLoading: false
                }));
            } else {
                throw new Error(response.error || 'Failed to load resumes');
            }
        } catch (error) {
            setState(prev => ({
                ...prev,
                error: error instanceof Error ? error.message : 'Failed to load resumes',
                isLoading: false
            }));
        }
    }, [api]);

    // Save current resume (now expects ResumeContent, not just ResumeData)
    const saveResume = useCallback(async (resumeContent: ResumeContent, title?: string) => {
        setState(prev => ({ ...prev, isSaving: true, saveStatus: 'saving', error: null }));
        try {
            const resumeTitle = title || `Resume - ${new Date().toLocaleDateString()}`;
            const response = await api.saveResume(resumeContent, resumeTitle);

            if (response.success && response.data) {
                const newResume = response.data;
                setState(prev => ({
                    ...prev,
                    isSaving: false,
                    saveStatus: 'saved',
                    savedResumes: prev.savedResumes.some(r => r.id === newResume.id)
                        ? prev.savedResumes.map(r => r.id === newResume.id ? newResume : r)
                        : [newResume, ...prev.savedResumes]
                }));

                // Reset save status after 3 seconds
                setTimeout(() => {
                    setState(prev => ({ ...prev, saveStatus: 'idle' }));
                }, 3000);

                return response.data;
            } else {
                throw new Error(response.error || 'Failed to save resume');
            }
        } catch (error) {
            setState(prev => ({
                ...prev,
                isSaving: false,
                saveStatus: 'error',
                error: error instanceof Error ? error.message : 'Failed to save resume'
            }));
            throw error;
        }
    }, [api]);

    // Load a specific resume
    const loadResume = useCallback(async (resumeId: string) => {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        try {
            const response = await api.getResumeById(resumeId);
            if (response.success && response.data) {
                const loaded = api.convertResumeFromDb(response.data);
                const resumeData = 'resumeData' in loaded ? loaded.resumeData : loaded;
                setState(prev => ({
                    ...prev,
                    currentResume: resumeData,
                    isLoading: false
                }));
                return resumeData;
            } else {
                throw new Error(response.error || 'Resume not found');
            }
        } catch (error) {
            setState(prev => ({
                ...prev,
                error: error instanceof Error ? error.message : 'Failed to load resume',
                isLoading: false
            }));
            throw error;
        }
    }, [api]);

    // Update current resume
    const updateResume = useCallback(async (resumeId: string, updates: Partial<ResumeData>, title?: string) => {
        setState(prev => ({ ...prev, isSaving: true, saveStatus: 'saving', error: null }));

        try {
            const response = await api.updateResume(resumeId, updates, title);
            if (response.success && response.data) {
                const loaded = api.convertResumeFromDb(response.data);
                const updatedResumeData = 'resumeData' in loaded ? loaded.resumeData : loaded;
                setState(prev => ({
                    ...prev,
                    currentResume: updatedResumeData,
                    isSaving: false,
                    saveStatus: 'saved',
                    savedResumes: prev.savedResumes.map(resume =>
                        resume.id === resumeId ? response.data! : resume
                    )
                }));

                // Reset save status after 3 seconds
                setTimeout(() => {
                    setState(prev => ({ ...prev, saveStatus: 'idle' }));
                }, 3000);

                return response.data;
            } else {
                throw new Error(response.error || 'Failed to update resume');
            }
        } catch (error) {
            setState(prev => ({
                ...prev,
                isSaving: false,
                saveStatus: 'error',
                error: error instanceof Error ? error.message : 'Failed to update resume'
            }));
            throw error;
        }
    }, [api]);

    // Delete a resume
    const deleteResume = useCallback(async (resumeId: string) => {
        setState(prev => ({ ...prev, isLoading: true, error: null }));

        try {
            const response = await api.deleteResume(resumeId);
            if (response.success) {
                setState(prev => ({
                    ...prev,
                    isLoading: false,
                    savedResumes: prev.savedResumes.filter(resume => resume.id !== resumeId)
                }));
            } else {
                throw new Error(response.error || 'Failed to delete resume');
            }
        } catch (error) {
            setState(prev => ({
                ...prev,
                error: error instanceof Error ? error.message : 'Failed to delete resume',
                isLoading: false
            }));
            throw error;
        }
    }, [api]);

    // Set current resume data (for editing)
    const setCurrentResume = useCallback((resumeData: ResumeData) => {
        setState(prev => ({ ...prev, currentResume: resumeData }));
    }, []);

    // Clear error
    const clearError = useCallback(() => {
        setState(prev => ({ ...prev, error: null }));
    }, []);

    // Initialize by loading resumes
    useEffect(() => {
        loadResumes();
    }, [loadResumes]);

    return {
        // State
        ...state,

        // Actions
        saveResume,
        loadResume,
        updateResume,
        deleteResume,
        setCurrentResume,
        loadResumes,
        clearError
    };
};

export default useResumeManager;
