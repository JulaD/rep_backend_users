require('dotenv').config();

export const development = {
  username: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
  host: 'localhost',
  dialect: 'mysql',
  logging: false,
  timezone: '-03:00',
};

export const secret = {
  auth: 'HN$t@2*?mDusFsT!',
};

export const mail = {
  emailAccount: process.env.EMAIL_ACCOUNT,
  emailPassword: process.env.EMAIL_PASSWORD,
  frontend: process.env.FRONTEND,
};
