import nodemailer from 'nodemailer';
import { shopify, shopifyApiOffline } from '../shopify.js';
import Handlebars from 'handlebars';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();


async function sendEmail(content, email, subject) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_LOGIN,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    var mailOptions = {
      from: "Flower Fool <noreply@flowerfool.com>",
      to: email,
      subject: "[FLEURISTE APP] " + subject,
      text: content,
    }

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
    throw Error("Error while sending email");
  }
}


async function sendEmailHTML(content, email, subject) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_LOGIN,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    var mailOptions = {
      from: "Flower Fool <noreply@flowerfool.com>",
      to: email,
      subject: "[FLEURISTE APP] " + subject,
      html: content
    }

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
    throw Error("Error while sending email");
  }
}





export async function sendFleuristeValidationEmail(content, email, orderId) {
  try {

    const htmlSource = fs.readFileSync("./email-template/validate-order/index.html").toString();
    const template = Handlebars.compile(htmlSource);
    const htmlEmail = template({
      order: content,
      accept_url: `https://${shopify.api.config.hostName}/api/external/validation/order/validate/${orderId}?shop=cosykicks.myshopify.com&host=Y29zeWtpY2tzLm15c2hvcGlmeS5jb20vYWRtaW4`,
      refuse_url: `https://${shopify.api.config.hostName}/api/external/validation/order/refuse/${orderId}?shop=cosykicks.myshopify.com&host=Y29zeWtpY2tzLm15c2hvcGlmeS5jb20vYWRtaW4`
    })

    await sendEmailHTML(htmlEmail, email, "Validation d'une commande");

  } catch (error) {
    console.log(error);
    throw Error("Error while sending email");
  }
}



export async function sendFleuristeOrderValidateEmail(content, email) {
  try {

    const htmlSource = fs.readFileSync("./email-template/fleuriste-order-validated/index.html").toString();
    const template = Handlebars.compile(htmlSource);
    const htmlEmail = template({
      order: content,
    })

    const orderPrice = content.current_total_price + ' €';
    const product = content.line_items;
    const shippingDetails = content.shipping_address;

    var text = `
Bonjour,

Vous avez validé une commande sur votre boutique.

Voici les détails du client:

Nom: ${shippingDetails.first_name} ${shippingDetails.last_name}
Adresse: ${shippingDetails.address1}, ${shippingDetails.address2 ? shippingDetails.address2 + "," : ""} ${shippingDetails.city}, ${shippingDetails.zip}, ${shippingDetails.country}
Téléphone: ${shippingDetails.phone}
Email: ${content.contact_email}
Prix: ${orderPrice}


Voici le détail de la commande:
`

    product.forEach((element, index) => {
      text += `
      Produit ${index + 1}:
      Nom: ${element.name}
      Quantité: ${element.quantity}
      Prix: ${element.price} €
      --------------------------------------------
      `
    });

    text += `

Cordialement,
`


    // await sendEmail(text, email, "Commande validé");
    await sendEmailHTML(htmlEmail, email, "Commande validé");
  } catch (error) {
    console.log(error);
    throw Error("Error while sending email");
  }
}




export async function sendFleuristeOrderCancelEmail(content, email) {
  try {
    const htmlSource = fs.readFileSync("./email-template/fleuriste-order-refused/index.html").toString();
    const template = Handlebars.compile(htmlSource);
    const htmlEmail = template({
      order: content,
    })

    const orderPrice = content.current_total_price + ' €';
    const product = content.line_items;
    const shippingDetails = content.shipping_address;

    var text = `
Bonjour,

Vous avez refusé une commande sur votre boutique.

Voici les détails du client:

Nom: ${shippingDetails.first_name} ${shippingDetails.last_name}
Adresse: ${shippingDetails.address1}, ${shippingDetails.address2 ? shippingDetails.address2 + "," : ""} ${shippingDetails.city}, ${shippingDetails.zip}, ${shippingDetails.country}
Téléphone: ${shippingDetails.phone}
Email: ${content.contact_email}
Prix: ${orderPrice}


Voici le détail de la commande:
`

    product.forEach((element, index) => {
      text += `
      Produit ${index + 1}:
      Nom: ${element.name}
      Quantité: ${element.quantity}
      Prix: ${element.price} €
      --------------------------------------------
      `
    });

    text += `

Cordialement,
`

    // await sendEmail(text, email, "Commande refusé");
    await sendEmailHTML(htmlEmail, email, "Commande refusé");
  } catch (error) {
    console.log(error);
    throw Error("Error while sending email");
  }
}


export async function sendAdminNewOrder(content, location) {
  try {

    const htmlSource = fs.readFileSync("./email-template/admin-new-order/index.html").toString();
    const template = Handlebars.compile(htmlSource);
    const htmlEmail = template({
      order: content,
      location: location
    })


    const orderPrice = content.current_total_price + ' €';
    const product = content.line_items;
    const shippingDetails = content.shipping_address;

    var text = `
Bonjour,

Une commande a été passée sur votre boutique.


Voici les détails du fleuriste:

Nom: ${location.name}
Adresse: ${location.address1}, ${location.address2 ? location.address2 + "," : ""} ${location.city}, ${location.zip}, ${location.country}
Téléphone: ${location.phone}
Email: ${location.email}



Voici les détails du client :

Nom: ${shippingDetails.first_name} ${shippingDetails.last_name}
Adresse: ${shippingDetails.address1}, ${shippingDetails.address2 ? shippingDetails.address2 + "," : ""} ${shippingDetails.city}, ${shippingDetails.zip}, ${shippingDetails.country}
Téléphone: ${shippingDetails.phone}
Email: ${content.contact_email}
Prix: ${orderPrice}


Voici le détail de la commande:
`

    product.forEach((element, index) => {
      text += `
      Produit ${index + 1}:
      Nom: ${element.name}
      Quantité: ${element.quantity}
      Prix: ${element.price} €
      --------------------------------------------
      `
    });

    text += `

Cordialement,
`

    // await sendEmail(text, process.env.EMAIL_LOGIN, "Nouvelle commande");
    await sendEmailHTML(htmlEmail, process.env.EMAIL_LOGIN, "Nouvelle commande");
  } catch (error) {
    console.log(error);
    throw Error("Error while sending email");
  }
}


export async function sendAdminConfirmOrderEmail(content, location) {
  try {

    const htmlSource = fs.readFileSync("./email-template/admin-order-validated/index.html").toString();
    const template = Handlebars.compile(htmlSource);
    const htmlEmail = template({
      order: content,
      location: location
    })

    const orderPrice = content.current_total_price + ' €';
    const product = content.line_items;
    const shippingDetails = content.shipping_address;

    var text = `
Bonjour,


Une commande a été validé par le fleuriste.


Voici les détails du fleuriste:

Nom: ${location.name}
Adresse: ${location.address1}, ${location.address2 ? location.address2 + "," : ""} ${location.city}, ${location.zip}, ${location.country}
Téléphone: ${location.phone}
Email: ${location.email}



Voici les détails du client :

Nom: ${shippingDetails.first_name} ${shippingDetails.last_name}
Adresse: ${shippingDetails.address1}, ${shippingDetails.address2 ? shippingDetails.address2 + "," : ""} ${shippingDetails.city}, ${shippingDetails.zip}, ${shippingDetails.country}
Téléphone: ${shippingDetails.phone}
Email: ${content.contact_email}
Prix: ${orderPrice}


Voici le détail de la commande:
`

    product.forEach((element, index) => {
      text += `
      Produit ${index + 1}:
      Nom: ${element.name}
      Quantité: ${element.quantity}
      Prix: ${element.price} €
      --------------------------------------------
      `
    });

    text += `

Cordialement,
`

    // await sendEmail(text, process.env.EMAIL_LOGIN, "Commande validé");
    await sendEmailHTML(htmlEmail, process.env.EMAIL_LOGIN, "Commande validé");
  } catch (error) {
    console.log(error);
    throw Error("Error while sending email");
  }
}


export async function sendAdminCancelOrderEmail(content, location) {
  try {

    const htmlSource = fs.readFileSync("./email-template/admin-order-refused/index.html").toString();
    const template = Handlebars.compile(htmlSource);
    const htmlEmail = template({
      order: content,
      location: location
    })
    const orderPrice = content.current_total_price + ' €';
    const product = content.line_items;
    const shippingDetails = content.shipping_address;

    var text = `
Bonjour,


Une commande a été refusé par le fleuriste.


Voici les détails du fleuriste:

Nom: ${location.name}
Adresse: ${location.address1}, ${location.address2 ? location.address2 + "," : ""} ${location.city}, ${location.zip}, ${location.country}
Téléphone: ${location.phone}
Email: ${location.email}



Voici les détails du client :

Nom: ${shippingDetails.first_name} ${shippingDetails.last_name}
Adresse: ${shippingDetails.address1}, ${shippingDetails.address2 ? shippingDetails.address2 + "," : ""} ${shippingDetails.city}, ${shippingDetails.zip}, ${shippingDetails.country}
Téléphone: ${shippingDetails.phone}
Email: ${content.contact_email}
Prix: ${orderPrice}


Voici le détail de la commande:
`

    product.forEach((element, index) => {
      text += `
      Produit ${index + 1}:
      Nom: ${element.name}
      Quantité: ${element.quantity}
      Prix: ${element.price} €
      --------------------------------------------
      `
    });

    text += `

Cordialement,
`

    // await sendEmail(text, process.env.EMAIL_LOGIN, "Commande refusé");
    await sendEmailHTML(htmlEmail, process.env.EMAIL_LOGIN, "Commande refusé");
  } catch (error) {
    console.log(error);
    throw Error("Error while sending email");
  }
}


export async function customersValidationEmail(content, location) {
  try {

    const htmlSource = fs.readFileSync("./email-template/customer-order-validated/index.html").toString();
    const template = Handlebars.compile(htmlSource);
    const htmlEmail = template({
      order: content,
      location: location
    })

    const orderPrice = content.current_total_price + ' €';
    const product = content.line_items;
    const shippingDetails = content.shipping_address;

    var text = `
Bonjour,

Votre commande à été accepté par le fleuriste !


Voici les détails du fleuriste:

Nom: ${location.name}
Adresse: ${location.address1}, ${location.address2 ? location.address2 + "," : ""} ${location.city}, ${location.zip}, ${location.country}
Téléphone: ${location.phone}
Email: ${location.email}



Voici vos informations :

Nom: ${shippingDetails.first_name} ${shippingDetails.last_name}
Adresse: ${shippingDetails.address1}, ${shippingDetails.address2 ? shippingDetails.address2 + "," : ""} ${shippingDetails.city}, ${shippingDetails.zip}, ${shippingDetails.country}
Téléphone: ${shippingDetails.phone}
Email: ${content.contact_email}
Prix: ${orderPrice}


Voici le détail de la commande:
`

    product.forEach((element, index) => {
      text += `
      Produit ${index + 1}:
      Nom: ${element.name}
      Quantité: ${element.quantity}
      Prix: ${element.price} €
      --------------------------------------------
      `
    });

    text += `

Cordialement,
`

    // await sendEmail(text, content.contact_email, "Commande validé par le fleuriste");
    await sendEmailHTML(htmlEmail, content.contact_email, "Commande validé par le fleuriste");
  } catch (error) {
    console.log(error);
    throw Error("Error while sending email");
  }
}



export async function customersCancelEmail(content, location) {
  try {

    const htmlSource = fs.readFileSync("./email-template/customer-order-refused/index.html").toString();
    const template = Handlebars.compile(htmlSource);
    const htmlEmail = template({
      order: content,
      location: location
    })

    const orderPrice = content.current_total_price + ' €';
    const product = content.line_items;
    const shippingDetails = content.shipping_address;

    var text = `
Bonjour,

Desolé votre commande à été refusé par le fleuriste.
Vous pouvez contacter le fleuriste pour plus d'informations.
Vous ne serez pas débité.


Voici les détails du fleuriste:

Nom: ${location.name}
Adresse: ${location.address1}, ${location.address2 ? location.address2 + "," : ""} ${location.city}, ${location.zip}, ${location.country}
Téléphone: ${location.phone}
Email: ${location.email}



Voici vos informations :

Nom: ${shippingDetails.first_name} ${shippingDetails.last_name}
Adresse: ${shippingDetails.address1}, ${shippingDetails.address2 ? shippingDetails.address2 + "," : ""} ${shippingDetails.city}, ${shippingDetails.zip}, ${shippingDetails.country}
Téléphone: ${shippingDetails.phone}
Email: ${content.contact_email}
Prix: ${orderPrice}


Voici le détail de la commande:
`

    product.forEach((element, index) => {
      text += `
      Produit ${index + 1}:
      Nom: ${element.name}
      Quantité: ${element.quantity}
      Prix: ${element.price} €
      --------------------------------------------
      `
    });

    text += `

Cordialement,
`
    // await sendEmail(text, content.contact_email, "Commande refusé par le fleuriste");
    await sendEmailHTML(htmlEmail, content.contact_email, "Commande refusé par le fleuriste");
  } catch (error) {
    console.log(error);
    throw Error("Error while sending email");
  }
}
