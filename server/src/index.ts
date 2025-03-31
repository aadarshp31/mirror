import dotenv from 'dotenv';
import express, { Request, Response } from 'express';

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded())


// Dummy response for all API methods
const responseHandler = (req: Request, res: Response) => {
  console.info("Received:", req.method, req.path, req.body);
  res.json({
    method: req.method,
    path: req.path,
    query: req.query,
    body: req.body,
    headers: req.headers,
  });
};

app.head("*", (req, res) => {
  const responseData: any = {
    method: "HEAD",
    message: "This is a HEAD request",
  };

  res.setHeader('x-request-body', JSON.stringify(responseData));
  res.end(); // Send raw response (Express won't strip it)
});

app.all('*', responseHandler);

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.info(`Server started on port: ${PORT}`);
});

export { app, server };
