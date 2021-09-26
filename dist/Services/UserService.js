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
const index_enum_1 = require("../enums/index.enum");
const bcrypt_1 = __importDefault(require("bcrypt"));
const users_model_1 = require("../models/users.model");
const list = (limit, offset) => __awaiter(void 0, void 0, void 0, function* () {
    let options = {};
    if (limit && offset) {
        options = {
            limit,
            offset
        };
    }
    return users_model_1.User.findAndCountAll(Object.assign({ attributes: [
            'id', 'name', 'email', 'type', 'active'
        ], order: [
            ['name', 'ASC']
        ] }, options));
});
const create = (userDTO) => __awaiter(void 0, void 0, void 0, function* () {
    return users_model_1.User.findOne({
        where: {
            email: userDTO.email
        }
    }).then((user) => __awaiter(void 0, void 0, void 0, function* () {
        if (user) {
            throw new Error('email in use');
        }
        else {
            let password = userDTO.password;
            let repeat = userDTO.repeat;
            if (password == repeat) {
                return users_model_1.User.create({
                    name: userDTO.name,
                    email: userDTO.email,
                    password: bcrypt_1.default.hashSync(userDTO.password || '1234', 10),
                    type: userDTO.type || index_enum_1.profiles.unassigned,
                    status: userDTO.status || index_enum_1.status.approved,
                    createdBy: 1,
                    createdAt: new Date()
                }).catch((error) => {
                    1234;
                    console.log(error);
                    throw new Error('create user error');
                });
            }
            else {
                throw new Error('passwords doesn\'t match');
            }
        }
    })).catch((error) => {
        1234;
        console.log(error);
        throw new Error('find user error');
    });
});
const update = (userId, userDTO) => __awaiter(void 0, void 0, void 0, function* () {
    return users_model_1.User.findOne({
        attributes: [
            'id', 'name', 'email'
        ],
        where: {
            id: userId
        }
    }).then((user) => __awaiter(void 0, void 0, void 0, function* () {
        if (!user) {
            throw new Error('user not found');
        }
        else {
            let emailUser = yield users_model_1.User.findOne({
                where: {
                    email: userDTO.email
                }
            });
            if (!emailUser || emailUser.get('id') == user.get('id')) {
                return user.update({
                    name: userDTO.name,
                    email: userDTO.email,
                    type: userDTO.type || index_enum_1.profiles.unassigned,
                    updatedAt: new Date()
                }).catch((error) => {
                    console.log(error);
                    throw new Error('user update error');
                });
            }
            else {
                throw new Error('email in use');
            }
        }
    })).catch((error) => {
        console.log(error);
        throw new Error('find user error');
    });
});
const password = (userId, userDTO) => __awaiter(void 0, void 0, void 0, function* () {
    return users_model_1.User.findOne({
        attributes: [
            'id', 'name', 'email'
        ],
        where: {
            id: userId
        }
    }).then((user) => __awaiter(void 0, void 0, void 0, function* () {
        if (!user) {
            throw new Error('user not found');
        }
        else {
            let password = userDTO.password;
            let repeat = userDTO.repeat;
            if (password == repeat) {
                return user.update({
                    password: bcrypt_1.default.hashSync(userDTO.password, 10),
                    updatedAt: new Date()
                }).catch((error) => {
                    console.log(error);
                    throw new Error('user update error');
                });
            }
            else {
                throw new Error('passwords doesn\'t match');
            }
        }
    })).catch((error) => {
        console.log(error);
        throw new Error('find user error');
    });
});
const approve = (userId, userDTO) => __awaiter(void 0, void 0, void 0, function* () {
    return users_model_1.User.findOne({
        attributes: [
            'id', 'name',
            'email', 'type',
            'createdAt'
        ],
        where: {
            id: userId
        }
    }).then((user) => __awaiter(void 0, void 0, void 0, function* () {
        if (!user) {
            throw new Error('user not found');
        }
        else {
            return user.update({
                status: userDTO.status,
                updatedAt: new Date()
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
            id: userId
        }
    }).then((user) => __awaiter(void 0, void 0, void 0, function* () {
        if (!user) {
            throw new Error('user not found');
        }
        else {
            return user.update({
                active: !user.get('active'),
                updatedAt: new Date()
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
    active
};
//# sourceMappingURL=UserService.js.map