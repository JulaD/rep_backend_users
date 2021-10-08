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
const express_1 = require("express");
const UserService_1 = __importDefault(require("../Services/UserService"));
const router = (0, express_1.Router)();
const listAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield UserService_1.default
            .listAll(Number(req.query.limit), Number(req.query.offset));
        return res.status(200).send(users);
    }
    catch (error) {
        const e = error;
        return res.status(400).json({ error: e.message });
    }
});
const listPending = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield UserService_1.default
            .listPending(Number(req.query.limit), Number(req.query.offset), String(req.query.search));
        return res.status(200).send(users);
    }
    catch (error) {
        const e = error;
        return res.status(400).json({ error: e.message });
    }
});
const listApproved = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield UserService_1.default
            .listApproved(Number(req.query.limit), Number(req.query.offset), String(req.query.search));
        return res.status(200).send(users);
    }
    catch (error) {
        const e = error;
        return res.status(400).json({ error: e.message });
    }
});
const listClients = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield UserService_1.default
            .listClients(Number(req.query.limit), Number(req.query.offset), String(req.query.search));
        return res.status(200).send(users);
    }
    catch (error) {
        const e = error;
        return res.status(400).json({ error: e.message });
    }
});
const listAdmins = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield UserService_1.default
            .listAdmins(Number(req.query.limit), Number(req.query.offset), String(req.query.search));
        return res.status(200).send(users);
    }
    catch (error) {
        const e = error;
        return res.status(400).json({ error: e.message });
    }
});
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield UserService_1.default.create(req.body);
        return res.status(200).send(user);
    }
    catch (error) {
        const e = error;
        return res.status(400).json({ error: e.message });
    }
});
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield UserService_1.default.update(Number(req.params.id), req.body);
        return res.status(200).send(user);
    }
    catch (error) {
        const e = error;
        return res.status(400).json({ error: e.message });
    }
});
const password = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield UserService_1.default.password(Number(req.params.id), req.body);
        return res.status(200).send(user);
    }
    catch (error) {
        const e = error;
        return res.status(400).json({ error: e.message });
    }
});
const approve = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield UserService_1.default.approve(Number(req.params.id));
        return res.status(200).send(user);
    }
    catch (error) {
        const e = error;
        return res.status(400).json({ error: e.message });
    }
});
const cancel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield UserService_1.default.cancel(Number(req.params.id));
        return res.status(200).send(user);
    }
    catch (error) {
        const e = error;
        return res.status(400).json({ error: e.message });
    }
});
const giveAdminPermission = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield UserService_1.default.giveAdminPermission(Number(req.params.id));
        return res.status(200).send(user);
    }
    catch (error) {
        const e = error;
        return res.status(400).json({ error: e.message });
    }
});
const removeAdminPermission = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield UserService_1.default.removeAdminPermission(Number(req.params.id));
        return res.status(200).send(user);
    }
    catch (error) {
        const e = error;
        return res.status(400).json({ error: e.message });
    }
});
const active = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield UserService_1.default.active(Number(req.params.id));
        return res.status(200).send(user);
    }
    catch (error) {
        const e = error;
        return res.status(400).json({ error: e.message });
    }
});
router.route('/')
    .get(listAll)
    .post(create);
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
exports.default = router;
//# sourceMappingURL=UserCotroller.js.map