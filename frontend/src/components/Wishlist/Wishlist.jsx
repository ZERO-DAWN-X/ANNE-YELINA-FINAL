import { Card } from './Card/Card';
import Link from 'next/link';
import { useWishlist } from 'context/WishlistContext';

export const Wishlist = () => {
  const { wishlist, clearWishlist } = useWishlist();

  return (
    <>
      {/* <!-- BEGIN WISHLIST --> */}
      <div className='wishlist'>
        <div className='wrapper'>
          <div className='cart-table'>
            <div className='cart-table__box'>
              <div className='cart-table__row cart-table__row-head'>
                <div className='cart-table__col'>Product</div>
                <div className='cart-table__col'>Price</div>
                <div className='cart-table__col'>Status</div>
                <div className='cart-table__col'>Add to cart</div>
              </div>

              {wishlist.map((wish) => (
                <Card key={wish.id} wish={wish} />
              ))}
            </div>
          </div>
          <div className='wishlist-buttons'>
            <button 
              className='btn btn-grey'
              onClick={clearWishlist}
            >
              Clear Wishlist
            </button>
            <Link href='/shop'>
              <a className='btn'>Go Shopping</a>
            </Link>
          </div>
        </div>
        <img
          className='promo-video__decor js-img'
          data-src='/assets/img/promo-video__decor.jpg'
          alt=''
        />
      </div>
      {/* <!-- WISHLIST EOF   --> */}
    </>
  );
};
