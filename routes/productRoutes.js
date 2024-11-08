const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const multer = require('multer');
const adminAuthMiddleware = require('../middlewares/adminMiddleware');
const upload = multer({ dest: 'uploads/' });

router.post(
    '/create',
    upload.fields([
        { name: 'mainImage', maxCount: 1 },
        { name: 'thumbnails', maxCount: 8 },
        { name: 'images_thumbnail1', maxCount: 3 },
        { name: 'images_thumbnail2', maxCount: 3 },
        { name: 'images_thumbnail3', maxCount: 3 },
        { name: 'images_thumbnail4', maxCount: 3 },
        { name: 'images_thumbnail5', maxCount: 3 },
        { name: 'images_thumbnail6', maxCount: 3 },
        { name: 'images_thumbnail7', maxCount: 3 },
        { name: 'images_thumbnail8', maxCount: 3 }
    ]), adminAuthMiddleware ,
    productController.createProduct
);

// router.put(
//     '/:id',
//     upload.fields([
//           { name: 'mainImage', maxCount: 1 },
//         { name: 'thumbnails', maxCount: 8 },
//         { name: 'images_thumbnail1', maxCount: 3 },
//         { name: 'images_thumbnail2', maxCount: 3 },
//         { name: 'images_thumbnail3', maxCount: 3 },
//         { name: 'images_thumbnail4', maxCount: 3 },
//         { name: 'images_thumbnail5', maxCount: 3 },
//         { name: 'images_thumbnail6', maxCount: 3 },
//         { name: 'images_thumbnail7', maxCount: 3 },
//         { name: 'images_thumbnail8', maxCount: 3 }
//     ]), adminAuthMiddleware ,
//     productController.updateProduct
// );

router.get('/', productController.getAllProducts);
router.get('/:id' , productController.getSingleProduct);
router.delete('/:id', adminAuthMiddleware , productController.deleteProduct);

module.exports = router;
