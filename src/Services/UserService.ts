import bcrypt from 'bcrypt';
import { Op, where } from 'sequelize';
import jwt from 'jsonwebtoken';
import { secret } from '../config/config';
import { profiles, status } from '../enums/index.enum';
import Paginator from '../interfaces/paginator.interface';
import { User } from '../models/users.model';
import {
  UserCreateDTO, UserDTO, UserLoginDTO, UserUpdateDTO,
} from '../DTOs/UserDTO';
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
  paranoid: false,
}).then(async (user: User) => {
  if (user) {
    if (user.isSoftDeleted()) {
      if (!MailerService.checkMailAddress(userDTO.email)) {
        throw new Error('Invalid email address');
      }
      if (userDTO.password.length < 6) {
        throw new Error('400');
      }
      await user.restore();
      user.update({
        name: userDTO.name,
        organization: userDTO.organization,
        password: bcrypt.hashSync(userDTO.password, 10),
        type: profiles.client,
        status: status.pending,
        updatedAt: new Date(),
        active: false,
      });
      const restored = user;
      const tkn = jwt.sign({
        id: restored.toJSON().id,
        email: restored.toJSON().email,
      }, secret.auth, {
        expiresIn: '14d',
      });
      restored.token = tkn;
      await restored.save();
      MailerService.sendVerifyEmail(userDTO.email, tkn);
      restored.toJSON();
      return restored;
    }
    throw new Error('412');

    // email is taken
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
        console.error(error);
        // create user error
        throw new Error('500');
      });
      const tkn = jwt.sign({
        id: newUser.toJSON().id,
        email: newUser.toJSON().email,
      }, secret.auth, {
        expiresIn: '14d',
      });
      newUser.token = tkn;
      await newUser.save();
      MailerService.sendVerifyEmail(userDTO.email, tkn);
      newUser.toJSON();

      return newUser;
    }
    // password too short
    throw new Error('400');
  }
}).catch((error: Error) => {
  console.error(error);
  throw error;
});

const update = async (userId: number, userDTO: UserUpdateDTO): Promise<User> => User.findOne({
  attributes: [
    'id', 'name', 'email',
  ],
  where: {
    id: userId,
  },
}).then(async (user: User) => {
  if (!user) {
    throw new Error('user not found');
  } else if (userDTO.password && userDTO.password.length >= 6) {
    if (userDTO.password === userDTO.repeat) {
      return user.update({
        name: userDTO.name,
        organization: userDTO.organization,
        password: bcrypt.hashSync(userDTO.password, 10),
        updatedAt: new Date(),
      }).catch((error: Error) => {
        console.error(error);
        throw new Error('user update error');
      });
    }
    throw new Error('passwords dont match');
  } else {
    return user.update({
      name: userDTO.name,
      organization: userDTO.organization,
      updatedAt: new Date(),
    }).catch((error: Error) => {
      console.error(error);
      throw new Error('user update error');
    });
  }
}).catch((error: Error) => {
  console.error(error);
  throw new Error('find user error');
});

// const password = async (userId: number, userDTO: UserCreateDTO): Promise<User> => User.findOne({
//   attributes: [
//     'id', 'name', 'email',
//   ],
//   where: {
//     id: userId,
//   },
// }).then(async (user: User) => {
//   if (!user) {
//     throw new Error('user not found');
//   } else {
//     return user.update({
//       password: bcrypt.hashSync(userDTO.password, 10),
//       updatedAt: new Date(),
//     }).catch((error: Error) => {
//       console.log(error);
//       throw new Error('user update error');
//     });
//   }
// }).catch((error: Error) => {
//   console.log(error);
//   throw new Error('find user error');
// });

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
      console.error(error);
      throw new Error('user update error');
    });
  }
}).catch((error: Error) => {
  console.error(error);
  throw new Error('find user error');
});

const cancel = async (userId: number): Promise<User> => User.findOne({
  attributes: [
    'id', 'name',
    'email', 'type',
    'status',
    'createdAt',
  ],
  where: {
    id: userId,
  },
}).then(async (user: User) => {
  if (!user) {
    throw new Error('user not found');
  } else {
    // If alredy pending then delete it (soft delete)
    if (user.toJSON().status === status.pending) {
      user.destroy();
      return user;
    }
    return user.update({
      status: status.pending,
      type: profiles.client,
      updatedAt: new Date(),
    }).catch((error: Error) => {
      console.error(error);
      throw new Error('user update error');
    });
  }
}).catch((error: Error) => {
  console.error(error);
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
      console.error(error);
      throw new Error('user update error');
    });
  }
}).catch((error: Error) => {
  console.error(error);
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
      console.error(error);
      throw new Error('user update error');
    });
  }
}).catch((error: Error) => {
  console.error(error);
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
      console.error(error);
      throw new Error('user update error');
    });
  }
}).catch((error: Error) => {
  console.error(error);
  throw new Error('find user error');
});

const login = async (userDTO: UserLoginDTO): Promise<User> => User.findOne({
  attributes: [
    'id', 'name', 'email', 'organization', 'password',
    'type', 'status', 'active', 'createdAt',
  ],
  where: {
    email: userDTO.email,
  },
}).then((user: User) => {
  if (!user) {
    // user nor found
    throw new Error('404');
  } else if (user.get('status') === status.pending || user.get('active') === false) {
    // unauthorized
    throw new Error('401');
  } else if (user && bcrypt.compareSync(userDTO.password, String(user.get('password')))) {
    return user;
  } else {
    // generic error
    throw new Error('400');
  }
}).catch((error: Error) => {
  throw error;
});

const listUsersById = async (ids: number[]): Promise<User[]> => {
  const users = User.findAll({
    attributes: [
      'id', 'name', 'email', 'organization', 'type',
    ],
    where: { id: { [Op.in]: ids } },
  });
  return users;
};

const getUser = async (id: number): Promise<User> => User.findOne({
  attributes: ['id', 'name', 'organization'],
  where: {
    id,
    deletedAt: null,
  },
});

const getActiveUser = async (id: number): Promise<User> => User.findOne({
  attributes: ['id', 'name', 'organization'],
  where: {
    id,
    deletedAt: null,
    active: true,
  },
});

const getUserWithToken = async (id: number): Promise<User> => User.findOne({
  attributes: ['id', 'name', 'organization', 'token'],
  where: {
    id,
    deletedAt: null,
  },
});

const activeEmail = async (userToken: string): Promise<void> => {
  let id: number;
  jwt.verify(userToken, secret.auth, (error: Error, decoded: {id: number; email: string}) => {
    if (error) {
      const e = error as Error;
      throw e;
    } else {
      id = decoded.id;
    }
  });
  const user: User = await getUserWithToken(id);
  if (user.token === userToken) {
    user.update({
      active: true,
      updatedAt: new Date(),
    }).catch((error: Error) => {
      throw new Error('user update error');
    });
  }
};

const resendVerifyEmail = async (emailAddress: string) => {
  const user = await User.findOne({ where: { email: emailAddress } });
  if (user === null) {
    throw new Error('El email ingresado no se encuentra registrado en el sistema');
  }
  const userDTO: UserDTO = user.toJSON();
  if (userDTO.active) {
    throw new Error('Su cuenta ya ha sido verificada');
  }
  const token = jwt.sign({
    id: userDTO.id,
    email: userDTO.email,
  }, secret.auth, {
    expiresIn: '14d',
  });
  await user.update({
    token,
  });

  MailerService.sendVerifyEmail(userDTO.email, token);
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
  const token = jwt.sign({
    id: userDTO.id,
    email: userDTO.email,
  }, secret.auth, {
    expiresIn: '14d',
  });
  await user.update({
    token,
  });

  MailerService.sendRecoverEmail(userDTO.email, token);
};

const updatePassword = async (token: string, userPassword: string): Promise<void> => {
  let idUser: number;
  jwt.verify(token, secret.auth, (error: Error, decoded: {id: number; email: string}) => {
    if (error) {
      const e = error as Error;
      throw e;
    } else {
      idUser = decoded.id;
    }
  });
  const user = await User.findOne({ where: { id: idUser } });
  user.update({
    password: bcrypt.hashSync(userPassword, 10),
    updatedAt: new Date(),
  }).catch((error: Error) => {
    console.log(error);
    throw new Error('user update error');
  });

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
  // password,
  approve,
  cancel,
  active,
  giveAdminPermission,
  removeAdminPermission,
  login,
  listUsersById,
  getUser,
  getActiveUser,
  resendVerifyEmail,
  recoverPassword,
  activeEmail,
  updatePassword,
};
