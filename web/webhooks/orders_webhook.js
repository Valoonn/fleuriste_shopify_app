// import shopify from "../shopify.js";
import { addTagToOrder } from "../helpers/order_modifier.js";
import { sendFleuristeValidationEmail, sendAdminNewOrder } from "../helpers/validation-email.js";
import { getProductLocation, insertProductImage } from "../helpers/product-finder.js";
import { sendFleuristeValidationSms } from "../helpers/send-sms.js";


async function orders_paid(body) {
  console.log("============================================")
  console.log("WEBHOOK")
  // console.log(JSON.stringify(body, null, 2))
  addTagToOrder(body.id, "Pas validé")
  body = await insertProductImage(body)
  const location = await getProductLocation(body.line_items[0].product_id)
  sendFleuristeValidationEmail(body, location.email, body.id)
  sendAdminNewOrder(body, location)
  sendFleuristeValidationSms(body, location)
  console.log("Orders paid")
  console.log("============================================\n\n\n")
}

async function orders_cancelled(body) {
  console.log("============================================")
  console.log("WEBHOOK")
  // console.log(JSON.stringify(body, null, 2))
  console.log("Orders cancelled")
  console.log("============================================\n\n\n")
}

async function orders_updated(body) {
  console.log("============================================")
  console.log("WEBHOOK")
  // console.log(JSON.stringify(body, null, 2))
  console.log("Orders update")
  console.log("============================================\n\n\n")
}

async function orders_delete(body) {
  console.log("============================================")
  console.log("WEBHOOK")
  // console.log(JSON.stringify(body, null, 2))
  console.log("Orders delete")
  console.log("============================================\n\n\n")
}

export default new Map([
  ["orders/paid", orders_paid],
  ["orders/cancelled", orders_cancelled],
  // ["orders/updated", orders_updated],
  ["orders/delete", orders_delete],
]);