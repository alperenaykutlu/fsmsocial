import express from "express";
import cors from "cors";
import http from "http";
import dotenv from "dotenv";

import { connectDB } from "./src/lib/db.js";
import job from "./src/lib/cron.js";
import { helmetConfig } from "./src/config/helmet.config.js";
import { xssSanitize, noSqlSanitize } from "./src/middleware/sanitize.middleware.js";
import errorHandler from "./src/middleware/errorHandler.middleware.js";
import { initSocket } from "./src/config/socket.config.js";

// Routes
import authRoute from "./src/routes/authRoute.js";
import postRoute from "./src/routes/postRoute.js";
import devreRoute from "./src/routes/devreRoute.js";
import ekipRoute from "./src/routes/ekipRoute.js";
import notificationRoute from "./src/routes/notificationRoute.js";

import User from "./src/models/user/user.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
initSocket(server);

// Security Headers (Can come before body parsing)
app.use(helmetConfig);

// Body parsers must come before sanitation so req.body exists
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());

// Sanitation
app.use(noSqlSanitize);
app.use(xssSanitize);

// Routes
app.use("/api/users", authRoute);
app.use("/api/posts", postRoute);
app.use("/api/devre", devreRoute);
app.use("/api/ekip", ekipRoute);
app.use("/api/notifications", notificationRoute);

app.get("/", (req, res) => {
    res.status(200).send("API is Running");
});

// Global Error Handling Middleware (Must be defined after all routes)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    job.start();
    await connectDB();
    
    // Mongoose hatasından kurtarmak için geçmişteki hatalı Index'i zorla yok ediyoruz.
    try {
        await User.collection.dropIndex("Ekip_1");
        console.log("✅ Tebrikler: Hatalı MongoDB Ekip_1 İndeksi Başarıyla Temizlendi!");
    } catch (error) { }
});