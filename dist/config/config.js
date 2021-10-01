"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.development = void 0;
require('dotenv').config();
exports.development = {
    username: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB,
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
};
//# sourceMappingURL=config.js.map