import OrderWH from './orders_webhook.js';

export default async function sendWH(body, topic) {
  const functionToCall = OrderWH.get(topic);
  if (functionToCall) {
    await functionToCall(body);
  }
}