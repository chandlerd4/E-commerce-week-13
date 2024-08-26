const router = require('express').Router();
const { Tag, Product } = require('../../models');

const asyncHandler = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

router.get('/', asyncHandler(async (req, res) => {
  const tags = await Tag.findAll({ include: Product });
  res.status(200).json(tags);
}));

router.get('/:id', asyncHandler(async (req, res) => {
  const tag = await Tag.findByPk(req.params.id, { include: Product });

  if (!tag) {
    return res.status(404).json({ message: "No tag found with this ID!" });
  }

  res.status(200).json(tag);
}));

router.post('/', asyncHandler(async (req, res) => {
  const tag = await Tag.create({ tag_name: req.body.tag_name });
  res.status(200).json(tag);
}));

router.put('/:id', asyncHandler(async (req, res) => {
  const [updated] = await Tag.update(req.body, {
    where: { id: req.params.id },
  });

  if (!updated) {
    return res.status(404).json({ message: "No tag found with this ID!" });
  }

  const updatedTag = await Tag.findByPk(req.params.id);
  res.status(200).json(updatedTag);
}));

router.delete('/:id', asyncHandler(async (req, res) => {
  const deleted = await Tag.destroy({ where: { id: req.params.id } });

  if (!deleted) {
    return res.status(404).json({ message: "No tag found with this ID!" });
  }

  res.status(200).json({ message: "Tag deleted successfully!" });
}));

module.exports = router;
