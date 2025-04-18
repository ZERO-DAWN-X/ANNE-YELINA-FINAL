const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function seedProducts() {
  console.log('Seeding products...');
  
  // Get all categories and brands to reference them
  const categories = await prisma.category.findMany();
  const brands = await prisma.brand.findMany();
  
  // Create a lookup map for easier reference
  const categoryMap = new Map(categories.map(cat => [cat.slug, cat.id]));
  const brandMap = new Map(brands.map(brand => [brand.slug, brand.id]));
  
  // Read product data from JSON file
  try {
    const productData = JSON.parse(
      fs.readFileSync(
        path.join(__dirname, '../../src/data/product/product.json'),
        'utf-8'
      )
    );

    console.log(`Found ${productData.length} products in JSON file.`);

    // Delete existing products
    await prisma.product.deleteMany({});
    console.log('Deleted existing products');

    // Insert products from JSON file
    const products = [];
    for (const product of productData) {
      // Find the matching category and brand IDs
      const categoryId = categoryMap.get(product.category) || null;
      const brandId = brandMap.get(product.brand) || null;
      
      const result = await prisma.product.create({
        data: {
          id: product.id,
          name: product.name,
          price: product.price,
          oldPrice: product.oldPrice || null,
          category: product.category,
          brand: product.brand,
          description: product.description || '',
          content: product.content || '',
          image: product.image,
          imageGallery: product.imageGallery,
          filterItems: product.filterItems,
          colors: product.colors || null,
          isNew: product.isNew || false,
          isSale: product.isSale || false,
          isStocked: product.isStocked || true,
          productNumber: product.productNumber || `IN${Math.floor(1000 + Math.random() * 9000)}`,
          // Add the relations to category and brand
          categoryId: categoryId,
          brandId: brandId
        }
      });
      products.push(result);
      console.log(`Created product: ${result.name} (Category: ${product.category}, Brand: ${product.brand})`);
    }

    console.log(`Seeded ${products.length} products`);
  } catch (error) {
    console.error('Error reading or processing product data:', error);
  }
}

async function seedCategoriesAndBrands() {
  console.log('Seeding categories and brands...');
  
  // Clear existing data
  await prisma.category.deleteMany({});
  await prisma.brand.deleteMany({});
  
  // Seed categories
  const categories = [
    { name: 'Skincare', slug: 'skincare' },
    { name: 'Makeup', slug: 'makeup' },
    { name: 'Haircare', slug: 'haircare' },
    { name: 'Fragrance', slug: 'fragrance' },
    { name: 'Bath & Body', slug: 'bath' },
    { name: 'Tools & Accessories', slug: 'tools' },
    { name: 'Gift Sets', slug: 'sets' }
  ];
  
  for (const category of categories) {
    await prisma.category.create({
      data: category
    });
  }
  
  console.log(`✓ Created ${categories.length} categories`);
  
  // Seed brands
  const brands = [
    { name: 'The Ordinary', slug: 'theordinary' },
    { name: 'CeraVe', slug: 'cerave' },
    { name: 'L\'Oréal Paris', slug: 'lorealparis' },
    { name: 'Garnier', slug: 'garnier' },
    { name: 'La Roche-Posay', slug: 'laroshepoche' },
    { name: 'Cetaphil', slug: 'cetaphil' }
  ];
  
  for (const brand of brands) {
    await prisma.brand.create({
      data: brand
    });
  }
  
  console.log(`✓ Created ${brands.length} brands`);
}

async function main() {
  try {
    // First seed categories and brands
    await seedCategoriesAndBrands();
    
    // Then seed products (which require categories and brands to exist)
    await seedProducts();
    
    console.log('✓ Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 