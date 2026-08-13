import { useEffect, useState } from "react";
import { getCurrentUser } from "../services/userService";

const useCurrentUser = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const response = await getCurrentUser();
                setUser(response.data);
            } catch (error) {
                console.error("Failed to load user:", error);
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, []);

    return {
        user,
        loading,
    };
};

export default useCurrentUser;