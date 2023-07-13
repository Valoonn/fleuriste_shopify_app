import { session, shopifyApiOffline } from "../shopify.js";
import { FleuristeDB } from "../fleuriste-db.js";

async function getProductLocation(productId) {
  try {
    const products = await shopifyApiOffline.rest.Product.find({
      session: session,
      id: productId,
    });
    if (products.variants.length === 0) {
      console.log("no variants")
      return null;
    }
    const locations = await shopifyApiOffline.rest.InventoryLevel.all({
      session: session,
      inventory_item_ids: products.variants[0].inventory_item_id,
    });
    if (locations.data.length === 0) {
      console.log("no locations")
      return null;
    }
    const location = await FleuristeDB.read(`gid://shopify/Location/${locations.data[0].location_id}`);
    return location;
  } catch (error) {
    console.log(error)
  }
}

async function getOrderDetails(orderId) {
  try {
    var order = await shopifyApiOffline.rest.Order.find({
      session: session,
      id: orderId,
    });
    order = await insertProductImage(order);
    return order;
  } catch (error) {
    console.log(error)
  }
}


async function insertProductImage(order) {
  try {
    for (const lineItem of order.line_items) {
      lineItem.image = await getProductImage(lineItem.product_id);
    }
    return order;
  } catch (error) {
    console.log(error)
    return null;
  }
}





async function getProductImage(productId) {
  try {
    const product = await shopifyApiOffline.rest.Image.all({
      session: session,
      product_id: productId,
    });
    if (product.data.length === 0) return null;
    return product.data[0].src;
  } catch (error) {
    console.log(error)
  }
}



// // create a function that cancel an order

// async function cancelOrder(orderId) {
//   try {
//   } catch (error) {
//     console.log(error.response.body)
//   }
// }




export { getProductLocation, getOrderDetails, insertProductImage };