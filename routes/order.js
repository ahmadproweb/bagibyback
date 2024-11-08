const express = require('express');
const  Order  = require('../controllers/order');
const adminAuthMiddleware = require('../middlewares/adminMiddleware');

const router = express.Router();

router.post('/complete', Order.createOrder);
router.get('/allOrderAdmin', adminAuthMiddleware , Order.getAllOrders);

module.exports = router;
