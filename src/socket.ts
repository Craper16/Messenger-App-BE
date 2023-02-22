import { Server } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

let io:
  | Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
  | undefined;

export const ioIntance = {
  init: (httpServer: any, options: any) => {
    io = new Server(httpServer, options);
    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error('Socket not initialized');
    }
    return io;
  },
};
