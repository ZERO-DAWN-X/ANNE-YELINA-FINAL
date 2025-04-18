import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getCategories } from 'services/adminService';
import { SectionTitle } from 'components/shared/SectionTitle/SectionTitle';

export const FeaturedCategories = ({ categories }) => {
  return (
    <section className="featured-categories">
      <SectionTitle
        subTitle="Curated Collections"
        title="Featured Categories"
        body="Discover our complete range of beauty and skincare categories"
      />
      
      <div className="categories-grid">
        {categories.map((category) => (
          <Link 
            href={`/shop?category=${category.slug}`} 
            key={category.id}
          >
            <a className="category-card">
              <div className="category-image">
                <img 
                  src={category.image ? (
                    category.image.startsWith('http') 
                      ? category.image 
                      : `${process.env.NEXT_PUBLIC_API_URL}${category.image}`
                  ) : '/assets/img/placeholder.jpg'} 
                  alt={category.name}
                  onError={(e) => {
                    console.error(`Failed to load image for ${category.name}`);
                    e.target.src = '/assets/img/placeholder.jpg';
                  }}
                />
              </div>
              <div className="category-content">
                <h3 className="category-name">{category.name}</h3>
                <span className="category-link">
                  Browse Products
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </span>
              </div>
            </a>
          </Link>
        ))}
      </div>

      <style jsx>{`
        .featured-categories {
          padding: 60px 0;
          background: #fff;
        }

        .loading-state {
          text-align: center;
          padding: 40px;
          color: #666;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(208, 82, 120, 0.1);
          border-top-color: #d05278;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 16px;
        }

        .categories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 24px;
          margin-top: 40px;
        }

        .category-card {
          display: block;
          text-decoration: none;
          color: inherit;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          transition: transform 0.3s ease;
        }

        .category-card:hover {
          transform: translateY(-5px);
        }

        .category-image {
          position: relative;
          padding-bottom: 75%; /* 4:3 aspect ratio */
          background: #f5f5f5;
        }

        .category-image img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }

        .category-card:hover .category-image img {
          transform: scale(1.1);
        }

        .category-content {
          padding: 16px;
          background: white;
        }

        .category-name {
          margin: 0 0 8px;
          font-size: 18px;
          font-weight: 600;
          color: #333;
        }

        .category-link {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          color: #d05278;
          font-weight: 500;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 768px) {
          .categories-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
          }
        }

        @media (max-width: 480px) {
          .categories-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}; 