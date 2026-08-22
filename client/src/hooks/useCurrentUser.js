import { useCallback, useEffect, useState } from "react";
import { getCurrentUser } from "../services/userService";

const useCurrentUser = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadUser = useCallback(async () => {
        try {
            const response = await getCurrentUser();

            setUser(response.data);

            return response.data;
        } catch (error) {
            console.error("Failed to load user:", error);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadUser();

        const handleUserUpdated = () => {
            loadUser();
        };

        window.addEventListener("userUpdated", handleUserUpdated);

        return () => {
            window.removeEventListener(
                "userUpdated",
                handleUserUpdated
            );
        };
    }, [loadUser]);

    return {
        user,
        loading,
        refreshUser: loadUser,
    };
};

export default useCurrentUser;