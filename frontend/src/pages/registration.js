import { Registration } from 'components/Registration/Registration';
import { PublicLayout } from 'layout/PublicLayout';
import { PublicRoute } from 'components/utils/PublicRoute';
import Head from 'next/head';

const breadcrumbsData = [
  {
    label: 'Home',
    path: '/',
  },
  {
    label: 'Registration',
    path: '/registration',
  },
];

export default function RegistrationPage() {
  return (
    <PublicRoute>
      <Head>
        <title>Register - AnneYelina Beauty Store</title>
      </Head>
      <PublicLayout breadcrumb={breadcrumbsData} breadcrumbTitle='Registration'>
        <Registration />
      </PublicLayout>
    </PublicRoute>
  );
}
