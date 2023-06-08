import shopify from "../shopify";


export async function addTagToOrder(orderId, tag) {
  const order = new shopify.rest.Order({ session: session });
  order.id = orderId;
  order.metafields = [
    {
      tags: tag,
    }
  ];
  await order.save({
    update: true,
  });
}