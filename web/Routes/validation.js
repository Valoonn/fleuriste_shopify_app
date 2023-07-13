import express from 'express';
const router = express.Router();
import { shopify } from '../shopify.js';
import { addTagToOrder, cancelOrder, getTagOrders } from '../helpers/order_modifier.js';
import { getOrderDetails, getProductLocation } from '../helpers/product-finder.js';
import { customersValidationEmail, sendAdminConfirmOrderEmail, customersCancelEmail, sendAdminCancelOrderEmail, sendFleuristeOrderCancelEmail, sendFleuristeValidationEmail, sendFleuristeOrderValidateEmail } from '../helpers/validation-email.js';
import { sendFleuristeOrderValidateSMS, sendFleuristeOrderCancelSMS, customersCancelSMS, customersValidationSMS } from '../helpers/send-sms.js';


router.get('/order/validate/:id', async (req, res) => {
  try {
    console.log('validate');
    const orderId = req.params.id;
    if (await getTagOrders(orderId, 'Validé')) {
      res.send('Vous avez déjà validé cette commande');
      return;
    }
    addTagToOrder(orderId, 'Validé');
    const order = await getOrderDetails(orderId);
    const location = await getProductLocation(order.line_items[0].product_id);
    customersValidationEmail(order, location);
    // customersValidationSMS(order, location);
    sendAdminConfirmOrderEmail(order, location);
    sendFleuristeOrderValidateEmail(order, location.email);
    // sendFleuristeOrderValidateSMS(order, location);
    res.send('ok');
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});



router.get('/order/refuse/:id', async (req, res) => {
  try {
    const orderId = req.params.id;
    if (await getTagOrders(orderId, 'Refusé')) {
      res.send('Vous avez déjà refusé cette commande');
      return;
    }
    addTagToOrder(orderId, 'Refusé');
    cancelOrder(orderId);
    const order = await getOrderDetails(orderId);
    const location = await getProductLocation(order.line_items[0].product_id);
    customersCancelEmail(order, location);
    // customersCancelSMS(order, location);
    sendAdminCancelOrderEmail(order, location);
    sendFleuristeOrderCancelEmail(order, location.email);
    // sendFleuristeOrderCancelSMS(order, location);
    res.send('ok');
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});



export default router;