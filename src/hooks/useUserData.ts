import { useUser, useAuth } from '@clerk/clerk-react';

/**
 * Custom hook to get user data for backend API calls
 * Returns the Clerk user ID and other relevant user information
 */
export const useUserData = () => {
    const { user, isSignedIn, isLoaded } = useUser();

    return {
        userId: user?.id || null,
        email: user?.emailAddresses[0]?.emailAddress || null,
        firstName: user?.firstName || null,
        lastName: user?.lastName || null,
        fullName: user?.fullName || null,
        profileImageUrl: user?.imageUrl || null,
        isSignedIn,
        isLoaded,
        user
    };
};

/**
 * Custom hook to get authorization headers for API calls
 * Use this hook in components when making requests to your backend
 */
export const useAuthHeaders = () => {
    const { getToken } = useAuth();

    const getAuthHeaders = async () => {
        try {
            const token = await getToken();

            if (!token) {
                throw new Error('User not authenticated');
            }

            return {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            };
        } catch (error) {
            console.error('Error getting auth headers:', error);
            throw error;
        }
    };

    return { getAuthHeaders };
};

export default useUserData;
