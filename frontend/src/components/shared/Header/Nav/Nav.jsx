import useWindowSize from 'components/utils/windowSize/windowSize';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export const Nav = ({ navItem }) => {
  const router = useRouter();
  const [sub, setSub] = useState(false);
  const [height, width] = useWindowSize();

  useEffect(() => {
    if (height > 768) {
      setSub(false);
    }
  }, [height]);

  // Add a safeguard check
  if (!navItem || !Array.isArray(navItem)) {
    console.error("Navigation items are not properly defined:", navItem);
    return null;
  }

  return (
    <ul className='header-nav'>
      {navItem.map((item, index) => (
        <li key={item.url || index}>
          {/* Ensure the URL exists before creating the Link */}
          {item.url ? (
            <Link href={item.url}>
              <a
                className={
                  router.pathname === item.url || 
                  router.asPath === item.url ? 'active' : ''
                }
              >
                {item.name}
              </a>
            </Link>
          ) : (
            <span>{item.name}</span> // Fallback if URL is missing
          )}
          {item.subNav && (
            <ul className={sub ? 'active' : ''}>
              {item.subNav.map((sub) => (
                <li key={sub.path}>
                  <Link href={sub.path}>
                    <a>{sub.name}</a>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
};
