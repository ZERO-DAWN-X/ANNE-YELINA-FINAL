import { Breadcrumb } from 'components/shared/Breadcrumb/Breadcrumb';
import { Layout } from './Layout';
import { Header } from 'components/shared/Header/Header';
import { Footer } from 'components/shared/Footer/Footer';
import { useState } from 'react';

export const PublicLayout = ({
  children,
  breadcrumb,
  breadcrumbTitle,
  description,
}) => {
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <>
      <Header 
        openMenu={openMenu} 
        setOpenMenu={setOpenMenu} 
      />
      <main className='content'>
        {breadcrumb && (
          <Breadcrumb
            breadcrumb={breadcrumb}
            title={breadcrumbTitle}
            description={description}
          />
        )}
        {children}
      </main>
      <Footer />
    </>
  );
};
