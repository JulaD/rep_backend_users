import { Request, Response, Router } from 'express';
import jwt from 'jsonwebtoken';
import MailerService from '../Services/MailerService';
import { User } from '../models/users.model';
import Paginator from '../interfaces/paginator.interface';
import UserService from '../Services/UserService';
import { secret } from '../config/config';
import { authorized } from '../middlewares/token.middleware';

const legit = require('legit');

const router = Router();

const listUsers = async (req: Request, res: Response): Promise<Response> => {
  try {
    let users: Paginator<User>;
    if (req.query.type !== null) {
      if (req.query.type === 'pending') {
        users = await UserService
          .listPending(Number(req.query.limit), Number(req.query.offset), String(req.query.search));
      } else if (req.query.type === 'approved') {
        users = await UserService
          .listApproved(
            Number(req.query.limit), Number(req.query.offset), String(req.query.search),
          );
      } else if (req.query.type === 'clients') {
        users = await UserService
          .listClients(Number(req.query.limit), Number(req.query.offset), String(req.query.search));
      } else if (req.query.type === 'admins') {
        users = await UserService
          .listAdmins(Number(req.query.limit), Number(req.query.offset), String(req.query.search));
      } else {
        return res.status(400).json({ error: 'Invalid type' });
      }
    } else {
      users = await UserService
        .listAll(Number(req.query.limit), Number(req.query.offset));
    }
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
    console.log(e.message);
    if (e.message === '412') {
      res.status(412).json({ error: 'Email is taken' });
    } else if (e.message === '400') {
      res.status(400).json({ error: 'Password too short' });
    } else {
      res.status(500).json({ error: 'Create user error' });
    }
    return res;
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
    MailerService.sendApprovedEmail(user.toJSON().email);
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
    const e = error as Error;
    if (e.message === '404') {
      res.status(404).json({ error: 'User not found' });
    } else if (e.message === '401') {
      res.status(401).json({ error: 'Unauthorized' });
    } else {
      res.status(400).json({ error: 'Auth failed' });
    }
    return res;
  }
};

const checkUser = async (req: any, res: Response): Promise<Response> => {
  try {
    return res.status(200).send(req.auth);
  } catch (error) {
    return res.status(400).send();
  }
};

const validate = async (req: Request, res: Response): Promise<Response> => {
  const { token } = req.body;
  if (token) {
    jwt.verify(token, secret.auth, (error: Error, decoded: {user: number; role: number}) => {
      if (error) {
        const message = 'Invalid token';
        return res.status(401).send({ message });
      }
      const userId = decoded.user;
      return res.status(200).send({ userId });
    });
  } else {
    return res.status(400).send('auth token not supplied');
  }
  return res.status(500).send();
};

const listUsersById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { userIds } = req.body;
    const users = await UserService.listUsersById(userIds);
    return res.status(200).send(users);
  } catch (error) {
    const e = error as Error;
    return res.status(400).json({ error: e.message });
  }
};

const getUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId = Number(req.params.id);
    const user: User = await UserService.getUser(userId);
    return res.status(200).send(user);
  } catch (error) {
    const e = error as Error;
    return res.status(400).json({ error: e.message });
  }
};

const resendVerifyEmail = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email } = req.body;
    await UserService.resendVerifyEmail(email);
    return res.status(200).send({ message: 'Se ha enviado un mail de verificacion su correo' });
  } catch (error) {
    const e = error as Error;
    return res.status(400).json({ error: e.message });
  }
};

const recoverPassword = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email } = req.body;
    UserService.recoverPassword(email);
    return res.status(200).send({ message: 'Se ha enviado a su email un mensaje para recuperar la contraseña' });
  } catch (error) {
    const e = error as Error;
    return res.status(400).json({ error: e.message });
  }
};

const sendEmail = async (req: Request, res: Response) => {
  try {
    /* let exists = false;
    await legit('agusruizdiazcambon@hotmail.com').then((result: any) => {
      exists = result.isValid;
    }).catch((error: Error) => {
      throw new Error(error.message);
    }); */
    const exists: boolean = await MailerService.checkMailAddress('agustin.ruiz.diaz@fing.edu.uy');
    if (!exists) {
      return res.status(500).send({ nop: 'no existe capo' });
    }
    return res.status(200).send({ lpm: 'lpm' });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const verifyEmail = async (req: Request, res: Response) => {
  try {
    const token = String(req.query.token);
    if (token) {
      await UserService.activeEmail(token);
    } else {
      throw new Error('Cannot parse token');
    }
    return res.status(200).send({ message: 'User email verified.' });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

router.route('/login')
  .post(login);

router.route('/')
  .post(create);

router.post('/validate', validate);

router.use('/', authorized);

router.route('/check-user')
  .post(checkUser);

router.route('/')
  .get(listUsers);

router.route('/:id')
  .get(getUser)
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

router.route('/usersById')
  .post(listUsersById);

router.route('/verifyEmail').put(verifyEmail);

router.route('/mail')
  .get(sendEmail);

export default router;
