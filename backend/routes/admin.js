const express = require('express');
const prisma = require('../config/prisma');
const { verifyToken, verifyAdmin } = require('../middleware/auth');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prismaClient = new PrismaClient();
const { processImage, upload } = require('../middleware/upload');
const path = require('path');
const fs = require('fs');

// Protect all admin routes
router.use(verifyToken, verifyAdmin);

// Get all users with their order statistics
router.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        role: 'USER' // Only get regular users, not admins
      },
      include: {
        orders: {
          select: {
            id: true,
            totalAmount: true,
            status: true,
            createdAt: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Transform user data with calculated statistics
    const transformedUsers = users.map(user => {
      const completedOrders = user.orders.filter(order => order.status === 'COMPLETED');
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        orderCount: user.orders.length,
        totalSpent: completedOrders.reduce((sum, order) => sum + order.totalAmount, 0),
        lastOrderDate: user.orders.length > 0 
          ? user.orders[0].createdAt 
          : null
      };
    });

    res.json(transformedUsers);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

// Delete user
router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if user exists and has USER role
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      include: { orders: true }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (user.role !== 'USER') {
      return res.status(403).json({ message: 'Cannot delete admin accounts' });
    }
    
    // Check if user has orders
    if (user.orders.length > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete user with existing orders. Please delete the orders first or deactivate the account instead.' 
      });
    }
    
    await prisma.user.delete({
      where: { id: parseInt(id) }
    });
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all products
router.get('/products', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    res.json(products);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a single product
router.get('/products/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id }
    });
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new product
router.post('/products', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const {
      name,
      price,
      oldPrice,
      category,
      brand,
      description,
      content,
      image,
      imageGallery,
      filterItems,
      colors,
      isNew,
      isSale,
      isStocked,
      productNumber,
      categoryId,
      brandId
    } = req.body;

    console.log('Creating product with data:', req.body);
    
    // Validate required fields
    if (!name || !price || !description || !content) {
      return res.status(400).json({ 
        message: 'Missing required fields: name, price, description, and content are required' 
      });
    }

    // Convert price and oldPrice to Float
    const priceFloat = parseFloat(price);
    const oldPriceFloat = oldPrice ? parseFloat(oldPrice) : null;

    if (isNaN(priceFloat)) {
      return res.status(400).json({
        message: 'Invalid price format. Price must be a valid number'
      });
    }

    if (oldPrice && isNaN(oldPriceFloat)) {
      return res.status(400).json({
        message: 'Invalid old price format. Old price must be a valid number'
      });
    }

    // Create the product with proper category and brand relationships
    const product = await prisma.product.create({
      data: {
        name,
        price: priceFloat,
        oldPrice: oldPriceFloat,
        category: category || '',
        brand: brand || '',
        description,
        content,
        image: image || '',
        imageGallery: Array.isArray(imageGallery) ? imageGallery : [],
        filterItems: Array.isArray(filterItems) ? filterItems : [],
        colors: Array.isArray(colors) ? colors : [],
        isNew: Boolean(isNew),
        isSale: Boolean(isSale),
        isStocked: Boolean(isStocked),
        productNumber,
        // Handle relationships properly
        ...(categoryId ? {
          categoryRel: {
            connect: { id: String(categoryId) } // Ensure categoryId is a string
          }
        } : {}),
        ...(brandId ? {
          brandRel: {
            connect: { id: String(brandId) } // Ensure brandId is a string
          }
        } : {})
      },
      include: {
        categoryRel: true,
        brandRel: true
      }
    });

    // Transform response
    const transformedProduct = {
      ...product,
      category: product.categoryRel?.name || category || '',
      brand: product.brandRel?.name || brand || '',
      // Remove relation fields
      categoryRel: undefined,
      brandRel: undefined
    };
    
    res.status(201).json(transformedProduct);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ 
      message: 'Failed to create product',
      error: error.message 
    });
  }
});

// Update the image upload endpoint
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Get the file path relative to the uploads directory
    const relativePath = path.relative(
      path.join(__dirname, '../uploads'),
      req.file.path
    );

    // Construct the full URL for the uploaded image
    const imageUrl = `${process.env.NEXT_PUBLIC_API_URL}/uploads/${req.file.filename}`;
    
    res.json({ 
      url: imageUrl,
      path: `uploads/${req.file.filename}`,
      success: true 
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

router.delete('/image', async (req, res) => {
  const { imageUrl } = req.body;

  if (!imageUrl) {
    return res.status(400).json({ error: "Image URL is required" });
  }

  try {
    // Extract filename from imageUrl
    const filename = decodeURIComponent(imageUrl.split("/uploads/").pop());

     console.log(filename);

    if (!filename) {
      return res.status(400).json({ error: "Invalid image URL" });
    }

    const imagePath = path.join(__dirname, "../uploads", filename);

    console.log(imagePath);

    // Check if file exists and is within uploads directory
    if (
      !fs.existsSync(imagePath) ||
      !imagePath.startsWith(path.join(__dirname, "../uploads"))
    ) {
      return res.status(404).json({ error: "Image not found" });
    }

    // Delete the file
    fs.unlinkSync(imagePath);
    res.status(200).json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({ error: "Failed to delete image" });
  }
});



// Update a product
router.put('/products/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      price,
      oldPrice,
      category,
      brand,
      description,
      content,
      image,
      imageGallery,
      filterItems,
      colors,
      isNew,
      isSale,
      isStocked,
      productNumber
    } = req.body;
    
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name,
        price,
        oldPrice: oldPrice || null,
        category,
        brand,
        description,
        content,
        image,
        imageGallery: imageGallery || [],
        filterItems: filterItems || [],
        colors: colors || [],
        isNew: Boolean(isNew),
        isSale: Boolean(isSale),
        isStocked: Boolean(isStocked),
        productNumber
      }
    });
    
    res.json(updatedProduct);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a product
router.delete('/products/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.product.delete({
      where: { id }
    });
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all orders
router.get('/orders', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    res.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update order status
router.patch('/orders/:id/status', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    if (!['PENDING', 'COMPLETED', 'CANCELLED'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    res.json(updatedOrder);
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get dashboard statistics
router.get('/dashboard/stats', async (req, res) => {
  try {
    const [users, products, orders] = await Promise.all([
      prisma.user.count({ where: { role: 'USER' } }),
      prisma.product.count(),
      prisma.order.findMany()
    ]);

    const stats = {
      users: { total: users },
      products: { total: products },
      orders: {
        total: orders.length,
        pending: orders.filter(o => o.status === 'PENDING').length,
        completed: orders.filter(o => o.status === 'COMPLETED').length,
        cancelled: orders.filter(o => o.status === 'CANCELLED').length
      },
      revenue: {
        total: orders
          .filter(o => o.status === 'COMPLETED')
          .reduce((sum, order) => sum + order.totalAmount, 0)
      }
    };

    res.json(stats);
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard statistics' });
  }
});

// Get recent activity
router.get('/dashboard/activity', async (req, res) => {
  try {
    const [recentOrders, recentUsers, recentProducts] = await Promise.all([
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { user: true }
      }),
      prisma.user.findMany({
        take: 3,
        where: { role: 'USER' },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.product.findMany({
        take: 3,
        orderBy: { createdAt: 'desc' }
      })
    ]);

    // Combine and format activities
    const activities = [
      ...recentOrders.map(order => ({
        type: 'order',
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        userName: order.user?.name || 'Unknown',
        amount: order.totalAmount,
        date: order.createdAt
      })),
      ...recentUsers.map(user => ({
        type: 'user',
        id: user.id,
        name: user.name,
        date: user.createdAt
      })),
      ...recentProducts.map(product => ({
        type: 'product',
        id: product.id,
        name: product.name,
        date: product.createdAt
      }))
    ].sort((a, b) => b.date - a.date);

    res.json({
      recentOrders,
      activities: activities.slice(0, 8)
    });
  } catch (error) {
    console.error('Recent activity error:', error);
    res.status(500).json({ message: 'Failed to fetch recent activity' });
  }
});

// Get user orders
router.get('/users/:userId/orders', async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await prisma.order.findMany({
      where: { userId: parseInt(userId) },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    res.json(orders);
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({ message: 'Failed to fetch user orders' });
  }
});

// Get all categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: 'asc'
      }
    });
    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new category
router.post('/categories', upload.single('image'), async (req, res) => {
  try {
    const { name, slug } = req.body;
    let imageUrl = null;

    if (req.file) {
      // Log the file info for debugging
      console.log('Uploaded file:', req.file);
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        image: imageUrl
      }
    });

    // Return the complete category object
    res.status(201).json({
      ...category,
      image: imageUrl ? `${process.env.NEXT_PUBLIC_API_URL}${imageUrl}` : null
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ message: 'Failed to create category' });
  }
});

// Delete a category
router.delete('/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if category is used by any products
    const productsUsingCategory = await prisma.product.count({
      where: {
        categoryId: id
      }
    });
    
    if (productsUsingCategory > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete category that is used by products' 
      });
    }
    
    await prisma.category.delete({
      where: { id }
    });
    
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a category
router.put('/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, image } = req.body;
    
    // Check if a different category with the same slug already exists
    const existingCategory = await prisma.category.findFirst({
      where: { 
        slug,
        id: { not: id }
      }
    });
    
    if (existingCategory) {
      return res.status(400).json({ message: 'Category with this slug already exists' });
    }
    
    // Create update data object with all fields
    const updateData = {
      name,
      slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
      image: image || null // Ensure image is included and can be null
    };
    
    const updatedCategory = await prisma.category.update({
      where: { id },
      data: updateData
    });
    
    res.json(updatedCategory);
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ 
      message: 'Server error: ' + error.message,
      details: error.stack 
    });
  }
});

// Get all brands
router.get('/brands', async (req, res) => {
  try {
    const brands = await prisma.brand.findMany({
      orderBy: {
        name: 'asc'
      }
    });
    res.json(brands);
  } catch (error) {
    console.error('Get brands error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new brand
router.post('/brands', async (req, res) => {
  try {
    const { name, slug } = req.body;
    
    // Check if brand with same slug already exists
    const existingBrand = await prisma.brand.findUnique({
      where: { slug }
    });
    
    if (existingBrand) {
      return res.status(400).json({ message: 'Brand with this ID already exists' });
    }
    
    const brand = await prisma.brand.create({
      data: {
        name,
        slug
      }
    });
    
    res.status(201).json(brand);
  } catch (error) {
    console.error('Create brand error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a brand
router.delete('/brands/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if brand is used by any products
    const productsUsingBrand = await prisma.product.count({
      where: {
        brandId: id
      }
    });
    
    if (productsUsingBrand > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete brand that is used by products' 
      });
    }
    
    await prisma.brand.delete({
      where: { id }
    });
    
    res.json({ message: 'Brand deleted successfully' });
  } catch (error) {
    console.error('Delete brand error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a brand
router.put('/brands/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug } = req.body;
    
    // Check if a different brand with the same slug already exists
    const existingBrand = await prisma.brand.findFirst({
      where: { 
        slug,
        id: { not: id }
      }
    });
    
    if (existingBrand) {
      return res.status(400).json({ message: 'Brand with this ID already exists' });
    }
    
    const updatedBrand = await prisma.brand.update({
      where: { id },
      data: { name, slug }
    });
    
    res.json(updatedBrand);
  } catch (error) {
    console.error('Update brand error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 