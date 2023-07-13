/*
  This file interacts with the app's database and is used by the app's REST APIs.
*/

import sqlite3 from "sqlite3";
import path from "path";

const DEFAULT_DB_FILE = path.join(process.cwd(), "fleuriste.sqlite");

export const FleuristeDB = {
  fleuristeTableName: "fleuristes",
  db: null,
  ready: null,

  create: async function ({
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
  }) {
    await this.ready;

    const query = `
      INSERT INTO ${this.fleuristeTableName}
      (locationId, name, address1, address2, city, zip, country, phone, email, openingHours)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      RETURNING id;
    `;

    const rawResults = await this.__query(query, [
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
    ]);

    return rawResults[0].id;
  },

  update: async function (
    id,
    {
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
    }
  ) {
    await this.ready;

    const query = `
      UPDATE ${this.fleuristeTableName}
      SET (locationId, name, address1, address2, city, zip, country, phone, email, openingHours)
      = (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      WHERE id = ?;
    `;

    await this.__query(query, [
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
      id,
    ]);
    return true;
  },

  list: async function () {
    await this.ready;
    const query = `
      SELECT * FROM ${this.fleuristeTableName}
    `;

    const results = await this.__query(query);

    return results;
  },


  read: async function (id) {
    await this.ready;
    const query = `
      SELECT * FROM ${this.fleuristeTableName}
      WHERE locationId = ?;
    `;
    const rows = await this.__query(query, [id]);

    return rows[0];
  },

  delete: async function (id) {
    await this.ready;
    const query = `
      DELETE FROM ${this.fleuristeTableName}
      WHERE locationId = ?;
    `;
    await this.__query(query, [id]);
    return true;
  },


  /* Private */

  /*
    Used to check whether to create the database.
    Also used to make sure the database and table are set up before the server starts.
  */

  __hasFleuristeTable: async function () {
    const query = `
      SELECT name FROM sqlite_schema
      WHERE
        type = 'table' AND
        name = ?;
    `;
    const rows = await this.__query(query, [this.fleuristeTableName]);
    return rows.length === 1;
  },

  /* Initializes the connection with the app's sqlite3 database */
  init: async function () {

    /* Initializes the connection to the database */
    this.db = this.db ?? new sqlite3.Database(DEFAULT_DB_FILE);

    const hasFleuristeTable = await this.__hasFleuristeTable();

    if (hasFleuristeTable) {
      this.ready = Promise.resolve();

      /* Create the QR code table if it hasn't been created */
    } else {
      const query = `
        CREATE TABLE ${this.fleuristeTableName} (
          id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
          locationId INTEGER NOT NULL,
          name VARCHAR(511) NOT NULL,
          address1 VARCHAR(511) NOT NULL,
          address2 VARCHAR(511),
          city VARCHAR(511) NOT NULL,
          zip VARCHAR(511) NOT NULL,
          country VARCHAR(511) NOT NULL,
          phone VARCHAR(511) NOT NULL,
          email VARCHAR(511) NOT NULL,
          openingHours VARCHAR(511) NOT NULL,
          createdAt DATETIME NOT NULL DEFAULT (datetime(CURRENT_TIMESTAMP, 'localtime'))
        )
      `;

      /* Tell the various CRUD methods that they can execute */
      this.ready = this.__query(query);
    }
  },

  /* Perform a query on the database. Used by the various CRUD methods. */
  __query: function (sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(result);
      });
    });
  },

};
