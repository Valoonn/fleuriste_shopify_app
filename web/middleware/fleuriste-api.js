import express from "express";

import shopify from "../shopify.js";

import { FleuristeDB } from "../fleuriste-db.js";


import { gql } from 'graphql-request'



export default function applyFleuristeApiEndpoints(app) {
  app.use(express.json());

  app.get("/api/fleuriste/", async (_req, res) => {

    const fleuristesList = await FleuristeDB.list();
    console.log(fleuristesList)

    const fleuristes = await shopify.api.rest.Location.all({
      session: res.locals.shopify.session,
    });
    res.status(200).send(fleuristesList);
  });


  app.delete("/api/fleuriste", async (_req, res) => {
    try {
      const { id } = _req.body;
      const session = res.locals.shopify.session;
      const client = new shopify.api.clients.Graphql({ session });
      console.log(id)

      const data = await client.query({
        data: {
          query: `query {
              location(id: "${id}") {
                id
                name
                inventoryLevels(first: 10) {
                  edges {
                    node {
                      id
                    }
                  }
                }
              }
            }`
        }
      });

      // @ts-ignore
      console.log(data.body.data.location.inventoryLevels.edges)

      // @ts-ignore
      for (const edge of data.body.data.location.inventoryLevels.edges) {
        const delIventoryLevel = await client.query(
          {
            data: {
              query: `mutation inventoryDeactivate($inventoryLevelId: ID!) {
                inventoryDeactivate(inventoryLevelId: $inventoryLevelId) {
                  userErrors {
                    message
                  }
                }
              }`,
              variables: {
                inventoryLevelId: edge.node.id
              }
            }
          }
        );
        console.log(delIventoryLevel)
      }

      // desactivate location

      const desactivateLocation = await client.query({
        data: {
          query: `mutation {
            locationDeactivate(locationId: "${id}") {
              location {
                id
                isActive
              }
              locationDeactivateUserErrors {
                message
                code
                field
              }
            }
          }`,
        }
      });

      console.log(desactivateLocation)

      const delLocation = await client.query({
        data: {
          query: `mutation {
            locationDelete(locationId: "${id}") {
              deletedLocationId
              locationDeleteUserErrors {
                message
                code
                field
              }
            }
          }`,
        },
      });

      console.log(delLocation)

      // delete fleuriste in db
      await FleuristeDB.delete(id);

      res.status(200).send(delLocation);
    } catch (err) {
      console.log(err)
      res.status(500).send(err);
    }
  });


  app.post("/api/fleuriste", async (_req, res) => {
    console.log(_req.body)
    try {
      const {
        name,
        address1,
        address2,
        city,
        zip,
        country,
        phone,
        email,
        openingHours,
      } = _req.body;

      // create a location in shopify
      const session = res.locals.shopify.session;
      const client = new shopify.api.clients.Graphql({ session });


      const addQuery = gql`mutation {
        locationAdd(input: {name: "${name}", address: {address1: "${address1}", address2: "${address2}", city: "${city}", countryCode: FR, zip: "${zip}", phone: "${phone}"}, fulfillsOnlineOrders: true}) {
          location {
            id
            name
            address {
              address1
              address2
              city
              zip
              countryCode
              phone
            }
            fulfillsOnlineOrders
          }
        }
      }`



      const data = await client.query({
        data: {
          query: addQuery,
        }
      });

      console.log(JSON.stringify(data, null, 2))
      console.log(JSON.stringify(data.body.data, null, 2))

      const locationId = data.body.data.locationAdd.location.id;

      const id = await FleuristeDB.create({
        locationId,
        name,
        address1,
        address2,
        city,
        zip,
        country,
        phone,
        email,
        openingHours,
      });

      res.status(200).send({ id });
    } catch (err) {
      console.log(err)
      res.status(500).send(err);
    }
  });


}