import express from 'express';
import controller from '../controllers/category';

const router = express.Router();
router.get('/get', controller.getCategories);
router.post('/new', controller.newCategory);
router.delete('/delete/:id', controller.deleteCategory);
export = router;