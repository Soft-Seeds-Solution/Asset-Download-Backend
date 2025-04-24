import mongoose from "mongoose";
const { Schema } = mongoose;
const productSchema = new Schema({
    title: {
        type: String,
    },
    categoryId: {
        type: Schema.Types.ObjectId,
        ref: "Category"
    },
    subCategoryId: {
        type: Schema.Types.ObjectId,
        ref: "subCategory"
    },
    description: {
        type: String,
    },
    features: {
        type: String,
    },
    featureImg: {
        type: String,
    },
    screenshots: {
        type: [String],
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    authorName: {
        type: String
    },
    directUrl: {
        type: String
    },
    downloadUrl: {
        type: String
    },
    accessLevel: {
        type: String
    },
    views: {
        type: Number,
        default: 0
    },
    version: {
        type: String
    },
    downloads: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

export default mongoose.model("Product", productSchema);