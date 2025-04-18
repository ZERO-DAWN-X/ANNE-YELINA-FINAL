import { MostViewed } from 'components/shared/MostViewed/MostViewed';
import { ProductDetails } from 'components/Product/ProductDetails/ProductDetails';
import { PublicLayout } from 'layout/PublicLayout';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const breadcrumbsData = [
  {
    label: 'Home',
    path: '/',
  },
  {
    label: 'Shop',
    path: '/shop',
  },
  {
    label: 'Product',
    path: '/product',
  },
];

const ProductPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to shop page if no product ID is specified
    router.replace('/shop');
  }, []);

  return (
    <PublicLayout breadcrumb={breadcrumbsData} breadcrumbTitle='Shop'>
      <div>Redirecting to shop...</div>
    </PublicLayout>
  );
};

export async function getStaticProps() {
  return {
    props: {},
    revalidate: 60
  };
}

export default ProductPage;
