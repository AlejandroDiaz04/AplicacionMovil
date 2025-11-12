const { Client } = require("pg");
const dotenv = require("dotenv");
dotenv.config();

async function test() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    const res = await client.query(
      "SELECT version(), current_database(), current_user;"
    );
    console.log("✅ Conexión OK:");
    console.table(res.rows);
  } catch (err) {
    console.error("❌ Error de conexión:");
    console.error(err.message || err);
  } finally {
    await client.end();
  }
}

test();
