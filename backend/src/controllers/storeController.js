import Medicine from '../models/Medicine.js';
import Order from '../models/Order.js';
import Notification from '../models/Notification.js';

export async function getMedicines(req, res, next) {
  try {
    const { search, category, minPrice, maxPrice, sort, inStock } = req.query;

    let query = {};

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    if (category && category !== 'All') {
      query.category = category;
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (inStock === 'true') {
      query.stock = { $gt: 0 };
    }

    let sortOption = {};
    if (sort) {
      if (sort === 'price-low') {
        sortOption.price = 1;
      } else if (sort === 'price-high') {
        sortOption.price = -1;
      } else if (sort === 'name-asc') {
        sortOption.name = 1;
      }
    }

    const medicines = await Medicine.find(query).sort(sortOption);

    res.status(200).json({
      success: true,
      count: medicines.length,
      medicines
    });
  } catch (error) {
    next(error);
  }
}

export async function getMedicineById(req, res, next) {
  try {
    const medicine = await Medicine.findById(req.params.id);

    if (!medicine) {
      const error = new Error('Medicine not found');
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      medicine
    });
  } catch (error) {
    next(error);
  }
}

export async function placeOrder(req, res, next) {
  try {
    const patientId = req.user._id;
    const { items, shippingAddress } = req.body;

    if (!items || items.length === 0 || !shippingAddress) {
      const error = new Error('Items and shippingAddress are required.');
      error.statusCode = 400;
      throw error;
    }

    let subtotal = 0;
    const orderItems = [];

    // Check stock & build items
    for (const item of items) {
      const med = await Medicine.findById(item.medicineId);
      if (!med) {
        const error = new Error(`Medicine with ID ${item.medicineId} not found.`);
        error.statusCode = 404;
        throw error;
      }

      if (med.stock < item.quantity) {
        const error = new Error(`Insufficient stock for ${med.name}. Available: ${med.stock}`);
        error.statusCode = 400;
        throw error;
      }

      // Decrement stock
      med.stock -= item.quantity;
      await med.save();

      const itemTotal = med.price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        medicineId: med._id,
        name: med.name,
        price: med.price,
        quantity: item.quantity
      });
    }

    const tax = Math.round(subtotal * 0.05); // 5% tax
    const deliveryCharges = subtotal > 1000 ? 0 : 50; // free above 1000
    const total = subtotal + tax + deliveryCharges;

    const order = await Order.create({
      patientId,
      items: orderItems,
      subtotal,
      tax,
      deliveryCharges,
      total,
      shippingAddress,
      status: 'processing',
      paymentStatus: 'paid', // Simulating successful Razorpay payment
      paymentMethod: 'Razorpay',
      paymentId: 'pay_' + Math.random().toString(36).substring(2, 10).toUpperCase()
    });

    // Create Notification
    await Notification.create({
      userId: patientId,
      title: 'Order Placed Successfully',
      message: `Your medicine order #${order._id.toString().substring(18).toUpperCase()} has been placed and is being processed.`,
      type: 'order'
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order
    });
  } catch (error) {
    next(error);
  }
}

export async function getOrders(req, res, next) {
  try {
    const patientId = req.user._id;
    const orders = await Order.find({ patientId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    next(error);
  }
}

export async function getOrderById(req, res, next) {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      const error = new Error('Order not found');
      error.statusCode = 404;
      throw error;
    }

    if (String(order.patientId) !== String(req.user._id)) {
      const error = new Error('Unauthorized');
      error.statusCode = 403;
      throw error;
    }

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    next(error);
  }
}
