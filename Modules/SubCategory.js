import mongoose from "mongoose";
const { Schema } = mongoose

const subCategorySchema = new Schema({
    categoryId: {
        type: Schema.Types.ObjectId,
        ref: "Category"
    },
    subCategory: String
})

export default mongoose.model("subCategory", subCategorySchema)