"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const index_enum_1 = require("../enums/index.enum");
const environments = __importStar(require("../config/config"));
const sequelize_1 = require("sequelize");
const current = process.env.NODE_ENV || 'development';
let config = environments[current];
let sequelize = new sequelize_1.Sequelize(config.database, config.username, config.password, config);
class User extends sequelize_1.Model {
}
exports.User = User;
User.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true
    },
    email: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
        unique: true
    },
    password: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false
    },
    type: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    token: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true
    },
    status: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        validate: {
            isIn: {
                args: [[
                        String(index_enum_1.status.pending),
                        String(index_enum_1.status.approved),
                        String(index_enum_1.status.rejected)
                    ]],
                msg: 'invalid status'
            }
        }
    },
    active: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true
    },
    createdBy: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    updatedBy: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true
    },
    deletedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true
    }
}, {
    sequelize,
    modelName: 'User'
});
//# sourceMappingURL=users.model.js.map