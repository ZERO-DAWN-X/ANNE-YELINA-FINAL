import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from 'context/AuthContext';

export const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!isAuthenticated || !isAdmin())) {
      router.push('/');
    }
  }, [isAuthenticated, isAdmin, loading, router]);

  if (loading) {
    return <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Loading...</p>
    </div>;
  }

  return isAuthenticated && isAdmin() ? children : null;
}; 