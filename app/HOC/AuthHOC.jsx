import { useRouter } from 'next/router';
import { useAuth } from './authContext';

const withAuth = (WrappedComponent) => {
  return (props) => {
    const { user } = useAuth();
    const router = useRouter();

    // Jika pengguna belum login, arahkan ke halaman login
    if (!user) {
      router.push('/login');
      return null; // Jangan render apa-apa sementara redirect
    }

    // Jika pengguna sudah login, render komponen yang dibungkus
    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
