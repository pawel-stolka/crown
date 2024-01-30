import prisma from '../db';
import { protect } from '../handlers/auth';

const { Router } = require('express');

const router = Router();

router.get('/', async (req, res) => {
  const isDeleted = false || null;
  const todos = await prisma.todo?.findMany({
    where: { isDeleted },
  });

  res.json(todos);
});

router.post('/', async (req, res) => {
  const { userId, title, description, status, priority } = req.body;
  const todo = {
    userId,
    title,
    description: description ?? null,
    status,
    priority,
  };
  const response = await prisma.todo.create({ data: todo });
  res.json(response);
});

router.put('/:id', protect, async (req, res) => {
  let { id } = req.params;
  const data = {
    ...req.body,
    changedBy: req.user.email,
  };

  try {
    const updatedTodo = await prisma.todo.update({
      where: {
        id,
      },
      data,
    });
    res.status(200).json(updatedTodo);
  } catch (error) {
    res.status(500).json({ error: `Todo update failed: ${error.message}` });
  }
});

router.delete('/:id', protect, async (req, res) => {
  let { id } = req.params;
  try {
    const deletedTodo = await prisma.todo.delete({
      where: { id },
    });
    res.status(200).json(deletedTodo);
  } catch (error) {
    res.status(500).json({ error: `Todo deletion failed: ${error.message}` });
  }
});

export default router;
