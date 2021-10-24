import { Request, Response, Router } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/users.model';
import Paginator from '../interfaces/paginator.interface';
import UserService from '../Services/UserService';
import { secret } from '../config/config';
import { authorized } from '../middlewares/token.middleware';

const router = Router();

const listAll = async (req: Request, res: Response): Promise<Response> => {
  try {
    const users: Paginator<User> = await UserService
      .listAll(Number(req.query.limit), Number(req.query.offset));
    return res.status(200).send(users);
  } catch (error) {
    const e = error as Error;
    return res.status(400).json({ error: e.message });
  }
};

const listPending = async (req: Request, res: Response): Promise<Response> => {
  try {
    const users: Paginator<User> = await UserService
      .listPending(Number(req.query.limit), Number(req.query.offset), String(req.query.search));
    return res.status(200).send(users);
  } catch (error) {
    const e = error as Error;
    return res.status(400).json({ error: e.message });
  }
};

const listApproved = async (req: Request, res: Response): Promise<Response> => {
  try {
    const users: Paginator<User> = await UserService
      .listApproved(Number(req.query.limit), Number(req.query.offset), String(req.query.search));
    return res.status(200).send(users);
  } catch (error) {
    const e = error as Error;
    return res.status(400).json({ error: e.message });
  }
};

const listClients = async (req: Request, res: Response): Promise<Response> => {
  try {
    const users: Paginator<User> = await UserService
      .listClients(Number(req.query.limit), Number(req.query.offset), String(req.query.search));
    return res.status(200).send(users);
  } catch (error) {
    const e = error as Error;
    return res.status(400).json({ error: e.message });
  }
};

const listAdmins = async (req: Request, res: Response): Promise<Response> => {
  try {
    const users: Paginator<User> = await UserService
      .listAdmins(Number(req.query.limit), Number(req.query.offset), String(req.query.search));
    return res.status(200).send(users);
  } catch (error) {
    const e = error as Error;
    return res.status(400).json({ error: e.message });
  }
};

const create = async (req: Request, res: Response): Promise<Response> => {
  try {
    const user: User = await UserService.create(req.body);
    return res.status(200).send(user);
  } catch (error) {
    const e = error as Error;
    return res.status(400).json({ error: e.message });
  }
};

const update = async (req: Request, res: Response): Promise<Response> => {
  try {
    const user: User = await UserService.update(Number(req.params.id), req.body);
    return res.status(200).send(user);
  } catch (error) {
    const e = error as Error;
    return res.status(400).json({ error: e.message });
  }
};

const password = async (req: Request, res: Response): Promise<Response> => {
  try {
    const user: User = await UserService.password(Number(req.params.id), req.body);
    return res.status(200).send(user);
  } catch (error) {
    const e = error as Error;
    return res.status(400).json({ error: e.message });
  }
};

const approve = async (req: Request, res: Response): Promise<Response> => {
  try {
    const user: User = await UserService.approve(Number(req.params.id));
    return res.status(200).send(user);
  } catch (error) {
    const e = error as Error;
    return res.status(400).json({ error: e.message });
  }
};

const cancel = async (req: Request, res: Response): Promise<Response> => {
  try {
    const user: User = await UserService.cancel(Number(req.params.id));
    return res.status(200).send(user);
  } catch (error) {
    const e = error as Error;
    return res.status(400).json({ error: e.message });
  }
};

const giveAdminPermission = async (req: Request, res: Response): Promise<Response> => {
  try {
    const user: User = await UserService.giveAdminPermission(Number(req.params.id));
    return res.status(200).send(user);
  } catch (error) {
    const e = error as Error;
    return res.status(400).json({ error: e.message });
  }
};

const removeAdminPermission = async (req: Request, res: Response): Promise<Response> => {
  try {
    const user: User = await UserService.removeAdminPermission(Number(req.params.id));
    return res.status(200).send(user);
  } catch (error) {
    const e = error as Error;
    return res.status(400).json({ error: e.message });
  }
};

const active = async (req: Request, res: Response): Promise<Response> => {
  try {
    const user: User = await UserService.active(Number(req.params.id));
    return res.status(200).send(user);
  } catch (error) {
    const e = error as Error;
    return res.status(400).json({ error: e.message });
  }
};

const login = async (req: Request, res: Response): Promise<Response> => {
  try {
    const logged: User = await UserService.login(req.body);
    const token = jwt.sign({
      user: logged.get('id'),
      role: logged.get('type'),
    }, secret.auth, {
      expiresIn: '2d',
    });
    return res.status(200).send({
      token,
      user: logged,
    });
  } catch (error) {
    console.log(error);
    const e = error as Error;
    return res.status(400).json({ error: e.message });
  }
};

const checkUser = async (req: any, res: Response): Promise<Response> => {
  try {
    return res.status(200).send(req.auth);
  } catch (error) {
    return res.status(400).send();
  }
};

router.route('/login')
  .post(login);

router.route('/')
  .post(create);

router.use('/', authorized);

router.route('/check-user')
  .post(checkUser);

router.route('/')
  .get(listAll);

router.route('/pending')
  .get(listPending);

router.route('/approved')
  .get(listApproved);

router.route('/clients')
  .get(listClients);

router.route('/admins')
  .get(listAdmins);

router.route('/:id')
  .put(update)
  .patch(active);

router.route('/:id/password')
  .put(password);

router.route('/:id/approve')
  .put(approve);

router.route('/:id/active')
  .patch(active);

router.route('/:id/cancel')
  .put(cancel);

router.route('/:id/admin')
  .put(giveAdminPermission);

router.route('/:id/client')
  .put(removeAdminPermission);

export default router;
