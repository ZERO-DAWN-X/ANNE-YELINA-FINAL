// Add logging to debug image handling
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, slug } = req.body;
    let imageUrl = null;

    if (req.file) {
      // Log the file info
      console.log('Uploaded file:', req.file);
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        image: imageUrl
      }
    });

    // Log the created category
    console.log('Created category:', category);

    res.status(201).json(category);
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ error: 'Failed to create category' });
  }
}); 