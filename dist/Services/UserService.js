"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const index_enum_1 = require("../enums/index.enum");
const users_model_1 = require("../models/users.model");
const list = (limit, offset) => __awaiter(void 0, void 0, void 0, function* () {
    let options = {};
    if (limit && offset) {
        options = {
            limit,
            offset,
        };
    }
    return users_model_1.User.findAndCountAll(Object.assign({ attributes: [
            'id', 'name', 'email', 'organization', 'type', 'status', 'active', 'createdAt',
        ], order: [
            ['createdAt', 'ASC'],
        ] }, options));
});
const create = (userDTO) => __awaiter(void 0, void 0, void 0, function* () {
    return users_model_1.User.findOne({
        where: {
            email: userDTO.email,
        },
    }).then((user) => __awaiter(void 0, void 0, void 0, function* () {
        if (user) {
            throw new Error('email is taken');
        }
        else {
            // se hace el checkeo antes porque luego se encripta
            if (userDTO.password.length >= 6) {
                const newUser = yield users_model_1.User.create({
                    name: userDTO.name,
                    email: userDTO.email,
                    organization: userDTO.organization,
                    password: bcrypt_1.default.hashSync(userDTO.password, 10),
                    type: index_enum_1.profiles.client,
                    status: index_enum_1.status.pending,
                    createdBy: 1,
                    createdAt: new Date(),
                }).catch((error) => {
                    console.log(error);
                    throw new Error('create user error');
                });
                newUser.toJSON();
                return newUser;
            }
            throw new Error('password too short');
        }
    })).catch((error) => {
        console.log(error);
        throw error;
    });
});
const update = (userId, userDTO) => __awaiter(void 0, void 0, void 0, function* () {
    return users_model_1.User.findOne({
        attributes: [
            'id', 'name', 'email',
        ],
        where: {
            id: userId,
        },
    }).then((user) => __awaiter(void 0, void 0, void 0, function* () {
        if (!user) {
            throw new Error('user not found');
        }
        else {
            const emailUser = yield users_model_1.User.findOne({
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
                }).catch((error) => {
                    console.log(error);
                    throw new Error('user update error');
                });
            }
            throw new Error('email in use');
        }
    })).catch((error) => {
        console.log(error);
        throw new Error('find user error');
    });
});
const password = (userId, userDTO) => __awaiter(void 0, void 0, void 0, function* () {
    return users_model_1.User.findOne({
        attributes: [
            'id', 'name', 'email',
        ],
        where: {
            id: userId,
        },
    }).then((user) => __awaiter(void 0, void 0, void 0, function* () {
        if (!user) {
            throw new Error('user not found');
        }
        else {
            return user.update({
                password: bcrypt_1.default.hashSync(userDTO.password, 10),
                updatedAt: new Date(),
            }).catch((error) => {
                console.log(error);
                throw new Error('user update error');
            });
        }
    })).catch((error) => {
        console.log(error);
        throw new Error('find user error');
    });
});
const approve = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return users_model_1.User.findOne({
        attributes: [
            'id', 'name',
            'email', 'type',
            'createdAt',
        ],
        where: {
            id: userId,
        },
    }).then((user) => __awaiter(void 0, void 0, void 0, function* () {
        if (!user) {
            throw new Error('user not found');
        }
        else {
            return user.update({
                status: index_enum_1.status.approved,
                updatedAt: new Date(),
            }).catch((error) => {
                console.log(error);
                throw new Error('user update error');
            });
        }
    })).catch((error) => {
        console.log(error);
        throw new Error('find user error');
    });
});
const cancel = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return users_model_1.User.findOne({
        attributes: [
            'id', 'name',
            'email', 'type',
            'createdAt',
        ],
        where: {
            id: userId,
        },
    }).then((user) => __awaiter(void 0, void 0, void 0, function* () {
        if (!user) {
            throw new Error('user not found');
        }
        else {
            return user.update({
                status: index_enum_1.status.pending,
                updatedAt: new Date(),
            }).catch((error) => {
                console.log(error);
                throw new Error('user update error');
            });
        }
    })).catch((error) => {
        console.log(error);
        throw new Error('find user error');
    });
});
const active = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return users_model_1.User.findOne({
        where: {
            id: userId,
        },
    }).then((user) => __awaiter(void 0, void 0, void 0, function* () {
        if (!user) {
            throw new Error('user not found');
        }
        else {
            return user.update({
                active: !user.get('active'),
                updatedAt: new Date(),
            }).catch((error) => {
                throw new Error('user update error');
            });
        }
    })).catch((error) => {
        console.log(error);
        throw new Error('find user error');
    });
});
exports.default = {
    list,
    create,
    update,
    password,
    approve,
    cancel,
    active,
};
//# sourceMappingURL=UserService.js.map