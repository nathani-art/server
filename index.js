import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import protect from "./middleware/authMiddleware.js";

dotenv.config();

const app = express();
// Настроим CORS для всех доменов
app.use(cors());

app.use(express.json()); // Для парсинга JSON тела запросов

// Подключение к MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Подключено к MongoDB"))
  .catch((error) => console.error("Ошибка подключения к MongoDB:", error));

// Роуты
app.use("/api/auth", authRoutes);

app.get("/api/protected", protect, (req, res) => {
  res.json({ message: "Вы вошли в защищенный раздел", user: req.user });
});
// Добавляем новый роут на '/'
app.get("/", (req, res) => {
  res.json({ message: "Добро пожаловать на сервер Express!", status: "ok" });
});

app.listen(process.env.PORT, () => {
  console.log(`Сервер работает на порту ${process.env.PORT}`);
});
