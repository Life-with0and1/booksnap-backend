import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import  {createBook, getAllBooks , deleteBook , getMyBooks}  from "../controllers/book.controller.js";


const bookRouter = express.Router();

bookRouter.post("/add-book", authMiddleware , createBook);

bookRouter.get("/", authMiddleware ,getAllBooks);

bookRouter.delete("/delete-book:id", authMiddleware ,deleteBook);

bookRouter.get("/my-books", authMiddleware ,getMyBooks);

export default bookRouter;