const router = require('express').Router();
const { Category, Product } = require('../../models');

// Helper function to handle responses
const handleResponse = (res, data, status = 200) => res.status(status).json(data);

// Get all categories with associated Products
router.get('/', async (req, res) => {
  try {
    const categories = await Category.findAll({
      include: [{ model: Product }],
    });
    handleResponse(res, categories);
  } catch (error) {
    handleResponse(res, { error: 'Failed to retrieve categories', details: error.message }, 500);
  }
});

// Get a category by ID with associated Products
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id, {
      include: [{ model: Product }],
    });
    if (!category) {
      return handleResponse(res, { message: 'Category not found with that id!' }, 404);
    }
    handleResponse(res, category);
  } catch (error) {
    handleResponse(res, { error: 'Failed to retrieve category', details: error.message }, 500);
  }
});

// Create a new category
router.post('/', async (req, res) => {
  try {
    const { category_name } = req.body;
    const newCategory = await Category.create({ category_name });
    handleResponse(res, newCategory, 201);
  } catch (error) {
    handleResponse(res, { error: 'Failed to create category', details: error.message }, 500);
  }
});

// Update a category by ID
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { category_name } = req.body;
    const [numUpdatedRows] = await Category.update(
      { category_name },
      { where: { id } }
    );

    if (numUpdatedRows === 0) {
      return handleResponse(res, { message: 'Category not found with that id!' }, 404);
    }

    const updatedCategory = await Category.findByPk(id);
    handleResponse(res, updatedCategory);
  } catch (error) {
    handleResponse(res, { error: 'Failed to update category', details: error.message }, 500);
  }
});

// Delete a category by ID
router.delete('/:id', async (req, res) => {
  try {
    const numDeletedRows = await Category.destroy({
      where: { id: req.params.id },
    });

    if (numDeletedRows === 0) {
      return handleResponse(res, { message: 'Category not found with that id!' }, 404);
    }

    handleResponse(res, { message: 'Category deleted successfully' });
  } catch (error) {
    handleResponse(res, { error: 'Failed to delete category', details: error.message }, 500);
  }
});

module.exports = router;
