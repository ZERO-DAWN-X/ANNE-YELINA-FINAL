import { useEffect, useState } from 'react';
import { Categories } from 'components/Category/Categories/Categories';
import { SectionTitle } from 'components/shared/SectionTitle/SectionTitle';
import { getCategories } from 'services/adminService';

export const TopCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex + itemsPerPage >= categories.length ? 0 : prevIndex + itemsPerPage
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex - itemsPerPage < 0 ? 
        Math.max(0, categories.length - itemsPerPage) : 
        prevIndex - itemsPerPage
    );
  };

  const visibleCategories = categories.slice(currentIndex, currentIndex + itemsPerPage);
  const hasMoreItems = categories.length > itemsPerPage;

  return (
    <section className='top-categories'>
      <SectionTitle
        subTitle='Curated Collections'
        title='Featured Categories' 
        body='Indulge in luxurious, pure skincare essentials. Discover irresistible offers on our premium beauty products.'
      />
      
      <div className='carousel-container'>
        {hasMoreItems && (
          <button 
            className='nav-button prev'
            onClick={prevSlide}
            aria-label="Previous categories"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        )}

        <div className='top-categories__items'>
          <Categories 
            categories={visibleCategories.map(category => ({
              ...category,
              image: category.image ? (
                category.image.startsWith('http') 
                  ? category.image 
                  : `${process.env.NEXT_PUBLIC_API_URL}${category.image}`
              ) : null
            }))} 
          />
        </div>

        {hasMoreItems && (
          <button 
            className='nav-button next'
            onClick={nextSlide}
            aria-label="Next categories"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        )}
      </div>

      {hasMoreItems && (
        <div className="pagination-dots">
          {Array.from({ length: Math.ceil(categories.length / itemsPerPage) }).map((_, index) => (
            <span 
              key={index}
              className={`dot ${index === Math.floor(currentIndex / itemsPerPage) ? 'active' : ''}`}
              onClick={() => setCurrentIndex(index * itemsPerPage)}
            />
          ))}
        </div>
      )}

      <style jsx>{`
        .top-categories {
          padding: 10;
        }

        .carousel-container {
          position: relative;
          padding: 0 50px;
        }

        .nav-button {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: white;
          border: none;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          cursor: pointer;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #333;
          transition: all 0.3s ease;
        }

        .nav-button:hover {
          background: #d05278;
          color: white;
          transform: translateY(-50%) scale(1.1);
        }

        .prev {
          left: 20px;
        }

        .next {
          right: 20px;
        }

        .pagination-dots {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-top: 16px;
        }

        .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #ddd;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .dot:hover {
          background: #999;
        }

        .dot.active {
          background: #d05278;
          transform: scale(1.2);
        }

        @media (max-width: 768px) {
          .carousel-container {
            padding: 0 10px;
          }

          .nav-button {
            width: 32px;
            height: 32px;
          }
        }

        @media (max-width: 480px) {
          .carousel-container {
            padding: 0 10px;
          }
        }
      `}</style>
    </section>
  );
};
