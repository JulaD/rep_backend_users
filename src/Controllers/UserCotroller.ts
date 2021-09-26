import { Request, Response, Router } from 'express';
import { User } from '../models/users.model';
import Paginator from '../interfaces/paginator.interface';
import UserService from '../Services/UserService';

const router = Router();

const list = async (req: Request, res: Response): Promise<Response> => {
  try {
    const users: Paginator<User> = await UserService
      .list(Number(req.query.limit), Number(req.query.offset));
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
    const user: User = await UserService.approve(Number(req.params.id), req.body);
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

router.route('/')
  .get(list)
  .post(create);

router.route('/:id')
  .put(update)
  .patch(active);

router.route('/:id/password')
  .put(password);

router.route('/:id/approve')
  .put(approve);

router.route('/:id/active')
  .patch(active);

export default router;
