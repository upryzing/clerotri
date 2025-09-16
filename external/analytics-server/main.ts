import process from 'node:process';

import { App } from '@tinyhttp/app';
import * as dotenv from '@tinyhttp/dotenv';
import { json as parser } from './vendored/milliparsec.js';
import pg from 'pg-promise';
import { ulid } from 'ulid';

import sql from './sql/index.ts';

dotenv.config();

const app = new App();
const port = Number.parseInt(process.env.PORT ?? '3000', 10);
const connection = process.env.DB_CONNECTION;

if (!connection) {
  throw new Error('DB_CONNECTION must be provided');
}

const initOptions = {
  /* initialization options */
};

const pgp = pg(initOptions);
const db = pgp(connection);

const init = () => {
  db.none(sql.analytics.create)
    .then(() => {})
    .catch((error) => {
      console.error(`failed to initialize db: ${error}`);
    });
};

init();

const TIERS = ['basic', 'full'];

const BASIC_PROPERTIES = ['model', 'os', 'version'];
const FULL_PROPERTIES = [...BASIC_PROPERTIES, 'settings', 'instance'];

app.use('/', parser());

app.post('/v1/submit', async (req, res, next) => {
  try {
    const id = ulid();
    const data = req.body;

    console.log(`New request: ${id}, ${JSON.stringify(data)}`);

    // check if the tier is included/valid
    if (!data.tier || !TIERS.includes(data.tier)) {
      return res.status(400).send({
        message: `Tier ${
          data.tier ? `${data.tier} is invalid` : 'was missing'
        }`,
      });
    }

    // we know the tier is okay, so check the values
    const { tier, ...values } = data;

    if (Object.keys(values).length === 0) {
      return res.status(400).send({
        message: "There aren't any properties other than the tier",
      });
    }

    const propertySet = tier === 'basic' ? BASIC_PROPERTIES : FULL_PROPERTIES;

    const confirmedProperties: string[] = [];

    for (const value of Object.keys(values)) {
      if (!propertySet.includes(value)) {
        return res.status(400).send({
          message: `${value} is not a known property for tier ${tier}`,
        });
      }

      if (typeof values[value] !== 'string') {
        return res.status(400).send({
          message: `The value of ${value} (${values[value]}) is invalid`,
        });
      }

      confirmedProperties.push(value);
    }

    // all the values are valid, so check if anything is missing
    if (confirmedProperties.length !== propertySet.length) {
      return res.status(400).send({
        message: 'One or more required properties are missing',
      });
    }

    const result = await db.one(sql.analytics.add, [
      id,
      tier,
      data.model,
      data.os,
      data.version,
      ...(tier === 'full' ? [data.settings, data.instance] : [null, null]),
    ]);

    console.log(result);

    res.status(200).send({ message: 'Got it :3' });
  } catch (err) {
    next && next(err);
  }
});

app.listen(port, () => console.log(`Started on http://localhost:${port}`));

// TYPES FOR FUTURE REFERENCE:
// type CoreAnalytics = {
//   model: string;
//   os: string;
//   version: string;
// };

// type BasicAnalytics = CoreAnalytics & {
//   tier: 'basic';
// };

// type FullAnalytics = CoreAnalytics & {
//   tier: 'full';
//   settings: string;
//   instance: string;
// };

// type SQLAnalytics = (BasicAnalytics | FullAnalytics) & {
//   id: string; // a ULID for each entry
//   stored_at: Date; // a separate timestamp for easier date comparisons
// };
