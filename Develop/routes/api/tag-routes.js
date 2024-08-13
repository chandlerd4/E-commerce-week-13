const router = require('express').Router();
const { Tag, Product } = require('../../models');

// Helper function for handling errors
const handleError = (res, error, statusCode = 500) => {
  console.error(error);
  res.status(statusCode).json({ error: error.message });
};

// The `/api/tags` endpoint
router.get('/', async (req, res) => {
  try {
    const tags = await Tag.findAll({
      include: Product,
    });
    res.status(200).json(tags);
  } catch (error) {
    handleError(res, error);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const tag = await Tag.findByPk(req.params.id, {
      include: Product,
    });
    if (!tag) {
      return res.status(404).json({ message: 'No tag found with this ID' });
    }
    res.status(200).json(tag);
  } catch (error) {
    handleError(res, error);
  }
});

router.post('/', async (req, res) => {
  try {
    const { tag_name } = req.body;
    if (!tag_name) {
      return res.status(400).json({ message: 'Tag name is required' });
    }
    const newTag = await Tag.create({ tag_name });
    res.status(201).json(newTag);
  } catch (error) {
    handleError(res, error);
  }
});

router.put('/:id', async (req, res) => {
  try {
    const [updated] = await Tag.update(req.body, {
      where: { id: req.params.id },
    });
    if (!updated) {
      return res.status(404).json({ message: 'No tag found with this ID' });
    }
    const updatedTag = await Tag.findByPk(req.params.id);
    res.status(200).json(updatedTag);
  } catch (error) {
    handleError(res, error);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Tag.destroy({
      where: { id: req.params.id },
    });
    if (!deleted) {
      return res.status(404).json({ message: 'No tag found with this ID' });
    }
    res.status(200).json({ message: 'Tag deleted successfully' });
  } catch (error) {
    handleError(res, error);
  }
});

module.exports = router;
