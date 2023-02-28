import { RequestHandler } from 'express';
import { ErrorResponse } from '../app';
import {
  addServer,
  deleteServer,
  getAllServers,
  getServer,
  getUserServers,
  joinServer,
  kickFromServer,
  leaveServer,
  searchServers,
  updateServer,
} from '../services/serverServices';

export const GetAllServers: RequestHandler = async (req, res, next) => {
  try {
    const page = req.query.page || 1;

    const getServers = await getAllServers(+page);

    return res
      .status(getServers?.status!)
      .json({ servers: getServers?.servers });
  } catch (error) {
    next(error);
  }
};

export const GetUserServers: RequestHandler = async (req, res, next) => {
  try {
    const getAllUserServers = await getUserServers(req.userId);

    if (getAllUserServers?.status !== 200) {
      const error: ErrorResponse = {
        message: getAllUserServers?.name!,
        name: getAllUserServers?.name!,
        status: getAllUserServers?.status!,
        data: {
          message: getAllUserServers?.message!,
          status: getAllUserServers?.status!,
        },
      };
      throw error;
    }

    return res
      .status(getAllUserServers.status)
      .json({ servers: getAllUserServers.servers });
  } catch (error) {
    next(error);
  }
};

export const GetServer: RequestHandler = async (req, res, next) => {
  try {
    const { serverId } = req.params as { serverId: string };

    const getServerInfo = await getServer(serverId);

    if (getServerInfo?.status !== 200) {
      const error: ErrorResponse = {
        message: getServerInfo?.name!,
        name: getServerInfo?.name!,
        status: getServerInfo?.status!,
        data: {
          message: getServerInfo?.message!,
          status: getServerInfo?.status!,
        },
      };
      throw error;
    }

    return res
      .status(getServerInfo.status)
      .json({ server: getServerInfo.server });
  } catch (error) {
    next(error);
  }
};

export const AddServer: RequestHandler = async (req, res, next) => {
  try {
    const { name } = req.body as { name: string };

    const addServerAction = await addServer({ name, userId: req.userId });

    if (addServerAction?.status !== 201) {
      const error: ErrorResponse = {
        message: addServerAction?.name!,
        name: addServerAction?.name!,
        status: addServerAction?.status!,
        data: {
          message: addServerAction?.message!,
          status: addServerAction?.status!,
        },
      };
      throw error;
    }

    return res
      .status(addServerAction.status)
      .json({ server: addServerAction.server });
  } catch (error) {
    next(error);
  }
};

export const SearchServers: RequestHandler = async (req, res, next) => {
  try {
    const { search } = req.body as { search: string };

    const searchServersResponse = await searchServers(search);

    return res
      .status(searchServersResponse?.status!)
      .json({ servers: searchServersResponse?.servers });
  } catch (error) {
    next(error);
  }
};

export const DeleteServer: RequestHandler = async (req, res, next) => {
  try {
    const { serverId } = req.params as { serverId: string };
    const { serverName } = req.body as { serverName: string };

    console.log(req.userId);

    const deleteServerResponse = await deleteServer({
      serverId,
      serverName,
      userId: req.userId,
    });

    if (deleteServerResponse?.status !== 200) {
      const error: ErrorResponse = {
        message: deleteServerResponse?.name!,
        name: deleteServerResponse?.name!,
        status: deleteServerResponse?.status!,
        data: {
          message: deleteServerResponse?.message!,
          status: deleteServerResponse?.status!,
        },
      };
      throw error;
    }

    return res.status(deleteServerResponse.status).json({
      message: deleteServerResponse.message,
      server: deleteServerResponse.server,
    });
  } catch (error) {
    next(error);
  }
};

export const UpdateServer: RequestHandler = async (req, res, next) => {
  try {
    const { serverId } = req.params as { serverId: string };
    const { newServerName } = req.body as { newServerName: string };

    const updateServerResponse = await updateServer({
      userId: req.userId,
      newServerName,
      serverId,
    });

    if (updateServerResponse?.status !== 200) {
      const error: ErrorResponse = {
        message: updateServerResponse?.name!,
        name: updateServerResponse?.name!,
        status: updateServerResponse?.status!,
        data: {
          message: updateServerResponse?.message!,
          status: updateServerResponse?.status!,
        },
      };
      throw error;
    }

    return res
      .status(updateServerResponse.status)
      .json({ server: updateServerResponse.server });
  } catch (error) {
    next(error);
  }
};

export const JoinServer: RequestHandler = async (req, res, next) => {
  try {
    const { serverId } = req.params as { serverId: string };

    const joinServerResponse = await joinServer({
      serverId,
      userId: req.userId,
    });

    if (joinServerResponse?.status !== 200) {
      const error: ErrorResponse = {
        message: joinServerResponse?.name!,
        name: joinServerResponse?.name!,
        status: joinServerResponse?.status!,
        data: {
          message: joinServerResponse?.message!,
          status: joinServerResponse?.status!,
        },
      };
      throw error;
    }

    return res.status(joinServerResponse.status).json({
      message: joinServerResponse.message,
      server: joinServerResponse.server,
    });
  } catch (error) {
    next(error);
  }
};

export const LeaveServer: RequestHandler = async (req, res, next) => {
  try {
    const { serverId } = req.params as { serverId: string };

    const leaveServerResponse = await leaveServer({
      serverId,
      userId: req.userId,
    });

    if (leaveServerResponse?.status !== 200) {
      const error: ErrorResponse = {
        message: leaveServerResponse?.name!,
        name: leaveServerResponse?.name!,
        status: leaveServerResponse?.status!,
        data: {
          message: leaveServerResponse?.message!,
          status: leaveServerResponse?.status!,
        },
      };
      throw error;
    }
    return res.status(leaveServerResponse.status).json({
      message: leaveServerResponse.message,
      server: leaveServerResponse.server,
    });
  } catch (error) {
    next(error);
  }
};

export const KickFromServer: RequestHandler = async (req, res, next) => {
  try {
    const { serverId } = req.params as { serverId: string };
    const { kickedUserId } = req.body as { kickedUserId: string };

    const kickFromServerResponse = await kickFromServer({
      kickedUserId,
      serverId,
      userId: req.userId,
    });

    if (kickFromServerResponse?.status !== 200) {
      const error: ErrorResponse = {
        message: kickFromServerResponse?.name!,
        name: kickFromServerResponse?.name!,
        status: kickFromServerResponse?.status!,
        data: {
          message: kickFromServerResponse?.message!,
          status: kickFromServerResponse?.status!,
        },
      };
      throw error;
    }

    return res.status(kickFromServerResponse.status).json({
      message: kickFromServerResponse.message,
      server: kickFromServerResponse.server,
      kickedUser: kickFromServerResponse.kickedUser,
    });
  } catch (error) {
    next(error);
  }
};
