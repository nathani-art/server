import jwt from "jsonwebtoken";

const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Получаем токен из заголовков

  if (!token) {
    return res
      .status(401)
      .json({ message: "Нет авторизации, токен отсутствует" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Сохраняем информацию о пользователе в запрос
    next();
  } catch (error) {
    res.status(401).json({ message: "Неверный токен" });
  }
};

export default protect;
