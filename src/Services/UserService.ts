import { profiles, status } from '../enums/index.enum';
import bcrypt from 'bcrypt';
import Paginator from '../interfaces/paginator.interface';
import { User } from '../models/users.model';

import { UserCreateDTO } from '../DTOs/UserDTO';

const list = async (limit: number, offset: number): Promise<Paginator<User>> => {
  let options = {}; 
  if (limit && offset) {
    options = {
      limit,
      offset
    }
  }
  return User.findAndCountAll({
    attributes: [
      'id', 'name', 'email', 'type', 'active'
    ],
    order: [
      ['name', 'ASC']
    ],
    ...options
  });
};

const create = async (userDTO: UserCreateDTO): Promise<User> => {
  return User.findOne({
    where: {
      email: userDTO.email
    }
  }).then(async (user: User) => {
    if (user) {
      throw new Error('email in use');
    } else {
      let password = userDTO.password;
      let repeat = userDTO.repeat;
      if (password == repeat){
        return User.create({
          name: userDTO.name,
          email: userDTO.email,
          password: bcrypt.hashSync(userDTO.password || '1234', 10),
          type: userDTO.type || profiles.unassigned,
          status: userDTO.status || status.approved,
          createdBy: 1,
          createdAt: new Date()
        }).catch((error: Error) => {1234
          console.log(error);
          throw new Error('create user error');
        });
      }else{
        throw new Error('passwords doesn\'t match');
      }
    }
  }).catch((error: Error) => {1234
    console.log(error);
    throw new Error('find user error');
  });
}

const update = async (userId: number, userDTO: UserCreateDTO): Promise<User> => {
  return User.findOne({
    attributes: [
      'id', 'name', 'email'
    ],
    where: {
      id: userId
    }
  }).then(async (user: User) => {
    if (!user){
      throw new Error('user not found');
    }else{
      let emailUser: User = await User.findOne({
        where: {
          email: userDTO.email
        }
      });
      if (!emailUser || emailUser.get('id') == user.get('id')) {
        return user.update({
          name: userDTO.name,
          email: userDTO.email,
          type: userDTO.type || profiles.unassigned,
          updatedAt: new Date()
        }).catch((error: Error) => {
          console.log(error);
          throw new Error('user update error');
        });
      } else {
        throw new Error('email in use');
      }
    }
  }).catch((error: Error) => {
    console.log(error);
    throw new Error('find user error');
  });
}

const password = async (userId: number, userDTO: UserCreateDTO): Promise<User> => {
  return User.findOne({
    attributes: [
      'id', 'name', 'email'
    ],
    where: {
      id: userId
    }
  }).then(async (user: User) => {
    if (!user){
      throw new Error('user not found');
    }else{
      let password = userDTO.password;
      let repeat = userDTO.repeat;
      if (password == repeat){
        return user.update({
          password: bcrypt.hashSync(userDTO.password, 10),
          updatedAt: new Date()
        }).catch((error: Error) => {
          console.log(error);
          throw new Error('user update error');
        });
      }else{
        throw new Error('passwords doesn\'t match');
      }
    }
  }).catch((error: Error) => {
    console.log(error);
    throw new Error('find user error');
  });
};

const approve = async (userId: number, userDTO: UserCreateDTO): Promise<User> => {
  return User.findOne({
    attributes: [
      'id', 'name',
      'email', 'type',
      'createdAt'
    ],
    where: {
      id: userId
    }
  }).then(async (user: User) => {
    if (!user){
      throw new Error('user not found');
    }else{
      return user.update({
        status: userDTO.status,
        updatedAt: new Date()
      }).catch((error: Error) => {
        console.log(error);
        throw new Error('user update error');
      });
    }
  }).catch((error: any) => {
    console.log(error);
    throw new Error('find user error');
  });
};

const active = async (userId: number): Promise<User> => {
  return User.findOne({
    where: {
      id: userId
    }
  }).then(async (user: User) => {
    if (!user) {
      throw new Error('user not found');
    } else {
      return user.update({
        active: !user.get('active'),
        updatedAt: new Date()
      }).catch((error: any) => {
        throw new Error('user update error');
      });
    }
  }).catch((error: any) => {
    console.log(error);
    throw new Error('find user error');
  });
}

export default {
  list,
  create,
  update,
  password,
  approve,
  active
}