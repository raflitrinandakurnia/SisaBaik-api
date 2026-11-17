import pg from "pg";
const { Pool } = pg;

const produksi = process.env.NODE_ENV === "production"; 
const ssl = process.env.PGSSL ?? "disable";

if (!["disable", "require"].includes(ssl)) {
  throw new Error("PGSSL wajib disable atau require.");
}

for (const name of [
  "PGHOST",
  "PGPORT",
  "PGDATABASE",
  "PGUSER",
  "PGPASSWORD",
]) {
  if (!process.env[name])
    throw new Error(`Konfigurasi ${name} belum diisi.`);
}

export const pool = new Pool({
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT),
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  ssl: ssl === "require" ? { rejectUnauthorized: false } : false,
  max: 5,
  connectionTimeoutMillis: 15000,
  idleTimeoutMillis: 10000,
  statement_timeout: 10000,
});

pool.on("error", (error) => {
  console.error("Koneksi idle bermasalah:", error.code ?? "DB_ERROR");
});