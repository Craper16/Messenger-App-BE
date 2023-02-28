import { Router } from 'express';
import {
  AddServer,
  DeleteServer,
  GetAllServers,
  GetServer,
  GetUserServers,
  JoinServer,
  LeaveServer,
  SearchServers,
  UpdateServer,
} from '../controllers/serverControllers';
import { isAuth } from '../middlewares/isAuth';

const router = Router();

router.post('/create-server', isAuth, AddServer);

router.get('/me', isAuth, GetUserServers);

router.get('/all', isAuth, GetAllServers);

router.get('/search', isAuth, SearchServers);

router.get('/:serverId', isAuth, GetServer);

router.put('/update-server/:serverId', isAuth, UpdateServer);

router.delete('/delete/:serverId', isAuth, DeleteServer);

router.put('/join/:serverId', isAuth, JoinServer);

router.put('/leave/:serverId', isAuth, LeaveServer);

export default router;
