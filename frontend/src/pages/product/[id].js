import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ProductDetails } from 'components/Product/ProductDetails/ProductDetails';
import { PublicLayout } from 'layout/PublicLayout';

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

const SingleProductPage = () => {
  const router = useRouter();
  const { id } = router.query;

  if (!id) {
    return <div>Loading...</div>;
  }

  return (
    <PublicLayout breadcrumb={breadcrumbsData} breadcrumbTitle='Shop'>
      <ProductDetails />
    </PublicLayout>
  );
};

export default SingleProductPage;
