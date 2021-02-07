import express from "express";
import controller from "../controllers/category";

const router = express.Router();
router.get("/", controller.getCategories);
router.get("/get", controller.getCategories);
router.post("/new", controller.newCategory);
router.delete("/delete/:id", controller.deleteCategory);
router.patch("/update/:id", controller.updateCategory);
export = router;