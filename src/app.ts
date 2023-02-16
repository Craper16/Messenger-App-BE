import * as dotenv from 'dotenv';
dotenv.config();

import express, {
  urlencoded,
  json,
  Request,
  Response,
  NextFunction,
} from 'express';
import cors from 'cors';
import { connect } from 'mongoose';

import authRoutes from './routes/authRoutes';

export interface ErrorResponse extends Error {
  status: number;
  data?: any;
}

const app = express();

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cors());

app.use('/auth', authRoutes);

app.use('*', (req: Request, res: Response) => {
  return res.status(404).json({ message: 'Endpoint doesnt exist' });
});

app.use(
  (error: ErrorResponse, req: Request, res: Response, next: NextFunction) => {
    const { message, status, data } = error;
    res
      .status(status)
      .json({ message: message || 'Internal server error', data: data });
  }
);

connect(process.env.DB_URI)
  .then(() => {
    console.log(`connected on ${process.env.PORT || 8081}`);
    app.listen(process.env.PORT || 8081);
  })
  .catch((error) => console.log(error));
