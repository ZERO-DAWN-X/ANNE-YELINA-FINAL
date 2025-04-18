const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { upload } = require('../middleware/upload');
const prisma = require('../config/prisma');

// Create order with payment proof
router.post('/', verifyToken, upload.single('paymentProof'), async (req, res) => {
  try {
    const { items, shippingInfo, totalAmount } = req.body;
    const userId = req.user.id;
    
    // Get payment proof file path
    const paymentProofUrl = req.file ? `/uploads/${req.file.filename}` : null;

    if (!paymentProofUrl) {
      return res.status(400).json({ message: 'Payment proof is required' });
    }

    const order = await prisma.order.create({
      data: {
        orderNumber: `AY-${Math.floor(Math.random() * 100000)}`,
        userId,
        totalAmount: parseFloat(totalAmount),
        items: JSON.parse(items),
        shippingInfo: JSON.parse(shippingInfo),
        paymentProof: paymentProofUrl,
        status: 'PENDING'
      }
    });

    res.status(201).json(order);
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Failed to create order' });
  }
});

router.get('/api/users/:id/orders', async (req, res) => {
  try {
    const { id } = req.params;
    const orders = await prisma.order.findMany({
      where: { 
        userId: parseInt(id) 
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

module.exports = router; 