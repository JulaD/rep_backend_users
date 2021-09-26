"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Controllers_1 = require("./Controllers");
const router = (0, express_1.Router)();
router.get('/', (req, res) => {
    res.send('Hey! This is REPP API, you can go to /api-docs to learn more!');
});
router.use('/users', Controllers_1.UserController);
exports.default = router;
//# sourceMappingURL=routes.js.map