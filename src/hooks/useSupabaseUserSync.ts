import { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useSupabase } from './useSupabase';

/**
 * Hook to automatically sync user profile with Supabase when user signs in
 * This ensures user data is available in the database for RLS policies
 */
export const useSupabaseUserSync = () => {
    const { user, isSignedIn } = useUser();
    const supabase = useSupabase();
    const [synced, setSynced] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Reset sync status when the user changes or signs out
    useEffect(() => {
        if (!isSignedIn) {
            setSynced(false);
        }
    }, [isSignedIn, user?.id]);

    useEffect(() => {
        const syncUserProfile = async () => {
            if (!isSignedIn || !user || synced) return;

            try {
                await supabase.syncUserProfile({
                    email: user.emailAddresses[0]?.emailAddress || '',
                    firstName: user.firstName || undefined,
                    lastName: user.lastName || undefined,
                });
                setSynced(true);
                setError(null);
            } catch (err) {
                console.error('Failed to sync user profile:', err);
                setError(err instanceof Error ? err.message : 'Failed to sync user profile');
            }
        };

        syncUserProfile();
    }, [isSignedIn, user, supabase, synced]);

    return { synced, error };
};

export default useSupabaseUserSync;
