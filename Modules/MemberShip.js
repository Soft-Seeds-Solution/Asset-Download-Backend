import mongoose from "mongoose"
const { Schema } = mongoose

const memberShipSchema = new Schema({
    status: String,
    amount: Number,
    planTitle: String,
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    planDuration: Number,
    dailyLimit: Number,
    todayDownloads: Number,
    downloadsDate: {
        type: String,
        default: () => new Date().toISOString().slice(0, 10)
    },
    downloadAssetTitle: [
        {
            type: String,
        }
    ]
}, { timestamps: true })

export default mongoose.model("Membership", memberShipSchema)
