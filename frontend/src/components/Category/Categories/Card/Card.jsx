import Link from 'next/link';

export const Card = ({ category }) => {
  const { name, image, slug } = category;
  
  // Fix the link to ensure proper query parameter formatting
  return (
    <Link href={`/shop?category=${encodeURIComponent(slug)}`} passHref>
      <a className='top-categories__item' aria-label={`Browse ${name} products`}>
        <img src={image} className='js-img' alt={name} />
        <div className='top-categories__item-hover'>
          <h5>{name}</h5>
          <span>browse products -</span>
          <i className='icon-arrow-lg'></i>
        </div>
      </a>
    </Link>
  );
};
