"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-console */
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const cors_1 = __importDefault(require("cors"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const routes_1 = __importDefault(require("./routes"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// swagger init
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'REPP Rest API',
            version: '1.0.0',
            description: '',
            servers: ['http://localhost:3000'],
        },
    },
    apis: ['src/routes.ts'],
};
const swaggerDocs = (0, swagger_jsdoc_1.default)(swaggerOptions);
// middlewares
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocs));
app.use(express_1.default.json({
    limit: '50mb',
}));
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cors_1.default)({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
}));
app.use(express_1.default.raw({
    limit: '50mb',
}));
app.use(routes_1.default);
app.listen(PORT, () => {
    console.log(`REPP Backend running here 👉 https://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map