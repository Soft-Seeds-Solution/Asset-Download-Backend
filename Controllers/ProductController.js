import express from "express";
import Product from "../Modules/Product.js";
import errorHandling from "../Middlewares/ErrorHandling.js";
import cloudinary from "../Cloudinary.js";
import upload from "../Middlewares/ImgFilter.js";
const router = express.Router();

router.post("/uploadProduct", upload.fields([
    { name: "featureImg", maxCount: 1 },
    { name: "screenshots", maxCount: 5 },
]), errorHandling(async (req, res) => {
    const { categoryId, subCategoryId, title, description, features, userId, authorName, directUrl, downloadUrl, accessLevel, version } = req.body;

    if (!categoryId || !subCategoryId || !title || !description || !features || !accessLevel || !req.files["featureImg"] || !userId || !authorName) return res.status(400).json({ message: "Fields with * should be filled" })

    const checkTitle = await Product.findOne({ title })
    if (checkTitle) return res.json(404).json({ message: "Title already exists" })

    let featureImg_url = "", screenShots_url = [];
    if (req.files["featureImg"]) {
        const imgconfig = await cloudinary.uploader.upload(req.files["featureImg"][0].path);
        featureImg_url = imgconfig.secure_url;
    }

    if (req.files["screenshots"]) {
        for (let file of req.files["screenshots"]) {
            const screenShotsConfig = await cloudinary.uploader.upload(file.path);
            screenShots_url.push(screenShotsConfig.secure_url);
        }
    }

    const newProduct = await Product.create({
        categoryId, subCategoryId, title, description, features, featureImg: featureImg_url, screenshots: screenShots_url, userId, authorName, directUrl, downloadUrl, accessLevel, version
    });
    res.json(newProduct);
}));

router.get("/uploaded-products", errorHandling(async (req, res) => {
    const uploadedGames = await Product.find().populate("userId").populate("categoryId").populate("subCategoryId");
    res.status(200).json(uploadedGames);
}));

router.delete("/delProduct/:id", errorHandling(async (req, res) => {
    const DelGame = await Product.findByIdAndDelete(req.params.id);
    if (!DelGame) {
        return res.status(404).json({ message: "Game not found" });
    }
    res.json({ message: "Game deleted successfully" });
}));

router.put(
    "/editProduct/:id",
    upload.fields([
        { name: "featureImg", maxCount: 1 },
    ]),
    errorHandling(async (req, res) => {
        const {
            categoryId, subCategoryId, title, description, features, authorName, directUrl, downloadUrl, accessLevel, version } = req.body;

        let newProductData = {};

        if (title) newProductData.title = title;
        if (categoryId) newProductData.categoryId = categoryId;
        if (description) newProductData.description = description;
        if (features) newProductData.features = features;
        if (accessLevel) newProductData.accessLevel = accessLevel;
        if (subCategoryId) newProductData.subCategoryId = subCategoryId;
        if (authorName) newProductData.authorName = authorName;
        if (directUrl) newProductData.directUrl = directUrl;
        if (version) newProductData.version = version;
        if (downloadUrl) newProductData.downloadUrl = downloadUrl;

        if (req.files && req.files["featureImg"]) {
            const imgconfig = await cloudinary.uploader.upload(req.files["featureImg"][0].path);
            newProductData.featureImg = imgconfig.secure_url;
        }

        const productData = await Product.findByIdAndUpdate(
            req.params.id,
            { $set: newProductData },
            { new: true }
        );

        if (!productData) {
            return res.status(404).json({ message: "Game not found" });
        }
        res.json(productData);
    })
);

router.put(
    "/updateViews/:id", errorHandling(async (req, res) => {
        const id = req.params.id
        const findProduct = await Product.findById(id)
        if (!findProduct) return res.status(400).json({ message: "Product not found" })
        findProduct.views += 1
        await findProduct.save()
    })
);

router.put(
    "/updateProductDownloads/:id", errorHandling(async (req, res) => {
        const id = req.params.id
        const findProduct = await Product.findById(id)
        if (!findProduct) return res.status(400).json({ message: "Product not found" })
        findProduct.downloads += 1
        await findProduct.save()
    })
);



export default router;