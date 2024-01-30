const { Router } = require('express');
import prisma from './db';

const router = Router();

export const ERROR_MSG = 'probably cannot reach db...';

// Money
router.get('/money', async (req, res) => {
  if (!req?.user?.email) {
    return res.json('nope');
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: req.user.email },
    });

    const userSettings = await prisma.userSettings.findFirst({
      where: { userId: user.id },
    });

    const otherUserIds = userSettings ? userSettings.otherUserIds : [];

    let otherUsers = otherUserIds.map((userId) => ({ userId }));

    const money = await prisma?.money?.findMany({
      where: {
        OR: [{ userId: req.user.email }, ...otherUsers],
      },
    });

    const result = money.map((m) => ({
      ...m,
      price: +m.price,
    }));
    res.json(result);
  } catch (error) {
    res.status(410).json({ msg: ERROR_MSG, error });
  }
});

router.post('/money', async (req, res) => {
  const data = {
    ...req.body,
    price: +req.body.price,
  };

  try {
    const response = await prisma.money.create({ data });
    res.json(response);
  } catch (error) {
    console.log({ msg: ERROR_MSG, error });

    res.status(410).json({ msg: ERROR_MSG, error });
  }
});

router.put('/money/:id', async (req, res) => {
  let { id } = req.params;
  const data = req.body;

  try {
    const updatedMoney = await prisma.money.update({
      where: {
        id,
      },
      data,
    });
    res.status(200).json(updatedMoney);
  } catch (error) {
    res.status(500).json({ msg: `Money update failed`, error });
  }
});

router.delete('/money/:id', async (req, res) => {
  let { id } = req.params;
  try {
    const deletedProduct = await prisma.money.delete({
      where: { id },
    });
    res.status(200).json(deletedProduct);
  } catch (error) {
    res.status(500).json({ msg: `Money deletion failed`, error });
  }
});

export default router;
