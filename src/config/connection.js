import sql from "mssql";
import { DB_DATABASE, DB_PASSWORD, DB_SERVER, DB_USER } from "./config.js";

export const dbSettings = {
  user: DB_USER,
  password: DB_PASSWORD,
  server: DB_SERVER,
  database: DB_DATABASE,
  options: {
    encrypt: false, // for azure
    trustServerCertificate: true, // change to true for local dev / self-signed certs
  },
};

export const getConnection = async () => {
  try {
    console.log('🔗 Intentando conectar a la BD con:', {
      server: dbSettings.server,
      database: dbSettings.database,
      user: dbSettings.user,
    });
    const pool = await sql.connect(dbSettings);
    console.log('✅ Conexión a la BD exitosa!');
    return pool;
  } catch (error) {
    console.error('❌ Error en conexión a BD:', error.message);
    throw error;
  }
};
export { sql };