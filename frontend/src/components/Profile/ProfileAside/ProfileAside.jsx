import Link from 'next/link';
import productData from 'data/product/product';
import { useAuth } from 'context/AuthContext';

export const ProfileAside = () => {
  const { user, logout } = useAuth();
  const recentlyViewed = [...productData].slice(0, 3);
  return (
    <>
      <div className='profile-aside'>
        <div className='profile-aside__info'>
          <img src='/assets/img/comment-author1.jpg' className='js-img' alt='' />
          <div className='profile-aside__info-name'>
            <span>Hello</span>
            <h5>{user?.name || 'User'}</h5>
          </div>
        </div>
        <ul className='profile-aside__list'>
          <li>
            <a href='#' className='active'>
              <i className='icon-user'></i>
              <span>Personal Information</span>
            </a>
          </li>
          <li>
            <a href='#'>
              <i className='icon-heart'></i>
              <span>My Favourites</span>
            </a>
          </li>
          <li>
            <a href='#'>
              <i className='icon-cart'></i>
              <span>My Orders</span>
            </a>
          </li>
          <li>
            <a href='#'>
              <i className='icon-cart'></i>
              <span>My Address</span>
            </a>
          </li>
          <li>
            <a href='#' onClick={(e) => { e.preventDefault(); logout(); }}>
              <i className='icon-close'></i>
              <span>Log out</span>
            </a>
          </li>
        </ul>
        <div className='profile-aside__subscribe'>
          <h3>Stay in touch</h3>
          <div className='box-field'>
            <input
              type='email'
              className='form-control'
              placeholder='Enter your email'
            />
          </div>
          <button type='submit' className='btn'>
            subscribe
          </button>
          <img
            src='/assets/img/subscribe-img-decor-sm.png'
            className='js-img'
            alt=''
          />
        </div>
        <div className='profile-aside__viewed'>
          <h5>You have viewed</h5>
          {recentlyViewed.map((product) => (
            <div key={product.id} className='profile-aside__viewed-item'>
              <Link href={`/product/${product.id}`}>
                <a className='profile-aside__viewed-item-img'>
                  <img src={product.image} className='js-img' alt='' />
                </a>
              </Link>
              <div className='profile-aside__viewed-item-info'>
                <Link href={`/product/${product.id}`}>
                  <a className='profile-aside__viewed-item-title'>
                    {product.name}
                  </a>
                </Link>
                <span className='profile-aside__viewed-item-price'>
                  ${product.price}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div
          className='profile-aside__discount js-img'
          style={{ backgroundImage: `url('/assets/img/discount-bg-sm.jpg')` }}
        >
          <div className='profile-aside__discount-title'>
            Get Your
            <br />
            <span>50%</span> Off
          </div>
          <Link href='/shop'>
            <a className='btn'>
              get now!
            </a>
          </Link>
        </div>
      </div>
    </>
  );
};
