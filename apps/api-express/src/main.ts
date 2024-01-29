import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import * as dotenv from 'dotenv';
import router from './router';
import todoRouter from "./routes/todo";
import { protect } from './handlers/auth';
import { signIn } from './handlers/user';
const port = process.env.PORT || 3333;
const version = `0.5`;

dotenv.config();

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', async (req, res) => {
  const hello = `Hi, API-express is working | v${version}`
  res.status(200)
  res.send(hello)
})

app.post('/signin', signIn)

app.use('/api', protect, router)
app.use('/todo', todoRouter)

const server = app.listen(port, () => {
  console.log(`CROWN API-express Server is running at ${port} | v${version}🚀`)
})
server.on('error', console.error);
