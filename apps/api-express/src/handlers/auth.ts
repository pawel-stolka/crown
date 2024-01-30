import jwt from 'jsonwebtoken';
// const argon2 = require('argon2');
import bcrypt from 'bcryptjs';

const NOT_AUTHORIZED = 'Not authorized';
const NOT_VALID_TOKEN = 'Not valid token';

// export const comparePasswords = async (password, hash) => {
//     return await argon2.verify(hash, password);
// };
export const comparePasswords = (password, hash) => {
  return bcrypt.compare(password, hash);
};

// export const hashPassword = async (password) => {
//     return await argon2.hash(password);
// };
export const hashPassword = (password) => {
  return bcrypt.hash(password, process.env.SALT);
};

export const createJWT = (user: { id: string; email: string }) => {
  return jwt.sign(user, process.env.JWT_SECRET);
};

export const protect = (req, res, next) => {
  const bearer = req.headers.authorization;

  if (!bearer) {
    console.log(NOT_AUTHORIZED);
    res.status(401);
    res.json({ message: NOT_AUTHORIZED });
    return;
  }

  const [, token] = bearer.split(' ');

  if (!token) {
    console.log(NOT_VALID_TOKEN);
    res.status(401);
    res.send({ message: NOT_VALID_TOKEN });
    return;
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    console.log('PROTECTED:', user);

    req.user = user;
    next();
  } catch (err) {
    console.log('user err', err);
    res.status(401);
    res.send({ message: NOT_VALID_TOKEN });
    return;
  }
};
