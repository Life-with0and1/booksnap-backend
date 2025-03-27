import mongoose from "mongoose";


const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    caption: {
        type: String,
        required: true,
    },
    stars: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    bookImage: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true })

const bookModal = mongoose.model("Book", bookSchema);

export default bookModal;