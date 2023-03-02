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
import serverRoutes from './routes/serverRoutes';
import { verify } from 'jsonwebtoken';

export interface ErrorResponse extends Error {
  status: number;
  data?: { message: string; status: number; reason?: string };
}

const app = express();

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cors());

app.use('/auth', authRoutes);
app.use('/server', serverRoutes);

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
          socket.broadcast.emit('receive_message', data);
        }
      );
      socket.on('disconnect', () => {
        console.log(`client disconnected ${socket.id}`);
      });
      socket.on('join_servers', (rooms: string[]) => {
        console.log(
          `User with id: ${socket.id} joined ${rooms.map((room) => room)}`
        );
        socket.join(rooms);
      });
    });
  })
  .catch((error) => console.log(error));
