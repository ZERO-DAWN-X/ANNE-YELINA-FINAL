import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import useWindowSize from 'components/utils/windowSize/windowSize';
import { header } from 'data/data.header';
import Link from 'next/link';
import { useAuth } from 'context/AuthContext';
import { useContext, useEffect, useState } from 'react';
import { Nav } from './Nav/Nav';
import { useRouter } from 'next/router';
import { useCart } from 'context/CartContext';
import { useWishlist } from 'context/WishlistContext';

export const Header = ({ openMenu = false, setOpenMenu = () => {} }) => {
  const router = useRouter();
  const { cart } = useCart();
  const { user, logout } = useAuth();
  const { wishlist } = useWishlist();
  const [promo, setPromo] = useState(true);
  const [fixedNav, setFixedNav] = useState(false);
  const [height, width] = useWindowSize();
  const [mounted, setMounted] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // For Fixed nav
  useEffect(() => {
    window.addEventListener('scroll', isSticky);
    return () => {
      window.removeEventListener('scroll', isSticky);
    };
  });

  const isSticky = () => {
    const scrollTop = window.scrollY;
    if (scrollTop > 10) {
      setFixedNav(true);
    } else {
      setFixedNav(false);
    }
  };

  useEffect(() => {
    if (openMenu) {
      if (height < 767) {
        disableBodyScroll(document);
      } else {
        enableBodyScroll(document);
      }
    } else {
      enableBodyScroll(document);
    }
  }, [openMenu, height]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculate cart items count
  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);
  const wishlistItemsCount = wishlist?.length || 0;

  // Define navigation items with explicit URLs
  const navItems = [
    { name: 'Home', url: '/' },
    { name: 'Shop', url: '/shop' },
    { name: 'About', url: '/about' },
    { name: 'Contact', url: '/contact' },
  ];

  // Check if user exists and has role "ADMIN"
  const updatedNavItems = user && user.role === "ADMIN"
    ? [...navItems, { name: 'Admin', url: '/admin' }] 
    : navItems;

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <>
      {/* <!-- BEGIN HEADER --> */}
      <header className='header'>
        {promo && (
          <div className='header-top'>
            <span>30% OFF ON ALL PRODUCTS ENTER CODE: beshop2020</span>
            <i
              onClick={() => setPromo(false)}
              className='header-top-close js-header-top-close icon-close'
            ></i>
          </div>
        )}
        <div className={`header-content ${fixedNav ? 'fixed' : ''}`}>
          <div className='header-logo'>
            <Link href='/'>
              <a>
                <img src={header.logo} alt='anne yelina' />
              </a>
            </Link>
          </div>
          <div style={{ right: openMenu ? 0 : -360 }} className='header-box'>
            {/* Pass navItems directly to ensure URLs are defined */}
            <Nav navItem={updatedNavItems} />
            
            {/* header options */}
            <ul className='header-options'>
              <li>
                <Link href='/faq'>
                  <a>
                    <i className='icon-search'></i>
                  </a>
                </Link>
              </li>
              <li className="profile-menu-container">
                <button 
                  className="profile-button"
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                >
                  <i className='icon-user'></i>
                </button>
                
                {showProfileMenu && (
                  <div className="profile-dropdown">
                    {user ? (
                      <>
                        <Link href="/profile">
                          <a className="dropdown-item">
                            <i className="icon-user-circle"></i>
                            My Profile
                          </a>
                        </Link>
                        <button 
                          className="dropdown-item logout-button"
                          onClick={handleLogout}
                        >
                          <i className="icon-logout"></i>
                          Logout
                        </button>
                      </>
                    ) : (
                      <Link href="/login">
                        <a className="dropdown-item">
                          <i className="icon-login"></i>
                          Login
                        </a>
                      </Link>
                    )}
                  </div>
                )}
              </li>
              <li>
                <Link href='/wishlist'>
                  <a>
                    <i className='icon-heart'></i>
                    {mounted && wishlistItemsCount > 0 && (
                      <span>{wishlistItemsCount}</span>
                    )}
                  </a>
                </Link>
              </li>
              <li>
                <Link href='/cart'>
                  <a>
                    <i className='icon-cart'></i>
                    {mounted && cartItemsCount > 0 && (
                      <span>{cartItemsCount}</span>
                    )}
                  </a>
                </Link>
              </li>
            </ul>
          </div>

          <div
            onClick={() => setOpenMenu(!openMenu)}
            className={
              openMenu ? 'btn-menu js-btn-menu active' : 'btn-menu js-btn-menu'
            }
          >
            {[1, 2, 3].map((i) => (
              <span key={i}>&nbsp;</span>
            ))}
          </div>
        </div>

        <style jsx>{`
          .profile-menu-container {
            position: relative;
          }

          .profile-button {
            background: none;
            border: none;
            padding: 0;
            cursor: pointer;
            color: inherit;
          }

          .profile-dropdown {
            position: absolute;
            top: 100%;
            right: 0;
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            min-width: 180px;
            z-index: 1000;
            margin-top: 10px;
            padding: 8px 0;
          }

          .dropdown-item {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 12px 16px;
            color: #333;
            text-decoration: none;
            transition: background-color 0.3s;
            font-size: 14px;
          }

          .dropdown-item:hover {
            background-color: #f5f5f5;
            color: #d05278;
          }

          .logout-button {
            width: 100%;
            text-align: left;
            background: none;
            border: none;
            cursor: pointer;
            color: #e74c3c;
          }

          .logout-button:hover {
            background-color: #fff1f0;
          }
        `}</style>
      </header>

      {/* <!-- HEADER EOF   --> */}
    </>
  );
};
