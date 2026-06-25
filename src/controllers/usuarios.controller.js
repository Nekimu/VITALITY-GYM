import { getConnection, sql } from "../config/connection.js";

export const getUsuarios = async (req, res) => {
  try {
    console.log('📋 GET /usuarios - Cargando usuarios...');
    const pool = await getConnection();
    const result = await pool.request().query("SELECT * FROM Usuario");
    console.log(`✅ Se encontraron ${result.recordset.length} usuarios`);
    res.json(result.recordset);
  } catch (error) {
    console.error('❌ Error en GET /usuarios:', error.message);
    res.status(500).send(error.message);
  }
};

export const createUsuario = async (req, res) => {
  const { NOMBRE, EDAD, PESO, TALLA, MEMBRESIA } = req.body;
  console.log('📝 POST /usuarios - Datos recibidos:', { NOMBRE, EDAD, PESO, TALLA, MEMBRESIA });

  if (NOMBRE == null || EDAD == null) {
    console.warn('⚠️ Faltan campos requeridos:', { NOMBRE, EDAD });
    return res.status(400).json({ msg: "Bad Request. Faltan campos requeridos" });
  }

  try {
    const pool = await getConnection();
    await pool.request()
      .input("NOMBRE", sql.VarChar(100), NOMBRE)
      .input("EDAD", sql.Int, EDAD)
      .input("PESO", sql.Decimal(10, 2), PESO)
      .input("TALLA", sql.Decimal(5, 2), TALLA)
      .input("MEMBRESIA", sql.VarChar(50), MEMBRESIA)
      .query(
        "INSERT INTO Usuario (NOMBRE, EDAD, PESO, TALLA, MEMBRESIA) VALUES (@NOMBRE, @EDAD, @PESO, @TALLA, @MEMBRESIA)"
      );

    console.log('✅ Usuario creado exitosamente:', NOMBRE);
    res.json({ msg: "Usuario creado" });
  } catch (error) {
    console.error('❌ Error en POST /usuarios:', error.message);
    res.status(500).send(error.message);
  }
};

export const updateUsuario = async (req, res) => {
  const { NOMBRE, EDAD, PESO, TALLA, MEMBRESIA } = req.body;
  const { id } = req.params;
  console.log(`🔄 PUT /usuarios/${id} - Actualizando usuario:`, { NOMBRE, EDAD, PESO, TALLA, MEMBRESIA });

  try {
    const pool = await getConnection();
    await pool
      .request()
      .input("Id", sql.Int, id)
      .input("NOMBRE", sql.VarChar(100), NOMBRE)
      .input("EDAD", sql.Int, EDAD)
      .input("PESO", sql.Decimal(10, 2), PESO)
      .input("TALLA", sql.Decimal(5, 2), TALLA)
      .input("MEMBRESIA", sql.VarChar(50), MEMBRESIA)
      .query(
        "UPDATE Usuario SET NOMBRE = @NOMBRE, EDAD = @EDAD, PESO = @PESO, TALLA = @TALLA, MEMBRESIA = @MEMBRESIA WHERE ID = @Id"
      );

    console.log(`✅ Usuario ${id} actualizado exitosamente`);
    res.json({ msg: "Usuario actualizado" });
  } catch (error) {
    console.error(`❌ Error en PUT /usuarios/${id}:`, error.message);
    res.status(500).send(error.message);
  }
};

export const deleteUsuario = async (req, res) => {
  const { id } = req.params;
  console.log(`🗑️ DELETE /usuarios/${id} - Eliminando usuario...`);

  try {
    const pool = await getConnection();
    await pool.request().input("Id", sql.Int, id).query("DELETE FROM Usuario WHERE ID = @Id");
    console.log(`✅ Usuario ${id} eliminado exitosamente`);
    res.sendStatus(204);
  } catch (error) {
    console.error(`❌ Error en DELETE /usuarios/${id}:`, error.message);
    res.status(500).send(error.message);
  }
};