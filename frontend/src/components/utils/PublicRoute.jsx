import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from 'context/AuthContext';

export const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If user is authenticated, redirect to home page
    if (!loading && isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, loading, router]);

  // Show loading while checking auth status
  if (loading) {
    return <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Loading...</p>
    </div>;
  }

  // Only render children if user is not authenticated
  return !isAuthenticated ? children : null;
}; 