import bookModal from "../models/book.model.js";
import cloudinary from "../lib/cloudinary.js";

export const createBook = async (req, res) => {
    try {
        const { title, caption, bookImage, stars } = req.body;

        if (!title || !caption || !bookImage || !stars || !req.user?._id) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const uploadResponse = await cloudinary.uploader.upload(bookImage);
        const imageUrl = uploadResponse.secure_url;

        const book = await bookModal.create({
            title,
            caption,
            bookImage: imageUrl,
            stars,
            user: req.user._id
        })
        return res.status(201).json({ message: "Book added successfull", book });

    } catch (error) {
        console.log("Error while adding book", error);
        return res.status(500).json({ message: "Server error" });
    }
}


export const getAllBooks = async (req, res) => {
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 5;
        const skip = (page - 1) * limit;

        const books = await bookModal.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate("user", "username profileImage");

        const totalBooks = await bookModal.countDocuments();

        return res.send({
            books,
            currentPage: page,
            totalBooks: totalBooks,
            totalPages: Math.ceil(totalBooks / limit)
        });
    } catch (error) {
        console.log("Error while fetching books:", error);
        return res.status(500).json({ message: "Server error" });
    }
}


export const deleteBook = async (req, res) => {
    try {
        const bookId = req.params.id;

        const book = await bookModal.findById(bookId);

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        if (book.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Unauthorized action" });
        }

        if (book.image && book.image.includes("cloudinary")) {
            try {
                const publicId = book.imageUrl.split("/").pop().split(".")[0];
                await cloudinary.uploader.destroy(publicId);
            } catch (error) {

                console.log("Error deleting image from cloudinary", error);
            }
        }


        await book.deleteOne();

        return res.json({ message: "Book deleted successfully" });


    } catch (error) {
        console.log("Error while deleting book:", error);
        return res.status(500).json({ message: "Server error" });
    }
}

export const getMyBooks = async (req, res) => {
    try {
        const books = await bookModal.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(books);
    }
    catch (error) {
        console.log("Error while deleting book:", error);
        return res.status(500).json({ message: "Server error" });
    }

}
