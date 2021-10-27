import nodemailer, { Transporter } from 'nodemailer';
import fs from 'fs';
import path from 'path';
import cheerio from 'cheerio';
import { html } from 'cheerio/lib/static';

const transporter: Transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'agusruizdiazcambon@gmail.com',
    pass: 'vcmlraefljofhako',
  },
});

transporter.verify().then(() => {
  console.log('Ready to send emails');
});

const sendEmail = (token: string): string => {
  const pathToFile = path.join(__dirname, '../../email.html');
  let body: string = fs.readFileSync(pathToFile, 'utf8').toString();
  const htmlToSend = cheerio.load(body);
  htmlToSend('a').each((index, value) => {
    const old_url = htmlToSend(value).attr('href');
    const url = `http://localhost:4200/${token}`;
    if (old_url === 'PutYourLinkHere') {
      htmlToSend(value).attr('href', url);
    }
    if (htmlToSend(value).attr('id') === 'linkEscrito') {
      htmlToSend(value).text(url);
    }
  });
  body = htmlToSend.html();
  const pathToImage = path.join(__dirname, '../../logoEscuelaNutricion.png');
  const message = {
    from: '"te mamaste" <agusruizdiazcambon@gmail.com>',
    to: 'agusruizdiazcambon@hotmail.com',
    subject: 'LOL',
    attachments: [{
      filename: 'logoEscuelaNutricion.png',
      path: pathToImage,
      cid: 'logo',
    }],
    html: body,
  };
  transporter.sendMail(message);
  return body;
};

export default { sendEmail };
