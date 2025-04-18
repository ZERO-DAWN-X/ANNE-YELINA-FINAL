const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createOrder = async (orderData) => {
  try {
    const order = await prisma.order.create({
      data: {
        orderNumber: orderData.orderNumber,
        userId: orderData.userId,
        totalAmount: orderData.totalAmount,
        items: orderData.items,
        shippingInfo: orderData.shippingInfo,
      },
    });
    return order;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

module.exports = {
  createOrder,
}; 