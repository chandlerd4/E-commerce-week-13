const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [{ model: Category }, { model: Tag }]
    });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve products', details: error.message });
  }
});

// Get one product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [{ model: Category }, { model: Tag }],
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve product', details: error.message });
  }
});

// Create a new product
router.post('/', async (req, res) => {
  try {
    const { tagIds, ...productData } = req.body;
    const product = await Product.create(productData);

    if (tagIds && tagIds.length) {
      const productTagIdArr = tagIds.map(tag_id => ({ product_id: product.id, tag_id }));
      await ProductTag.bulkCreate(productTagIdArr);
    }

    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create product', details: error.message });
  }
});

// Update product by ID
router.put('/:id', async (req, res) => {
  try {
    const { tagIds, ...productData } = req.body;
    const [updated] = await Product.update(productData, {
      where: { id: req.params.id },
    });

    if (!updated) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (tagIds && tagIds.length) {
      const existingTags = await ProductTag.findAll({ where: { product_id: req.params.id } });
      const existingTagIds = existingTags.map(({ tag_id }) => tag_id);

      const newTags = tagIds
        .filter(tag_id => !existingTagIds.includes(tag_id))
        .map(tag_id => ({ product_id: req.params.id, tag_id }));

      const tagsToRemove = existingTags
        .filter(({ tag_id }) => !tagIds.includes(tag_id))
        .map(({ id }) => id);

      await Promise.all([
        ProductTag.destroy({ where: { id: tagsToRemove } }),
        ProductTag.bulkCreate(newTags),
      ]);
    }

    res.status(200).json({ message: 'Product updated successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to update product', details: error.message });
  }
});

// Delete product by ID
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Product.destroy({
      where: { id: req.params.id },
    });

    if (!deleted) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: `Product ${req.params.id} deleted successfully` });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product', details: error.message });
  }
});

module.exports = router;
