import bcrypt from 'bcrypt';
import { Op, where } from 'sequelize';
import jwt from 'jsonwebtoken';
import { secret } from '../config/config';
import { profiles, status } from '../enums/index.enum';
import Paginator from '../interfaces/paginator.interface';
import { User } from '../models/users.model';
import { UserCreateDTO, UserDTO, UserLoginDTO } from '../DTOs/UserDTO';
import MailerService from './MailerService';

const listPending = async (limit: number, offset: number,
  search: string): Promise<Paginator<User>> => {
  let options = {};
  if (limit >= 1 && offset >= 0) {
    if (search && search !== '') {
      options = {
        where: {
          status: status.pending,
          [Op.or]: [
            { name: { [Op.substring]: search } },
            { email: { [Op.substring]: search } },
          ],
        },
        limit,
        offset,
      };
    } else {
      options = {
        where: {
          status: status.pending,
        },
        limit,
        offset,
      };
    }
  }
  return User.findAndCountAll({
    attributes: [
      'id', 'name', 'email', 'organization', 'type', 'status', 'active', 'createdAt',
    ],
    order: [
      ['createdAt', 'ASC'],
    ],
    ...options,
  });
};

const listApproved = async (limit: number, offset: number,
  search: string): Promise<Paginator<User>> => {
  let options = {};
  if (limit >= 1 && offset >= 0) {
    if (search && search !== '') {
      options = {
        where: {
          status: status.approved,
          [Op.or]: [
            { name: { [Op.substring]: search } },
            { email: { [Op.substring]: search } },
          ],
        },
        limit,
        offset,
      };
    } else {
      options = {
        where: {
          status: status.approved,
        },
        limit,
        offset,
      };
    }
  }
  return User.findAndCountAll({
    attributes: [
      'id', 'name', 'email', 'organization', 'type', 'status', 'active', 'createdAt',
    ],
    order: [
      ['createdAt', 'ASC'],
    ],
    ...options,
  });
};

const listClients = async (limit: number, offset: number,
  search: string): Promise<Paginator<User>> => {
  let options = {};
  if (limit >= 1 && offset >= 0) {
    if (search && search !== '') {
      options = {
        where: {
          status: status.approved,
          type: profiles.client,
          [Op.or]: [
            { name: { [Op.substring]: search } },
            { email: { [Op.substring]: search } },
          ],
        },
        limit,
        offset,
      };
    } else {
      options = {
        where: {
          status: status.approved,
          type: profiles.client,
        },
        limit,
        offset,
      };
    }
  }
  return User.findAndCountAll({
    attributes: [
      'id', 'name', 'email', 'organization', 'type', 'status', 'active', 'createdAt',
    ],
    order: [
      ['createdAt', 'ASC'],
    ],
    ...options,
  });
};

const listAdmins = async (limit: number, offset: number,
  search: string): Promise<Paginator<User>> => {
  let options = {};
  if (limit >= 1 && offset >= 0) {
    if (search && search !== '') {
      options = {
        where: {
          status: status.approved,
          type: profiles.administrator,
          [Op.or]: [
            { name: { [Op.substring]: search } },
            { email: { [Op.substring]: search } },
          ],
        },
        limit,
        offset,
      };
    } else {
      options = {
        where: {
          status: status.approved,
          type: profiles.administrator,
        },
        limit,
        offset,
      };
    }
  }
  return User.findAndCountAll({
    attributes: [
      'id', 'name', 'email', 'organization', 'type', 'status', 'active', 'createdAt',
    ],
    order: [
      ['createdAt', 'ASC'],
    ],
    ...options,
  });
};

const listAll = async (limit: number, offset: number): Promise<Paginator<User>> => {
  let options = {};
  if (limit >= 1 && offset >= 0) {
    options = {
      limit,
      offset,
    };
  }
  return User.findAndCountAll({
    attributes: [
      'id', 'name', 'email', 'organization', 'type', 'status', 'active', 'createdAt',
    ],
    order: [
      ['createdAt', 'ASC'],
    ],
    ...options,
  });
};

const create = async (userDTO: UserCreateDTO): Promise<User> => User.findOne({
  where: {
    email: userDTO.email,
  },
}).then(async (user: User) => {
  if (user) {
    throw new Error('email is taken');
  } else {
    if (!MailerService.checkMailAddress(userDTO.email)) {
      throw new Error('Invalid email address');
    }
    // se hace el checkeo antes porque luego se encripta
    if (userDTO.password.length >= 6) {
      const newUser: User = await User.create({
        name: userDTO.name,
        email: userDTO.email,
        organization: userDTO.organization,
        password: bcrypt.hashSync(userDTO.password, 10),
        type: profiles.client,
        status: status.pending,
        createdBy: 1,
        createdAt: new Date(),
        active: false,
      }).catch((error: Error) => {
        console.log(error);
        throw new Error('create user error');
      });
      const tkn = jwt.sign({
        user: newUser.toJSON().id,
        email: newUser.toJSON().email,
      }, secret.auth, {
        expiresIn: '2d',
      });
      newUser.token = tkn;
      newUser.save();
      MailerService.sendVerifyEmail(userDTO.email, tkn);
      newUser.toJSON();

      return newUser;
    }
    throw new Error('password too short');
  }
}).catch((error: Error) => {
  console.log(error);
  throw error;
});

const update = async (userId: number, userDTO: UserCreateDTO): Promise<User> => User.findOne({
  attributes: [
    'id', 'name', 'email',
  ],
  where: {
    id: userId,
  },
}).then(async (user: User) => {
  if (!user) {
    throw new Error('user not found');
  } else {
    const emailUser: User = await User.findOne({
      where: {
        email: userDTO.email,
      },
    });
    if (!emailUser || emailUser.get('id') === user.get('id')) {
      return user.update({
        name: userDTO.name,
        email: userDTO.email,
        organization: userDTO.organization,
        updatedAt: new Date(),
      }).catch((error: Error) => {
        console.log(error);
        throw new Error('user update error');
      });
    }
    throw new Error('email in use');
  }
}).catch((error: Error) => {
  console.log(error);
  throw new Error('find user error');
});

const password = async (userId: number, userDTO: UserCreateDTO): Promise<User> => User.findOne({
  attributes: [
    'id', 'name', 'email',
  ],
  where: {
    id: userId,
  },
}).then(async (user: User) => {
  if (!user) {
    throw new Error('user not found');
  } else {
    return user.update({
      password: bcrypt.hashSync(userDTO.password, 10),
      updatedAt: new Date(),
    }).catch((error: Error) => {
      console.log(error);
      throw new Error('user update error');
    });
  }
}).catch((error: Error) => {
  console.log(error);
  throw new Error('find user error');
});

const approve = async (userId: number): Promise<User> => User.findOne({
  attributes: [
    'id', 'name',
    'email', 'type',
    'createdAt',
  ],
  where: {
    id: userId,
  },
}).then(async (user: User) => {
  if (!user) {
    throw new Error('user not found');
  } else {
    return user.update({
      status: status.approved,
      updatedAt: new Date(),
    }).catch((error: Error) => {
      console.log(error);
      throw new Error('user update error');
    });
  }
}).catch((error: Error) => {
  console.log(error);
  throw new Error('find user error');
});

const cancel = async (userId: number): Promise<User> => User.findOne({
  attributes: [
    'id', 'name',
    'email', 'type',
    'createdAt',
  ],
  where: {
    id: userId,
  },
}).then(async (user: User) => {
  if (!user) {
    throw new Error('user not found');
  } else {
    return user.update({
      status: status.pending,
      type: profiles.client,
      updatedAt: new Date(),
    }).catch((error: Error) => {
      console.log(error);
      throw new Error('user update error');
    });
  }
}).catch((error: Error) => {
  console.log(error);
  throw new Error('find user error');
});

const giveAdminPermission = async (userId: number): Promise<User> => User.findOne({
  attributes: [
    'id', 'name',
    'email', 'type',
    'createdAt',
  ],
  where: {
    id: userId,
  },
}).then(async (user: User) => {
  if (!user) {
    throw new Error('user not found');
  } else {
    return user.update({
      type: profiles.administrator,
      updatedAt: new Date(),
    }).catch((error: Error) => {
      console.log(error);
      throw new Error('user update error');
    });
  }
}).catch((error: Error) => {
  console.log(error);
  throw new Error('find user error');
});

const removeAdminPermission = async (userId: number): Promise<User> => User.findOne({
  attributes: [
    'id', 'name',
    'email', 'type',
    'createdAt',
  ],
  where: {
    id: userId,
  },
}).then(async (user: User) => {
  if (!user) {
    throw new Error('user not found');
  } else {
    return user.update({
      type: profiles.client,
      updatedAt: new Date(),
    }).catch((error: Error) => {
      console.log(error);
      throw new Error('user update error');
    });
  }
}).catch((error: Error) => {
  console.log(error);
  throw new Error('find user error');
});

const active = async (userId: number): Promise<User> => User.findOne({
  where: {
    id: userId,
  },
}).then(async (user: User) => {
  if (!user) {
    throw new Error('user not found');
  } else {
    return user.update({
      active: !user.get('active'),
      updatedAt: new Date(),
    }).catch((error: Error) => {
      throw new Error('user update error');
    });
  }
}).catch((error: Error) => {
  console.log(error);
  throw new Error('find user error');
});

const activeEmail = async (userToken: string): Promise<void> => {
  let id: number;
  jwt.verify(userToken, secret.auth, (error: Error, decoded: {id: number; type: number}) => {
    if (error) {
      const e = error as Error;
      throw e;
    } else {
      id = decoded.id;
    }
  });
};

const login = async (userDTO: UserLoginDTO): Promise<User> => User.findOne({
  attributes: [
    'id', 'name', 'email', 'organization', 'password',
    'type', 'status', 'active', 'createdAt',
  ],
  where: {
    email: userDTO.email,
    status: status.approved,
    active: true,
  },
}).then((user: User) => {
  if (!user) {
    throw new Error('user not found');
  } else if (user && bcrypt.compareSync(userDTO.password, String(user.get('password')))) {
    return user;
  } else {
    console.log('auth failed, credentials:', userDTO);
    throw new Error('auth failed');
  }
}).catch((error: Error) => {
  console.log(error);
  console.log('credentials:', userDTO);
  throw new Error('find user error');
});

const resendVerifyEmail = async (emailAddress: string) => {
  const user = await User.findOne({ where: { email: emailAddress } });
  if (user === null) {
    throw new Error('El email ingresado no se encuentra registrado en el sistema');
  }
  const userDTO: UserDTO = user.toJSON();
  if (userDTO.active) {
    throw new Error('Su cuenta ya ha sido verificada');
  }
  MailerService.sendVerifyEmail(userDTO.email, user.token);
};

const recoverPassword = async (emailAddress: string): Promise<void> => {
  const user = await User.findOne({ where: { email: emailAddress } });
  if (user === null) {
    throw new Error('El email ingresado no se encuentra registrado en el sistema');
  }
  const userDTO: UserDTO = user.toJSON();
  if (!userDTO.active) {
    throw new Error('Su cuenta no ha sido verificada');
  }
  MailerService.sendRecoverEmail(userDTO.email, user.token);
};

export default {
  listAll,
  listPending,
  listApproved,
  listClients,
  listAdmins,
  create,
  update,
  password,
  approve,
  cancel,
  active,
  giveAdminPermission,
  removeAdminPermission,
  login,
  resendVerifyEmail,
  recoverPassword,
};
