const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const { createCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory } = require("../controllers/categoryController");

router.post("/", upload.single("file"), createCategory);
router.get("/", getAllCategories);
router.get("/:id", getCategoryById);
router.put("/:id", upload.single("file"), updateCategory); 
router.delete("/:id", deleteCategory);

module.exports = router;
