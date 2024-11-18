const Order = require('../models/order');
const sendEmail = require('../utils/emailService');

exports.createOrder = async (req, res) => {
  try {
    // console.log('Received order data:', req.body);

    const { customerName, contact, address, items, total } = req.body;

    if (!customerName || !contact || !address || items.length === 0 || !total) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newOrder = await Order.create(req.body);

    // Email to User
    const userSubject = `Thank you for your order #${newOrder._id}`;
    const userText = `Hello ${newOrder.customerName.first},\n\nThank you for placing an order with us. Your order ID is #${newOrder._id}. You can track your order via WhatsApp.`;
    let userHTML = `
      <h1>Thank you for your order!</h1>
      <p>Order ID: ${newOrder._id}</p>
      <p>Total: ${newOrder.total}</p>
      <p><a href="https://wa.me/${process.env.ADMIN_PHONE}?text=Track%20order%20ID:%20${newOrder._id}">Track your order on WhatsApp</a></p>
      <h2>Your Order Items:</h2>
      <ul>
    `;
    newOrder.items.forEach(item => {
      userHTML += `
        <li>
          <h3>${item.title} (Qty: ${item.quantity})</h3>
          <img src="${item.cartImage}" alt="${item.title}" style="width: 100px;">
          <p>Total Price: ${item.totalPrice}</p>
        </li>
      `;
    });
    userHTML += `</ul>`;

    await sendEmail(newOrder.contact.email, userSubject, userText, userHTML);

    // Email to Admin
    const adminSubject = `New Order Received #${newOrder._id}`;
    const adminText = `New order details:\n\nOrder ID: ${newOrder._id}\nCustomer: ${newOrder.customerName.first} ${newOrder.customerName.last}\nTotal: $${newOrder.total}`;
    let adminHTML = `
      <h1>New Order Received!</h1>
      <p>Order ID: ${newOrder._id}</p>
      <p>Customer: ${newOrder.customerName.first} ${newOrder.customerName.last}</p>
      <p>Total: ${newOrder.total}</p>
      <h2>Order Items:</h2>
      <ul>
    `;
    newOrder.items.forEach(item => {
      adminHTML += `
        <li>
          <h3>${item.title} (Qty: ${item.quantity})</h3>
          <img src="${item.cartImage}" alt="${item.title}" style="width: 200px;">
          <p>Total Price: ${item.totalPrice}</p>
        </li>
      `;
    });
    adminHTML += `</ul>`;

    await sendEmail(process.env.ADMIN_EMAIL, adminSubject, adminText, adminHTML);

    const adminPhone = process.env.ADMIN_PHONE;
    const whatsappMessage = `New order received! Order ID: ${newOrder._id}\nCustomer: ${newOrder.customerName.first} ${newOrder.customerName.last}\nTotal: $${newOrder.total}`;
    // await whatsapp.sendMessage(adminPhone, whatsappMessage);

    res.status(201).json({ message: 'Order completed successfully', order: newOrder });
  } catch (error) {
    // console.error('Error processing order:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving orders', error });
  }
};
