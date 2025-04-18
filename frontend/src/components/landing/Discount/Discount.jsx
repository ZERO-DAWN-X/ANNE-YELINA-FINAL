import Link from 'next/link';

export const Discount = () => {
  return (
    <>
      {/* <!-- BEGIN DISCOUNT --> */}
      <div
        className='discount js-img'
        style={{ backgroundImage: `url('/assets/images/3.jpg')` }}
      >
        <div className='wrapper'>
          <div className='discount-info' style={{ backgroundColor: 'rgba(255,255,255,0.8)', padding: '30px', borderRadius: '8px' }}>
            <span className='saint-text'>Discount</span>
            <span className='main-text'>
              Get Your <span>50%</span> Off
            </span>
            <p>
              Nourish your skin with toxin-free cosmetic products. With the
              offers that you can't refuse.
            </p>

            <Link href='/shop'>
              <a className='btn'>get now!</a>
            </Link>
          </div>
        </div>
      </div>
      {/* <!-- DISCOUNT EOF   --> */}
    </>
  );
};
