import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from 'context/AuthContext';

export const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Check auth when component mounts
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  // Show loading if still determining auth status
  if (loading) {
    return <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Loading...</p>
    </div>;
  }

  // If authenticated, render children
  return isAuthenticated ? children : null;
}; 