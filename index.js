import { config } from "dotenv";
import express from "express";
import cors from "cors";
import { connectDB } from "./src/lib/db.js";
import authRouter from "./src/routes/auth.route.js";
import bookRouter from "./src/routes/book.route.js";
const app = express();
config();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());


app.use("/api/auth", authRouter);

app.use("/api/books", bookRouter);


app.listen(port, () => {
    console.log("Server is running at port:", port);
    connectDB();
})