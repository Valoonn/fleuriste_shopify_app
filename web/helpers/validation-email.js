import nodemailer from 'nodemailer';


export async function sendFleuristeValidationEmail(content, email, orderId) {
  try {
    const transporter = nodemailer.createTransport({
      host: "mail.gandi.net",
      port: 465,
      auth: {
        user: "noreply@valoon.fr",
        pass: "RYzaGrTJK7MsD565YJ9zkc8w22IGpRfk8YLgN8GJjVm9IcOKt5",
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailOptions = {
      from: "noreply@valoon.fr",
      to: email,
      subject: "[FLEURISTE APP] Validation d'une commande",
      text: `
      Bonjour,

      Une commande a été passée sur votre boutique.
      
      Veuillez la valider en cliquant sur le lien suivant : ${process.env.BACKEND_URL}/order/validate/${orderId}

      Ou vous pouvez la refuser en cliquant sur le lien suivant : ${process.env.BACKEND_URL}/order/refuse/${orderId}

      Cordialement,
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
    throw Error("Error while sending email");
  }
}


