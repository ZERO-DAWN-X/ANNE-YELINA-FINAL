import { PublicLayout } from 'layout/PublicLayout';

const breadcrumbsData = [
  {
    label: 'Home',
    path: '/',
  },
  {
    label: 'About',
    path: '/about',
  },
];

const AboutPage = () => {
  return (
    <PublicLayout breadcrumb={breadcrumbsData} breadcrumbTitle='About Us'>
      <div className='about-page'>
        <div className='wrapper'>
          <div className='about-content'>
            <h1>About Anne Yelina</h1>
            
            <div className='about-section'>
              <h2>Our Story</h2>
              <p>
                Founded in 2020, Anne Yelina is a premium beauty and skincare brand 
                committed to creating luxurious, effective products using only the 
                finest ingredients. Our journey began with a simple belief: everyone 
                deserves skincare that truly works.
              </p>
            </div>
            
            <div className='about-section'>
              <h2>Our Mission</h2>
              <p>
                At Anne Yelina, our mission is to empower individuals to feel confident 
                in their own skin. We combine cutting-edge research with natural ingredients 
                to create products that deliver real results, all while maintaining our 
                commitment to sustainability and ethical practices.
              </p>
            </div>
            
            <div className='about-section'>
              <h2>Our Values</h2>
              <ul>
                <li><strong>Quality:</strong> We never compromise on the quality of our ingredients or formulations.</li>
                <li><strong>Transparency:</strong> We believe in being honest about what goes into our products.</li>
                <li><strong>Sustainability:</strong> We're committed to minimizing our environmental impact.</li>
                <li><strong>Inclusivity:</strong> Our products are designed for all skin types and tones.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .about-page {
          padding: 60px 0;
        }
        
        .about-content {
          max-width: 800px;
          margin: 0 auto;
        }
        
        h1 {
          font-size: 36px;
          margin-bottom: 40px;
          text-align: center;
          color: #333;
        }
        
        .about-section {
          margin-bottom: 40px;
        }
        
        h2 {
          font-size: 24px;
          margin-bottom: 20px;
          color: #d05278;
        }
        
        p {
          font-size: 16px;
          line-height: 1.8;
          color: #666;
          margin-bottom: 20px;
        }
        
        ul {
          padding-left: 20px;
        }
        
        li {
          font-size: 16px;
          line-height: 1.8;
          color: #666;
          margin-bottom: 10px;
        }
      `}</style>
    </PublicLayout>
  );
};

export default AboutPage;
