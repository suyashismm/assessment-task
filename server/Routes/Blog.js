const express = require('express');
const router = express.Router();
const auth = require('../Middlewares/auth');
const Blog = require('../Models/Blog');
const upload = require('../utils/upload');

// Create a blog
router.post('/', auth, (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err });
    }

    const { description } = req.body;
    const image = req.file ? req.file.path : '';

    try {
      const blog = new Blog({
        // title,
        description,
        // image,
        author: req.user._id
      });

      await blog.save();
      res.status(201).json(blog);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
});

// Get all blogs
router.get('/', auth, async (req, res) => {
  try {
    const blogs = await Blog.find().populate('author', 'email profileImage');
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a single blog
router.get('/:id', auth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('author', 'email profileImage');
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a blog
router.put('/:id', auth, (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err });
    }

    try {
      const blog = await Blog.findById(req.params.id);
      if (!blog) {
        return res.status(404).json({ message: 'Blog not found' });
      }

      // Check if the user is the author
      if (blog.author.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized' });
      }

      const { title, description } = req.body;
      const image = req.file ? req.file.path : blog.image;

      blog.title = title || blog.title;
      blog.description = description || blog.description;
      blog.image = image;
      blog.updatedAt = Date.now();

      await blog.save();
      res.json(blog);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
});

// Delete a blog
router.delete('/:id', auth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Check if the user is the author
    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await blog.remove();
    res.json({ message: 'Blog removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;