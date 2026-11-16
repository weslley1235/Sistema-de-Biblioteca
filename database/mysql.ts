import 'dotenv/config';
import mysql from 'mysql2/promise';

const mysqlDatabase = mysql.createPool({
  uri: process.env.MYSQL_URL ?? '',
  dateStrings: ['DATE'],
});

export default mysqlDatabase; 