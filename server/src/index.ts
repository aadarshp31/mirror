import dotenv from 'dotenv';
import express, { Request, Response } from 'express';

dotenv.config();

const app = express();

app.use(express.json());


app.get('/', (_req: Request, res: Response) => {
  res.json({
    message: "server is up!"
  });
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.info(`Server is running at port: ${PORT}`);
});
