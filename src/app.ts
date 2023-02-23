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
import { ioIntance } from './socket';

import authRoutes from './routes/authRoutes';
import messageRoutes from './routes/messagesRoutes';
import { verify } from 'jsonwebtoken';

export interface ErrorResponse extends Error {
  status: number;
  data?: { message: string; status: number; reason?: string };
}

interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
}

interface ClientToServerEvents {
  hello: () => void;
}

interface InterServerEvents {
  ping: () => void;
}

interface SocketData {
  email: string;
  displayName: string;
  phoneNumber: number;
  userId: string;
}

const app = express();

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cors());

app.use('/auth', authRoutes);
app.use('/message', messageRoutes);

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
    const server = app.listen(process.env.PORT || 8081);
    const io = ioIntance.init(server, {
      cors: { origin: 'http://localhost:5173', methods: ['GET', 'POST'] },
    });
    io.use((socket, next) => {
      if (socket.handshake.query && socket.handshake.query.access_token) {
        verify(
          socket.handshake.query.access_token as string,
          process.env.SECRET,
          (error, decoded) => {
            if (error) return next(new Error('Authentication error'));
            next();
          }
        );
      } else {
        next(new Error('Authentication error'));
      }
    }).on('connection', (socket) => {
      console.log(`client connected ${socket.id}`);
      socket.on(
        'send_message',
        (data: {
          content: string;
          sender: string;
          receiver: string;
          createdAt: Date;
          updatedAt: Date;
        }) => {
          console.log(data);
          socket.emit('receive_message', data);
        }
      );
      socket.on('disconnect', () => {
        console.log(`client disconnected ${socket.id}`);
      });
    });
  })
  .catch((error) => console.log(error));
