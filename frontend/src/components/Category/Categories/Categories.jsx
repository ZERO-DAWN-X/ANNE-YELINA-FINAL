import { Card } from './Card/Card';

export const Categories = ({ categories }) => {
  return (
    <>
      {/* <!-- BEGIN  CATEGORIES --> */}
      {categories.map((category) => (
        <Card key={category.id} category={category}>
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
        </Card>
      ))}
      {/* <!--  CATEGORIES EOF   --> */}
    </>
  );
};
