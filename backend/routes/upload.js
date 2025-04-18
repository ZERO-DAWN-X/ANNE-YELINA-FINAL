const express = require('express');
const router = express.Router();
const { upload, processImage } = require('../middleware/upload');

router.post('/', upload.single('image'), async (req, res, next) => {
  try {
    // Process the image if middleware processImage is available
    if (processImage) {
      await processImage(req, res, () => {
        // This is called after image processing
        if (!req.file) {
          return res.status(400).json({ error: 'No file uploaded' });
        }
        
        // Generate URL for the uploaded file
        const fileUrl = `/uploads/${req.file.filename}`;
        
        res.json({
          url: fileUrl,
          filename: req.file.filename
        });
      });
    } else {
      // If no image processing is available
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
      
      // Generate URL for the uploaded file
      const fileUrl = `/uploads/${req.file.filename}`;
      
      res.json({
        url: fileUrl,
        filename: req.file.filename
      });
    }
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

module.exports = router; 