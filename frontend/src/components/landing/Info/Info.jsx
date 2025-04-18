import Link from 'next/link';

export const Info = () => {
  return (
    <>
      {/* <!-- BEGIN INFO BLOCKS --> */}
      <div className='info-blocks'>
        <div className='info-block__container'>
          <div
            className='info-block__item'
            style={{ 
              backgroundImage: `linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.1)), url('/assets/img/info-item-bg1.jpg')` 
            }}
          >
            <div className='info-block__content'>
              <div className='info-block__image-container'>
                <div className='info-block__image-wrapper'>
                  <img
                    src='/assets/images/image_fx (69).jpg'
                    alt='New collection'
                    className='info-block__image'
                  />
                </div>
              </div>
              
              <div className='info-block__text'>
                <span className='info-block__subtitle'>Check This Out</span>
                <h2 className='info-block__title'>New Collection for Delicate Skin</h2>
                <p className='info-block__highlight'>
                  Nourish your skin with toxin-free cosmetic products. With the
                  offers that you can't refuse.
                </p>
                <p className='info-block__description'>
                  Non aliqua reprehenderit reprehenderit culpa laboris nulla minim
                  anim velit adipisicing ea aliqua alluptate sit do do. Non aliqua
                  reprehenderit reprehenderit culpa laboris nulla minim anim velit
                  adipisicing ea aliqua alluptate sit do do.
                </p>
                <Link href='/shop'>
                  <a className='info-block__button'>
                    Shop now
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </a>
                </Link>
              </div>
            </div>
          </div>
          
          <div
            className='info-block__item info-block__item--reverse'
            style={{ 
              backgroundImage: `linear-gradient(rgba(0,0,0,0.05), rgba(0,0,0,0.05)), url('/assets/img/info-item-bg2.jpg')` 
            }}
          >
            <div className='info-block__content'>
              <div className='info-block__image-container'>
                <div className='info-block__image-wrapper'>
                  <img
                    src='/assets/img/info-item-img2.jpg'
                    alt='About us'
                    className='info-block__image'
                  />
                </div>
              </div>
              
              <div className='info-block__text'>
                <span className='info-block__subtitle'>About Us</span>
                <h2 className='info-block__title'>Who We Are</h2>
                <p className='info-block__highlight'>
                  Nourish your skin with toxin-free cosmetic products. With the
                  offers that you can't refuse.
                </p>
                <p className='info-block__description'>
                  Non aliqua reprehenderit reprehenderit culpa laboris nulla minim
                  anim velit adipisicing ea aliqua alluptate sit do do. Non aliqua
                  reprehenderit reprehenderit culpa laboris nulla minim anim velit
                  adipisicing ea aliqua alluptate.
                </p>
                <Link href='/about'>
                  <a className='info-block__button'>
                    Learn more
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- INFO BLOCKS EOF   --> */}
      
      <style jsx>{`
        .info-blocks {
          padding: 60px 0;
          background-color: #fafafa;
        }
        
        .info-block__container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 10px;
        }
        
        .info-block__item {
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 50px;
          background-size: cover;
          background-position: center;
          box-shadow: 0 5px 25px rgba(0,0,0,0.08);
        }
        
        .info-block__item:last-child {
          margin-bottom: 0;
        }
        
        .info-block__content {
          display: flex;
          padding: 0;
        }
        
        .info-block__item--reverse .info-block__content {
          flex-direction: row-reverse;
        }
        
        .info-block__image-container {
          width: 40%;
          padding: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .info-block__image-wrapper {
          width: 100%;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 15px 40px rgba(0,0,0,0.2);
          transition: transform 0.5s ease;
        }
        
        .info-block__image-wrapper:hover {
          transform: translateY(-10px);
        }
        
        .info-block__image {
          width: 100%;
          height: auto;
          display: block;
        }
        
        .info-block__text {
          width: 60%;
          padding: 60px;
          background-color: rgba(255, 255, 255, 0.95);
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        
        .info-block__subtitle {
          display: inline-block;
          color: #d05278;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 2px;
          font-weight: 600;
          margin-bottom: 15px;
        }
        
        .info-block__title {
          font-size: 32px;
          line-height: 1.3;
          margin-bottom: 20px;
          color: #222;
          text-transform: capitalize;
        }
        
        .info-block__highlight {
          font-size: 18px;
          line-height: 1.6;
          color: #444;
          margin-bottom: 20px;
          font-weight: 500;
        }
        
        .info-block__description {
          font-size: 15px;
          line-height: 1.7;
          color: #666;
          margin-bottom: 30px;
        }
        
        .info-block__button {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background-color: #d05278;
          color: white;
          padding: 12px 25px;
          border-radius: 30px;
          text-decoration: none;
          font-weight: 600;
          font-size: 15px;
          transition: all 0.3s ease;
          align-self: flex-start;
          box-shadow: 0 5px 15px rgba(208, 82, 120, 0.3);
        }
        
        .info-block__button:hover {
          background-color: #ba3a5f;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(208, 82, 120, 0.4);
        }
        
        @media (max-width: 992px) {
          .info-block__content {
            flex-direction: column;
          }
          
          .info-block__item--reverse .info-block__content {
            flex-direction: column;
          }
          
          .info-block__image-container {
            width: 100%;
            padding: 40px 40px 0;
          }
          
          .info-block__text {
            width: 100%;
            padding: 40px;
          }
          
          .info-block__title {
            font-size: 28px;
          }
        }
        
        @media (max-width: 768px) {
          .info-blocks {
            padding: 40px 0;
          }
          
          .info-block__image-container {
            padding: 30px 30px 0;
          }
          
          .info-block__text {
            padding: 30px;
          }
          
          .info-block__title {
            font-size: 24px;
          }
          
          .info-block__highlight {
            font-size: 16px;
          }
        }
        
        @media (max-width: 480px) {
          .info-block__image-container {
            padding: 20px 20px 0;
          }
          
          .info-block__text {
            padding: 20px;
          }
          
          .info-block__title {
            font-size: 22px;
          }
        }
      `}</style>
    </>
  );
};
