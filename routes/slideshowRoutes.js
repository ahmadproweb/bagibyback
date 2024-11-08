const express = require('express');
const multer = require('multer'); 
const { uploadImages, deleteSlideshow , getAllSlideShow } = require('../controllers/slideshowController');
const adminAuthMiddleware = require('../middlewares/adminMiddleware');

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); 

router.post('/upload', adminAuthMiddleware , upload.array('images', 1), uploadImages);
router.delete('/:id', adminAuthMiddleware , deleteSlideshow); 
router.get('/all' , getAllSlideShow)
module.exports = router;
