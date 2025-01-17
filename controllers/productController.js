const cloudinary_js_config = require('../config/cloudinary');
const cloudinary = require('cloudinary').v2;
const Product = require('../models/Product'); 

exports.createProduct = async (req, res) => {
  try {
    const thumbnails = [];
    let mainImageUrl = "";

    if (req.files.mainImage) {
      try {
        const mainImageResult = await cloudinary_js_config.uploader.upload(req.files.mainImage[0].path);
        mainImageUrl = mainImageResult.secure_url;
      } catch (uploadError) {
        // console.error('Error uploading main image:', uploadError);
        return res.status(500).json({ message: 'Error uploading main image' });
      }
    }

    if (req.files.thumbnails) {
      for (let i = 0; i < req.files.thumbnails.length; i++) {
        const thumbnailFile = req.files.thumbnails[i];
        try {
          const thumbnailResult = await cloudinary.uploader.upload(thumbnailFile.path);
          const imageUrls = [];

          const additionalImageFiles = req.files[`images_thumbnail${i + 1}`];
          if (additionalImageFiles) {
            for (const imageFile of additionalImageFiles) {
              try {
                const imageResult = await cloudinary.uploader.upload(imageFile.path);
                imageUrls.push(imageResult.secure_url);
              } catch (uploadError) {
                // console.error(`Error uploading additional image for thumbnail ${i + 1}:`, uploadError);
                return res.status(500).json({ message: `Error uploading additional image for thumbnail ${i + 1}` });
              }
            }
          }

          thumbnails.push({
            thumbnailImage: [thumbnailResult.secure_url],
            images: imageUrls
          });
        } catch (uploadError) {
          // console.error('Error uploading thumbnail image:', uploadError);
          return res.status(500).json({ message: 'Error uploading thumbnail image' });
        }
      }
    }

    const newProduct = new Product({
      title: req.body.title,
      homeProduct: req.body.homeProduct,
      // filterProducts: req.body.filterProducts,
      star: req.body.star,
      mainPrice: req.body.mainPrice,
      fakeSold: req.body.fakeSold,
      discountPrice: req.body.discountPrice,
      mainImage: mainImageUrl,
      thumbnails: thumbnails,
      description: req.body.description,
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    // console.error('Error creating product:', error);
    res.status(500).json({ message: error.message });
  }
};
;
  
  

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getSingleProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// exports.updateProduct = async (req, res) => {
//     try {
//       const updatedData = {
//         title: req.body.title,
//         mainPrice: req.body.mainPrice,
//         discountPrice: req.body.discountPrice,
//         description: req.body.description,
//       };
  
//       // Update main image if provided
//       if (req.files.mainImage) {
//         const result = await cloudinary.uploader.upload(req.files.mainImage[0].path);
//         updatedData.mainImage = result.secure_url;
//       }
  
//       // Update thumbnails if provided
//       if (req.files.thumbnails) {
//         const updatedThumbnails = [];
  
//         for (const thumbnailFile of req.files.thumbnails) {
//           const thumbnailResult = await cloudinary.uploader.upload(thumbnailFile.path);
          
//           const imageUrls = [];
//           const imageFieldName = `images_${thumbnailFile.fieldname}`;
//           if (req.files[imageFieldName]) {
//             for (const imageFile of req.files[imageFieldName]) {
//               const imageResult = await cloudinary.uploader.upload(imageFile.path);
//               imageUrls.push(imageResult.secure_url);
//             }
//           }
  
//           updatedThumbnails.push({
//             thumbnailImage: [thumbnailResult.secure_url], // Updated to match the new structure
//             images: imageUrls,
//           });
//         }
  
//         updatedData.thumbnails = updatedThumbnails;
//       }
  
//       const product = await Product.findByIdAndUpdate(req.params.id, updatedData, { new: true });
//       if (!product) return res.status(404).json({ message: "Product not found" });
//       res.status(200).json(product);
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   };
  

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
