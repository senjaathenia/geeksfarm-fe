import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const useAuth = () => {
    const [userRole, setUserRole] = useState(null);
    const router = useRouter();

    useEffect(() => {
        // Assuming you store the role in localStorage or get it from a server
        const role = localStorage.getItem('userRole'); // Or use an API call to get the role
        setUserRole(role);

        if (!role) {
            router.push('/login'); // Redirect to login if no role is found
        }
    }, [router]);

    return userRole;
};

export default useAuth;
