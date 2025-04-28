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
  thumbnail: {
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
  views: {
    type: Number,
    default: 0
  },
  downloads: {
    type: Number,
    default: 0
  },
  sampleUrl: {
    type: String
  },
  versions: [
    {
      version: { type: Number },
      downloadUrl: { type: String },
      directUrl: { type: String }
    }
  ]
}, { timestamps: true });

export default mongoose.model("Product", productSchema);
