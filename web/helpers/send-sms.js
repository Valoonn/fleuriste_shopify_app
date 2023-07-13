// customersValidationEmail,
// customersCancelEmail,
// sendAdminConfirmOrder,
// sendAdminCancelOrder,
// sendFleuristeValidationEmail,
// sendFleuristeOrderValidateEmail
// sendFleuristeOrderCancelEmail,
import axios from 'axios';



async function sendSMS(number, message) {
  if (number[0] === '+')
    number = number.slice(3);
  if (number[0] === '0')
    number = number.slice(1);
  number = `+33${number}`;

  var config = {
    method: 'get',
    url: 'https://sms.lws.fr/sms/api',
    params: {
      action: 'send-sms',
      api_key: process.env.SMS_API_KEY,
      to: number,
      from: 'FLOWER FOOL',
      sms: message,
    }
  };

  return await axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
      return response.data;
    })
    .catch(function (error) {
      console.log(error);
      throw error;
    });
}


export async function sendFleuristeValidationSms(order, location) {
  const message = `Une nouvelle commande ${order.name} à été passé dans votre boutique, veuillez la valider ou la refuser dans le mail que vous allez recevoir. Merci.`;
  return await sendSMS(location.phone, message);
}

export async function sendFleuristeOrderValidateSMS(order, location) {
  const message = `Vous avez validé la commande ${order.name}, vous pouvez commencer a la preparer. Merci.`;
  return await sendSMS(location.phone, message);
}

export async function sendFleuristeOrderCancelSMS(order, location) {
  const message = `Vous avez refusé la commande ${order.name}.`;
  return await sendSMS(location.phone, message);
}

export async function customersValidationSMS(order, location) {
  const message = `Votre commande ${order.name}, au pret de ${location.name} a bien été prise en compte, vous allez recevoir un mail de confirmation.`;
  return await sendSMS(order.billing_address.phone, message);
}

export async function customersCancelSMS(order, location) {
  const message = `Votre commande ${order.name}, au pret de ${location.name} a été refusé par votre fleuriste.`;
  return await sendSMS(order.billing_address.phone, message);
}