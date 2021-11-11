import nodemailer, { Transporter } from 'nodemailer';
import fs from 'fs';
import path from 'path';
import cheerio from 'cheerio';
import { html } from 'cheerio/lib/static';
import { mail } from '../config/config';

const legit = require('legit');

const { emailAccount, emailPassword, frontend } = mail;

// nodemailer transporter initialization
const transporter: Transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: emailAccount,
    pass: emailPassword,
  },
});

const checkMailAddress = async (email: string): Promise<boolean> => {
  // const emailValidator = new EmailValidator();

  let exists = false;
  await legit(email).then((result: any) => {
    exists = result.isValid;
  }).catch((error: Error) => {
    throw new Error(error.message);
  });

  return exists;
  // const { wellFormed, validDomain, validMailbox } = await emailValidator.verify(email);

  // return wellFormed && validDomain && validMailbox;
};

const sendVerifyEmail = (email: string, token: string): void => {
  // build html with token link to verify th email
  const pathToFile = path.join(__dirname, '../../verifyEmail.html');
  let body: string = fs.readFileSync(pathToFile, 'utf8').toString();
  const htmlToSend = cheerio.load(body);
  htmlToSend('a').each((index, value) => {
    const old_url = htmlToSend(value).attr('href');
    const url = `${frontend}/verify-email?token=${token}`;
    if (old_url === 'PutYourLinkHere') {
      htmlToSend(value).attr('href', url);
    }
    if (htmlToSend(value).attr('id') === 'linkEscrito') {
      htmlToSend(value).text(url);
    }
  });

  // email message
  body = htmlToSend.html();
  const pathToImage = path.join(__dirname, '../../logoEscuelaNutricion.png');
  const message = {
    from: `"REP" <${emailAccount}}>`,
    to: email,
    subject: 'Verifique su email',
    attachments: [{
      filename: 'logoEscuelaNutricion.png',
      path: pathToImage,
      cid: 'logo',
    }],
    html: body,
  };
  transporter.sendMail(message);
};

const sendRecoverEmail = (email: string, token: string): void => {
  // build html with token link to verify th email
  const pathToFile = path.join(__dirname, '../../passwordRecoverEmail.html');
  let body: string = fs.readFileSync(pathToFile, 'utf8').toString();
  const htmlToSend = cheerio.load(body);
  htmlToSend('a').each((index, value) => {
    const old_url = htmlToSend(value).attr('href');
    const url = `${frontend}/update-password?token=${token}`;
    if (old_url === 'PutYourLinkHere') {
      htmlToSend(value).attr('href', url);
    }
    if (htmlToSend(value).attr('id') === 'linkEscrito') {
      htmlToSend(value).text(url);
    }
  });

  // email message
  body = htmlToSend.html();
  const pathToImage = path.join(__dirname, '../../logoEscuelaNutricion.png');
  const message = {
    from: `"REP" <${emailAccount}}>`,
    to: email,
    subject: 'Recupere su contraseña',
    attachments: [{
      filename: 'logoEscuelaNutricion.png',
      path: pathToImage,
      cid: 'logo',
    }],
    html: body,
  };
  transporter.sendMail(message);
};

const sendApprovedEmail = (email: string): void => {
  const pathToFile = path.join(__dirname, '../../adminApprovedEmail.html');
  let body: string = fs.readFileSync(pathToFile, 'utf8').toString();
  const htmlToSend = cheerio.load(body);
  htmlToSend('p').each((index, value) => {
    const old_url = htmlToSend(value).attr('href');
    const url = `${frontend}/dashboard`;
    if (old_url === 'PutYourLinkHere') {
      htmlToSend(value).attr('href', url);
    }
    if (htmlToSend(value).attr('id') === 'linkEscrito') {
      htmlToSend(value).text(url);
    }
  });

  // email message
  body = htmlToSend.html();
  const pathToImage = path.join(__dirname, '../../logoEscuelaNutricion.png');
  const message = {
    from: `"REP" <${emailAccount}}>`,
    to: email,
    subject: '¡Cuenta aprobada!',
    attachments: [{
      filename: 'logoEscuelaNutricion.png',
      path: pathToImage,
      cid: 'logo',
    }],
    html: body,
  };
  transporter.sendMail(message);
};

export default {
  checkMailAddress, sendVerifyEmail, sendRecoverEmail, sendApprovedEmail,
};
