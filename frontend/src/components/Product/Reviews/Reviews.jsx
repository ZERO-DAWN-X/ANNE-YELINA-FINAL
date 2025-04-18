import { Card } from './Card/Card';

export const Reviews = ({ reviews = [] }) => {
  if (!reviews || reviews.length === 0) {
    return (
      <div className='product-detail__items'>
        <p>No reviews yet. Be the first to review this product!</p>
      </div>
    );
  }

  return (
    <>
      {/* <!-- BEING REVIEWS    --> */}
      <div className='product-detail__items'>
        {reviews.slice(0, 3).map((review, index) => (
          <Card key={index} review={review} />
        ))}
        {reviews.length > 3 && (
          <a href='#' className='blog-item__link'>
            Show more reviews
          </a>
        )}
      </div>
      {/* <!-- REVIEWS EOF   --> */}
    </>
  );
};
