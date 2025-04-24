import cors from 'cors';
import express from 'express';
import connectDB from './db.js';
import userController from './Controllers/UserController.js';
import productController from './Controllers/ProductController.js';
import categoryController from './Controllers/CategoryController.js';
import SubCategoryController from './Controllers/SubCategoryController.js';
import StripePaymentController from './Controllers/StripePayment.js';
import MembershipController from './Controllers/MembershipController.js';

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/user", userController)
app.use("/api/product", productController)
app.use("/api/category", categoryController)
app.use("/api/subCategory", SubCategoryController)
app.use("/api/payment", StripePaymentController)
app.use("/api/subscribe", MembershipController)

app.listen(8000, () => {
    console.log('Server is running on port 8000');
});