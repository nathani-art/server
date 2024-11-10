import jwt from "jsonwebtoken";

// const protect = (req, res, next) => {
//   const token = req.headers.authorization?.split(" ")[1];
//   // const token = req.headers.authorization?.replace("Token ", "");
//   // const token = req.headers.authorization;

//   // const token = req.headers.authorization;

//   console.log(token, process.env.JWT_SECRET);

//   if (!token) {
//     return res
//       .status(401)
//       .json({ message: "Нет авторизации, токен отсутствует" });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded; // Сохраняем информацию о пользователе в запрос
//     next();
//   } catch (error) {
//     res.status(401).json({ message: "Неверный токен" });
//   }
// };

// export default protect;

import User from "../models/User.js"; // Это модель пользователя для доступа к базе данных

const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Нет авторизации, токен отсутствует" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id); // Ищем пользователя по id из токена

    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    // Добавляем все данные пользователя в запрос
    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      // Можно добавить и другие поля
    };

    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Неверный токен" });
  }
};

export default protect;
