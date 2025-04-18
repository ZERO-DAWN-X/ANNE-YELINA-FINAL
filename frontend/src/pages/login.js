import { Login } from 'components/Login/Login';
import { PublicLayout } from 'layout/PublicLayout';
import { PublicRoute } from 'components/utils/PublicRoute';
import Head from 'next/head';

const breadcrumbsData = [
  {
    label: 'Home',
    path: '/',
  },
  {
    label: 'Login',
    path: '/login',
  },
];

export default function LoginPage() {
  return (
    <PublicRoute>
      <Head>
        <title>Login - AnneYelina Beauty Store</title>
      </Head>
      <PublicLayout breadcrumb={breadcrumbsData} breadcrumbTitle='Login'>
        <Login />
      </PublicLayout>
    </PublicRoute>
  );
}
