const router = require('express').Router();
const { Category, Product } = require('../../models');

// Utility function to handle async requests
const asyncHandler = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Get all categories
router.get('/', asyncHandler(async (req, res) => {
  const categories = await Category.findAll({ include: Product });
  res.status(200).json(categories);
}));

// Get one category
router.get('/:id', asyncHandler(async (req, res) => {
  const category = await Category.findByPk(req.params.id, { include: Product });

  if (!category) {
    return res.status(404).json({ message: 'No category found with this id!' });
  }

  res.status(200).json(category);
}));

// Create a new category
router.post('/', asyncHandler(async (req, res) => {
  const newCategory = await Category.create(req.body);
  res.status(200).json(newCategory);
}));

// Update a category
router.put('/:id', asyncHandler(async (req, res) => {
  const [updated] = await Category.update(req.body, {
    where: { id: req.params.id },
  });

  if (!updated) {
    return res.status(404).json({ message: 'No category found with this id!' });
  }

  const updatedCategory = await Category.findByPk(req.params.id);
  res.status(200).json(updatedCategory);
}));

// Delete a category
router.delete('/:id', asyncHandler(async (req, res) => {
  const deleted = await Category.destroy({
    where: { id: req.params.id },
  });

  if (!deleted) {
    return res.status(404).json({ message: 'No category found with this id!' });
  }

  res.status(200).json({ message: 'Category deleted successfully!' });
}));

module.exports = router;
