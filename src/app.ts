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

import { MessageModel } from './models/server';
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

let usersJoined: { userId: string; socketId: string }[] = [];

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
      usersJoined.push({
        socketId: socket.id,
        userId: socket.handshake.query.userId as string,
      });
      console.log(
        `connected clients ${usersJoined.map((user) => user.userId)}`
      );
      socket.on('send_message', (data: MessageModel) => {
        // console.log(data);
        socket.to(data.serverId).emit('receive_message', data);
      });
      socket.on('disconnect', () => {
        usersJoined = usersJoined.filter(
          (user) => user.userId !== (socket.handshake.query.userId as string)
        );
        // console.log(`client disconnected ${socket.handshake.query.userId}`);
      });
      socket.on('join_servers', (rooms: string[]) => {
        // console.log(
        //   `User with id: ${socket.handshake.query.userId} joined ${rooms.map(
        //     (room) => room
        //   )}`
        // );
        socket.join(rooms);
      });
      socket.on('leave_server', (room: string) => {
        // console.log(
        //   `User with id: ${socket.handshake.query.userId} left ${room}`
        // );
        socket.leave(room);
      });
      socket.on(
        'kick_from_server',
        (data: {
          serverId: string;
          kickedUserId: string;
          serverName: string;
        }) => {
          console.log('We are kicking', data);
          const user = usersJoined.find(
            (userJoined) => userJoined.userId === data.kickedUserId
          );
          console.log(user);
          if (!user) return;
          console.log(`Kicked ${data?.kickedUserId} from ${data?.serverId}`);
          socket.to(user?.socketId!).emit('user_kicked_from_server', data);
        }
      );
    });
  })
  .catch((error) => console.log(error));
