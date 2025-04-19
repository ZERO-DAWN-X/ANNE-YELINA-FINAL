const getImageUrl = (imagePath) => {
  if (!imagePath) return '/placeholder.jpg';
  
  // Remove blob URLs
  if (imagePath.startsWith('blob:')) {
    return '/placeholder.jpg';
  }
  
  // Handle relative paths
  if (imagePath.startsWith('/uploads/')) {
    return `${process.env.NEXT_PUBLIC_UPLOAD_URL}${imagePath}`;
  }
  
  // Handle full URLs
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // Handle other cases
  return `${process.env.NEXT_PUBLIC_UPLOAD_URL}/${imagePath}`;
};

<Image
  src={getImageUrl(product.image)}
  alt={product.name}
  width={600}
  height={600}
  style={styles.mainImage}
  onError={(e) => {
    console.log('Debug - Image load error:', e);
    e.target.src = '/placeholder.jpg';
  }}
/> 