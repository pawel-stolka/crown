import prisma from '../db';
import { comparePasswords, createJWT, hashPassword } from './auth';

export const createNewUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findFirst({
    where: { email },
  });

  if (user) {
    res.status(401);
    res.json({ message: 'user exists' });
    return;
  }

  const newUser = await prisma.user.create({
    data: {
      email,
      password: await hashPassword(password),
    },
  });

  const token = createJWT(newUser);
  res.json({ token });
};

export const signIn = async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findFirst({
    where: { email },
  });

  if (!user) {
    res.status(401);
    res.json({ message: 'NOPE' });
    return;
  }

  const isValid = await comparePasswords(password, user.password);

  if (!isValid) {
    res.status(401);
    res.json({ message: 'NOPE' });
    return;
  }

  const token = createJWT(user);
  res.json({ token, email });
};
