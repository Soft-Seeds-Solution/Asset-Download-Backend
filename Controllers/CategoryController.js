import express from "express"
import Category from "../Modules/Category.js"
import errorHandling from "../Middlewares/ErrorHandling.js"
import cloudinary from "../Cloudinary.js";
import upload from "../Middlewares/ImgFilter.js";
const router = express.Router()

router.post("/addCategory", upload.single("logo"), errorHandling(async (req, res) => {
    const { category } = req.body;

        if (!category || !req.file) {
            return res.status(400).json({ message: "Fields with * should be filled" });
        }

    const uploadCatImage = await cloudinary.uploader.upload(req.file.path);
    const CatImage = uploadCatImage.secure_url;

    const addCategory = await Category.create({ category, logo: CatImage });
    res.status(201).json(addCategory);
}))

router.get("/allCategories", errorHandling(async (req, res) => {
    const allCategories = await Category.find()
    if (!allCategories) return res.status(404).json({ message: "No category found" })
    res.json(allCategories)
}))

router.put("/updateCategory/:id", upload.single("logo"), errorHandling(async (req, res) => {
    const { category } = req.body;
    const newCat = {};
    if (category) {
        newCat.category = category;
    }
    if (req.file) {
        const uploadIndImage = await cloudinary.uploader.upload(req.file.path);
        newCat.logo = uploadIndImage.secure_url;
    }

    let cat = await Category.findById(req.params.id);
    if (!cat) {
        res.status(404).json("Category not found");
    }

    cat = await Category.findByIdAndUpdate(
        req.params.id,
        { $set: newCat },
        { new: true }
    );
    res.json(cat);
}));

router.delete("/delCategory/:id", errorHandling(async (req, res) => {
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);

    if (!deletedCategory) return res.status(404).json({ message: "Category not found." });

    res.json({ message: "Category deleted successfully", deletedCategory });
}));


export default router;