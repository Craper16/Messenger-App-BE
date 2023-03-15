import { Server } from '../models/server';
import { User } from '../models/user';
import { MessageModel } from '../models/server';

const PER_PAGE = 10;

export const addServer = async ({
  name,
  userId,
}: {
  name: string;
  userId: string;
}) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      return { message: 'User not found', name: 'Not found', status: 404 };
    }

    const server = new Server({
      name: name,
      owner: user._id,
      members: [user._id],
      messages: [],
    });

    const result = await server.save();

    return {
      message: 'Server created Successfuly',
      server: result,
      status: 201,
    };
  } catch (error) {
    console.error(error);
  }
};

export const getAllServers = async (page: number) => {
  try {
    const servers = await Server.find()
      .skip((page - 1) * PER_PAGE)
      .limit(PER_PAGE);

    return { servers: servers, status: 200 };
  } catch (error) {
    console.log(error);
  }
};

export const getUserServers = async (ownerId: string) => {
  try {
    const user = await User.findById(ownerId);

    if (!user) {
      return { message: 'User not Found', name: 'Not found', status: 404 };
    }

    const servers = await Server.find({ members: user });

    return { servers: servers, status: 200 };
  } catch (error) {
    console.log(error);
  }
};

export const getServer = async (serverId: string) => {
  try {
    const server = await Server.findById(serverId);

    if (!server) {
      return { message: 'Server not found', name: 'Not found', status: 404 };
    }

    return { server: server, status: 200 };
  } catch (error) {
    console.error(error);
  }
};

export const searchServers = async (serverName: string) => {
  try {
    const servers = await Server.find({
      name: { $regex: serverName, $options: 'i' },
    });

    return { servers: servers, status: 200 };
  } catch (error) {
    console.error(error);
  }
};

export const deleteServer = async ({
  serverId,
  userId,
  serverName,
}: {
  serverId: string;
  userId: string;
  serverName: string;
}) => {
  try {
    const server = await Server.findById(serverId);
    const user = await User.findById(userId);

    if (!server) {
      return { message: 'Server not Found', name: 'Not found', status: 404 };
    }

    if (!user) {
      return { message: 'User not Found', name: 'Not found', status: 404 };
    }

    if (server.owner.toString() !== user._id.toString()) {
      return { message: 'Not Authorized', name: 'Not Authorized', status: 402 };
    }

    if (server.name !== serverName) {
      return {
        message: 'Incorrect server name entered',
        name: 'Not Correct',
        status: 403,
      };
    }

    await Server.findByIdAndRemove(server._id);

    return {
      message: 'Successfully deleted server',
      status: 200,
      server: server,
    };
  } catch (error) {
    console.error(error);
  }
};

export const updateServer = async ({
  serverId,
  userId,
  newServerName,
}: {
  userId: string;
  serverId: string;
  newServerName: string;
}) => {
  try {
    const user = await User.findById(userId);
    const server = await Server.findById(serverId);

    if (!server) {
      return { message: 'Server not Found', name: 'Not found', status: 404 };
    }

    if (!user) {
      return { message: 'User not Found', name: 'Not found', status: 404 };
    }

    if (server.owner.toString() !== user._id.toString()) {
      return { message: 'Not authorized', name: 'Not Authorized', status: 402 };
    }

    server.name = newServerName;
    const result = await server.save();

    return { server: result, status: 200 };
  } catch (error) {
    console.error(error);
  }
};

export const joinServer = async ({
  serverId,
  userId,
}: {
  serverId: string;
  userId: string;
}) => {
  try {
    const server = await Server.findById(serverId);
    const user = await User.findById(userId);

    const checkIfUserAlreadyInServer = server?.members.filter(
      (member) => member.toString() === user?._id.toString()
    );

    if (!server) {
      return { message: 'Server not found', name: 'Not found', status: 404 };
    }

    if (!user) {
      return { message: 'User not found', name: 'Not found', status: 404 };
    }

    if (checkIfUserAlreadyInServer?.length !== 0) {
      return {
        message: 'User already in server',
        name: 'Already In Server',
        status: 403,
      };
    }

    server.members = [user._id as any, ...server.members];

    const result = await server.save();

    return { server: result, message: `Joined ${server.name}`, status: 200 };
  } catch (error) {
    console.error(error);
  }
};

export const leaveServer = async ({
  serverId,
  userId,
}: {
  serverId: string;
  userId: string;
}) => {
  try {
    const server = await Server.findById(serverId);
    const user = await User.findById(userId);

    const checkIfUserAlreadyInServer = server?.members.filter(
      (member) => member.toString() === user?._id.toString()
    );

    if (!server) {
      return { message: 'Server not found', name: 'Not found', status: 404 };
    }

    if (!user) {
      return { message: 'User not found', name: 'Not found', status: 404 };
    }

    if (checkIfUserAlreadyInServer?.length === 0) {
      return {
        message: 'Cannot leave a server which you arent a member of',
        name: 'Forbidden',
        status: 403,
      };
    }

    if (server.owner.toString() === user._id.toString()) {
      return {
        message:
          'Cannot leave your own server, if you no longer want to keep the server running, please delete it instead',
        name: 'Forbidden',
        status: 403,
      };
    }

    server.members = [
      ...server?.members.filter(
        (member) => member.toString() !== user?._id.toString()
      ),
    ];

    const result = await server.save();

    return { server: result, message: `Left ${server.name}`, status: 200 };
  } catch (error) {
    console.error(error);
  }
};

export const kickFromServer = async ({
  kickedUserId,
  serverId,
  userId,
}: {
  serverId: string;
  kickedUserId: string;
  userId: string;
}) => {
  try {
    const server = await Server.findById(serverId);
    const user = await User.findById(userId);
    const kickedUser = await User.findById(kickedUserId);

    const checkIfUserAlreadyInServer = server?.members.filter(
      (member) => member.toString() === kickedUser?._id.toString()
    );

    if (!server) {
      return { message: 'Server not found', name: 'Not found', status: 404 };
    }

    if (!user) {
      return { message: 'User not found', name: 'Not found', status: 404 };
    }

    if (!kickedUser) {
      return { message: 'User not found', name: 'Not found', status: 404 };
    }

    if (checkIfUserAlreadyInServer?.length === 0) {
      return {
        message: 'User already not in server',
        name: 'Not in server',
        status: 403,
      };
    }

    if (user._id.toString() !== server.owner.toString()) {
      return { message: 'Not authorized', name: 'Not Authorized', status: 402 };
    }

    if (user._id.toString() === kickedUser._id.toString()) {
      return {
        message: 'Cannot kick yourself from server',
        name: 'Forbidden',
        status: 403,
      };
    }
    server.members = [
      ...server?.members.filter(
        (member) => member.toString() !== kickedUser?._id.toString()
      ),
    ];

    const result = await server.save();

    return {
      server: result,
      message: `Kicked ${kickedUser.displayName} from ${server.name}`,
      kickedUser: kickedUser,
      status: 200,
    };
  } catch (error) {
    console.error(error);
  }
};

export const addMessageToServer = async (message: MessageModel) => {
  try {
    const user = await User.findById(message.sender._id);
    const server = await Server.findById(message.serverId);

    if (!user) {
      return { message: 'User not found', name: 'Not Found', status: 404 };
    }

    if (!server) {
      return { message: 'Server not found', name: 'Not Found', status: 404 };
    }

    server.messages = [...server.messages, message];

    const result = await server.save();

    return { server: result, status: 200 };
  } catch (error) {
    console.error(error);
  }
};
