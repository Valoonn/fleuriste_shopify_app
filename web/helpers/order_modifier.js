import { session, shopifyApiOffline } from "../shopify.js";


async function addTagToOrder(orderId, tag) {
  try {
    const order = new shopifyApiOffline.rest.Order({ session: session });
    order.id = orderId;
    order.tags = tag;
    await order.save({
      update: true,
    });
  } catch (error) {
    console.log(error)
  }
}


async function getTagOrders(orderId, tag) {
  try {
    console.log(orderId, tag)
    // get the order details
    const order = await shopifyApiOffline.rest.Order.find({
      session: session,
      id: orderId,
    });
    // get the order tags
    const orderTags = order.tags;
    // check if the tag is in the order tags
    const tagExist = orderTags.includes(tag);
    // return true or false
    return tagExist;
  } catch (error) {
    console.log(error)
  }
}



// create a function that cancel an order

async function cancelOrder(orderId) {
  try {

    const order = new shopifyApiOffline.rest.Order({ session: session });
    order.id = orderId;
    await order.cancel({});
  } catch (error) {
    console.log(error)
  }
}




export { addTagToOrder, cancelOrder, getTagOrders };