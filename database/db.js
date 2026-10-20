import 'dotenv/config';
import pg from 'pg';

const { Pool } = pg;

const database = new Pool({
  connectionString: process.env.CONNECTION_STRING,
});

export default database;
