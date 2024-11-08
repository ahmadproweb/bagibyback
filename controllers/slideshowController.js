const  cloudinary  = require('../config/cloudinary');
const Slideshow = require('../models/Slideshow');



exports.uploadImages = async (req, res) => {
    try {
      const files = req.files; 
  
      if (files.length !== 1) {
        return res.status(400).json({ message: 'Only one image can be uploaded at a time.' });
      }
  
      const result = await cloudinary.uploader.upload(files[0].path);
      const imageUrl = result.secure_url;
  
      const slideshow = new Slideshow({ images: [imageUrl] });
      await slideshow.save();
  
      res.status(201).json({ message: 'Image uploaded successfully!', slideshow });
    } catch (error) {
      res.status(500).json({ message: 'An error occurred while uploading the image.', error });
    }
  };
  
exports.getAllSlideShow = async (req, res) => {
    try {
        const slideshow = await Slideshow.find().sort({ createdAt: -1 });
        res.status(200).json(slideshow);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving Slideshow', error });
    }
};

exports.deleteSlideshow = async (req, res) => {
  try {
    const { id } = req.params;
    const slideshow = await Slideshow.findByIdAndDelete(id);

    if (!slideshow) {
      return res.status(404).json({ message: 'Slideshow not found.' });
    }

    res.status(200).json({ message: 'Slideshow deleted successfully.', slideshow });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while deleting the slideshow.', error });
  }
};
