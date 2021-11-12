/* eslint-disable no-console */
import express, { Application } from 'express';
import 'dotenv/config';
import cors from 'cors';
import swaggerJsDoc, { Options } from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import Routes from './routes';
import { User } from './models/users.model';

const app: Application = express();
const PORT = process.env.PORT || 3000;

// swagger init
const swaggerOptions: Options = {
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
const swaggerDocs = swaggerJsDoc(swaggerOptions);

// middlewares
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(express.json({
  limit: '50mb',
}));
app.use(express.urlencoded({ extended: false }));
app.use(cors({
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
}));

app.use(express.raw({
  limit: '50mb',
}));

User.sync();

app.use(Routes);

app.listen(PORT, (): void => {
  console.log(`REPP Users Module running here 👉 https://localhost:${PORT}`);
});
