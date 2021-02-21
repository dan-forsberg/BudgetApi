"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var express_1 = __importDefault(require("express"));
var category_1 = __importDefault(require("../controllers/category"));
var router = express_1.default.Router();
router.get("/", category_1.default.getCategories);
router.get("/get", category_1.default.getCategories);
router.post("/new", category_1.default.newCategory);
router.delete("/delete/:id", category_1.default.deleteCategory);
router.patch("/update/:id", category_1.default.updateCategory);
module.exports = router;
