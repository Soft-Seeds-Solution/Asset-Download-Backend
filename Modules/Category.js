import mongoose from "mongoose"
const { Schema } = mongoose

const categorySchema = new Schema({
    category: String,
    logo: String
})

export default mongoose.model("Category", categorySchema)