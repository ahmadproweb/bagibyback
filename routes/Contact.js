// routes/contactRoutes.js
const express = require('express');
const router = express.Router();
const contactController = require('../controllers/Contact');
const adminAuthMiddleware = require('../middlewares/adminMiddleware');

router.post('/contacts', contactController.createContact);

router.get('/contacts', adminAuthMiddleware ,  contactController.getAllContacts);

module.exports = router;
