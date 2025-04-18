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

const SingleProductPage = ({ product, error }) => {
  const router = useRouter();
  const { id } = router.query;

  // Handle client-side transitions
  const [isLoading, setIsLoading] = useState(false);
  const [clientProduct, setClientProduct] = useState(product);

  useEffect(() => {
    if (!product && id) {
      setIsLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      console.log('Frontend Debug - Fetching product data:');
      console.log('API URL:', apiUrl);
      console.log('Product ID:', id);

      fetch(`${apiUrl}/api/products/${id}`)
        .then(res => {
          console.log('Frontend Debug - Response status:', res.status);
          return res.json();
        })
        .then(data => {
          console.log('Frontend Debug - Received data:', data);
          setClientProduct(data);
          setIsLoading(false);
        })
        .catch(err => {
          console.error('Frontend Debug - Error fetching product:', err);
          setIsLoading(false);
        });
    }
  }, [id, product]);

  // Debug logging for props and state
  useEffect(() => {
    console.log('Frontend Debug - Component props/state:');
    console.log('Product from props:', product);
    console.log('Client product state:', clientProduct);
    console.log('Is loading:', isLoading);
    console.log('Router query:', router.query);
  }, [product, clientProduct, isLoading, router.query]);

  if (router.isFallback || isLoading) {
    return (
      <PublicLayout>
        <div className="loading">Loading...</div>
      </PublicLayout>
    );
  }

  if (error) {
    return (
      <PublicLayout>
        <div className="error">Error: {error}</div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout breadcrumb={breadcrumbsData} breadcrumbTitle='Shop'>
      <ProductDetails product={clientProduct || product} />
    </PublicLayout>
  );
};

// This function gets called at build time
export async function getStaticPaths() {
  try {
    console.log('Frontend Debug - getStaticPaths:');
    // Return empty paths during build time
    return {
      paths: [],
      fallback: true // Enable incremental static regeneration
    };
  } catch (error) {
    console.error('Frontend Debug - getStaticPaths error:', error);
    return {
      paths: [],
      fallback: true
    };
  }
}

export async function getStaticProps({ params }) {
  console.log('Frontend Debug - getStaticProps:');
  console.log('Params:', params);

  if (!params?.id) {
    console.log('Frontend Debug - No ID provided');
    return {
      notFound: true
    };
  }

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    console.log('Frontend Debug - API URL:', apiUrl);
    
    const res = await fetch(`${apiUrl}/api/products/${params.id}`);
    console.log('Frontend Debug - Response status:', res.status);
    
    if (!res.ok) {
      throw new Error(`Failed to fetch product: ${res.statusText}`);
    }

    const product = await res.json();
    console.log('Frontend Debug - Received product data:', product);

    return {
      props: {
        product,
        error: null
      },
      revalidate: 60
    };
  } catch (error) {
    console.error('Frontend Debug - getStaticProps error:', error);
    return {
      props: {
        product: null,
        error: 'Failed to load product'
      },
      revalidate: 60
    };
  }
}

export default SingleProductPage;
