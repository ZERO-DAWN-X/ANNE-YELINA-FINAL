const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all products with filtering
router.get('/', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        isStocked: true
      },
      include: {
        categoryRel: {
          select: {
            id: true,
            name: true,
            slug: true,
            image: true
          }
        },
        brandRel: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    // Transform the response to match the expected format
    const transformedProducts = products.map(product => ({
      ...product,
      category: product.categoryRel ? {
        id: product.categoryRel.id,
        name: product.categoryRel.name,
        slug: product.categoryRel.slug,
        image: product.categoryRel.image
      } : null,
      brand: product.brandRel ? {
        id: product.brandRel.id,
        name: product.brandRel.name,
        slug: product.brandRel.slug
      } : null,
      // Remove the relation fields from the response
      categoryRel: undefined,
      brandRel: undefined
    }));
    
    res.json(transformedProducts);
  } catch (error) {
    console.error('Get products error:', error);
    console.error('Error details:', error.stack);
    res.status(500).json({ 
      message: 'Failed to fetch products',
      error: error.message 
    });
  }
});

// Get products by category
router.get('/category/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    
    const products = await prisma.product.findMany({
      where: {
        category: {
          slug: slug
        },
        isStocked: true
      },
      include: {
        category: true,
        brand: true
      }
    });
    
    res.json(products);
  } catch (error) {
    console.error('Get products by category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get products by brand
router.get('/brand/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    
    // Find the brand
    const brand = await prisma.brand.findUnique({
      where: { slug }
    });
    
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }
    
    // Get products for this brand
    const products = await prisma.product.findMany({
      where: {
        brand: slug,
        isStocked: true
      }
    });
    
    res.json(products);
  } catch (error) {
    console.error('Get products by brand error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get new arrivals
router.get('/new-arrivals', async (req, res) => {
  try {
    const newArrivals = await prisma.product.findMany({
      where: {
        isNew: true,
        isStocked: true // Only show in-stock items
      },
      orderBy: {
        createdAt: 'desc' // Show newest first
      }
    });
    
    res.json(newArrivals);
  } catch (error) {
    console.error('Get new arrivals error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get sale products
router.get('/sale', async (req, res) => {
  try {
    const saleProducts = await prisma.product.findMany({
      where: {
        isSale: true,
        isStocked: true // Only show in-stock items
      }
    });
    
    res.json(saleProducts);
  } catch (error) {
    console.error('Get sale products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single product by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        categoryRel: {
          select: {
            id: true,
            name: true,
            slug: true,
            image: true
          }
        },
        brandRel: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      }
    });
    
    if (!product) {
      return res.status(404).json({ 
        message: `Product with ID ${id} not found` 
      });
    }
    
    // Transform the response to match the expected format
    const transformedProduct = {
      ...product,
      // Use the name from relations, fallback to original strings
      category: product.categoryRel ? product.categoryRel.name : product.category,
      brand: product.brandRel ? product.brandRel.name : product.brand,
      // Add these as separate properties if needed
      categoryData: product.categoryRel ? {
        id: product.categoryRel.id,
        name: product.categoryRel.name,
        slug: product.categoryRel.slug,
        image: product.categoryRel.image
      } : null,
      brandData: product.brandRel ? {
        id: product.brandRel.id,
        name: product.brandRel.name,
        slug: product.brandRel.slug
      } : null,
      // Remove relation fields
      categoryRel: undefined,
      brandRel: undefined
    };
    
    res.json(transformedProduct);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch product',
      error: error.message 
    });
  }
});

module.exports = router; 