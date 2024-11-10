import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
const router = express.Router();

// Регистрация
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Пожалуйста, заполните все поля" });
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res
      .status(400)
      .json({ message: "Пользователь с таким email уже существует" });
  }

  const user = new User({ name, email, password });

  try {
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// Авторизация
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "Неверный email или пароль" });
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return res.status(400).json({ message: "Неверный email или пароль" });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
  res.json({ token });
});

export default router;
