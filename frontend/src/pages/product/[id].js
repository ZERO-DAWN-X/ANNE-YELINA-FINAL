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
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`)
        .then(res => res.json())
        .then(data => {
          setClientProduct(data);
          setIsLoading(false);
        })
        .catch(err => {
          console.error('Error fetching product:', err);
          setIsLoading(false);
        });
    }
  }, [id, product]);

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
    // Fetch the first few products for initial static generation
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const res = await fetch(`${apiUrl}/api/products`);
    const products = await res.json();
    
    // Get the first 5 products for static generation
    const paths = products.slice(0, 5).map((product) => ({
      params: { id: product.id.toString() }
    }));

    return {
      paths,
      fallback: true // Enable incremental static regeneration
    };
  } catch (error) {
    console.error('Error fetching products for static paths:', error);
    return {
      paths: [],
      fallback: true
    };
  }
}

// This function gets called at build time on server-side
export async function getStaticProps({ params }) {
  if (!params?.id) {
    return {
      notFound: true
    };
  }

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const res = await fetch(`${apiUrl}/api/products/${params.id}`);
    
    if (!res.ok) {
      throw new Error(`Failed to fetch product: ${res.statusText}`);
    }

    const product = await res.json();

    return {
      props: {
        product,
        error: null
      },
      revalidate: 60 // Regenerate page every 60 seconds if needed
    };
  } catch (error) {
    console.error('Error in getStaticProps:', error);
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
