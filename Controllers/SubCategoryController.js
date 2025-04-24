import express from "express"
import errorHandling from "../Middlewares/ErrorHandling.js"
import SubCategory from "../Modules/SubCategory.js"
const router = express.Router()

router.post("/addSubCategory", errorHandling(async (req, res) => {
    const { categoryId, subCategory } = req.body
    if (!categoryId || !subCategory) return res.status(400).json({ message: "Fields with * should be filled" })
    const addSubCategory = await SubCategory.create({ categoryId, subCategory })
    res.json(addSubCategory)
}))

router.get("/allSubCategories", errorHandling(async (req, res) => {
    const allSubCategories = await SubCategory.find().populate("categoryId")
    if (!allSubCategories) return res.status(404).json({ message: "No sub category found" })
    res.json(allSubCategories)
}))

router.put("/updateSubCategory/:id", errorHandling(async (req, res) => {
    const { categoryId, subCategory } = req.body;

    const updateFields = {};
    if (categoryId) updateFields.categoryId = categoryId;
    if (subCategory) updateFields.subCategory = subCategory;

    const updatedSubCategory = await SubCategory.findByIdAndUpdate(
        req.params.id,
        updateFields,
        { new: true }
    );

    if (!updatedSubCategory) {
        return res.status(404).json({ message: "Subcategory not found" });
    }

    res.json(updatedSubCategory);
}));

router.delete("/delSubCategory/:id", errorHandling(async (req, res) => {
    const deletedSubCategory = await SubCategory.findByIdAndDelete(req.params.id);

    if (!deletedSubCategory) {
        return res.status(404).json({ message: "Subcategory not found" });
    }

    res.json({ message: "Subcategory deleted successfully", deletedSubCategory });
}));



export default router;