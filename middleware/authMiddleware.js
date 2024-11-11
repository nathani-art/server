import jwt from "jsonwebtoken";
import User from "../models/User.js"; // Подключаем модель пользователя для доступа к базе данных

const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Получаем токен из заголовков

  if (!token) {
    return res
      .status(401)
      .json({ message: "Нет авторизации, токен отсутствует" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Расшифровываем токен

    const user = await User.findById(decoded.id); // Ищем пользователя по id из токена

    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    // Добавляем данные пользователя в запрос
    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      // Можно добавить и другие нужные поля
    };

    next(); // Переходим к следующему middleware
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Неверный токен" });
  }
};

export default protect;
