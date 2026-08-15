import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js"
import userRoutes from "./routes/userRoutes.js";
import contentRoutes from "./routes/contentRoutes.js";


connectDB();

const app = express();

app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "https://creatorflowai.vercel.app",
        ],
        credentials: true,
    })
);
app.use((req, res, next) => {
    console.log(`${req.method} ${req.originalUrl}`);
    next();
});
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes); 
app.use("/api/content", contentRoutes);
app.get("/", (req, res) => {
    res.send("🚀 CreatorFlow API Running");
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});