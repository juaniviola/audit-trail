const { Client } = require('pg');

const attempts = Number(process.env.DB_WAIT_ATTEMPTS || 30);
const delayMs = Number(process.env.DB_WAIT_DELAY_MS || 2000);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitForPostgres() {
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const client = new Client({
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT || 5432),
      user: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_DATABASE || 'audit_trail',
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
      connectionTimeoutMillis: delayMs,
    });

    try {
      await client.connect();
      await client.end();
      console.log('PostgreSQL is reachable');
      return;
    } catch (error) {
      console.log(`Waiting for PostgreSQL (${attempt}/${attempts}): ${error.message}`);
      await client.end().catch(() => undefined);
      await sleep(delayMs);
    }
  }

  throw new Error(`PostgreSQL was not reachable after ${attempts} attempts`);
}

waitForPostgres().catch((error) => {
  console.error(error);
  process.exit(1);
});

