import { PrivateRoute } from 'components/utils/PrivateRoute';
import { Profile } from 'components/Profile/Profile';
import { PublicLayout } from 'layout/PublicLayout';
import { useAuth } from 'context/AuthContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

const breadcrumbsData = [
  {
    label: 'Home',
    path: '/',
  },
  {
    label: 'My Profile',
    path: '/profile',
  },
];

export default function ProfilePage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [pageLoading, setPageLoading] = useState(true);
  
  useEffect(() => {
    // If user is not authenticated and we've finished loading auth state, redirect to login
    if (!loading && !isAuthenticated) {
      router.push('/login');
    } else if (!loading) {
      // Simulate page loading for smoother transition
      setTimeout(() => {
        setPageLoading(false);
      }, 300);
    }
  }, [isAuthenticated, loading, router]);
  
  // Meta data for the profile page
  const metaData = {
    title: 'My Profile - AnneYelina Beauty Store',
    description: 'Manage your account details, orders, and shipping information in your AnneYelina profile',
    keywords: 'profile, account, beauty store, orders, shipping address',
  };
  
  // Show loading indicator while checking auth state
  if (loading || pageLoading) {
    return (
      <>
        <Head>
          <title>{metaData.title}</title>
          <meta name="description" content={metaData.description} />
          <meta name="keywords" content={metaData.keywords} />
        </Head>
        <PublicLayout>
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading your profile information...</p>
          </div>
        </PublicLayout>
      </>
    );
  }
  
  // Only render the profile component if user is authenticated
  return (
    <PrivateRoute>
      <Head>
        <title>{metaData.title}</title>
        <meta name="description" content={metaData.description} />
        <meta name="keywords" content={metaData.keywords} />
      </Head>
      <PublicLayout 
        breadcrumb={breadcrumbsData} 
        breadcrumbTitle='My Profile' 
        description='Manage your account details and order history'
      >
        <Profile />
      </PublicLayout>
    </PrivateRoute>
  );
}
