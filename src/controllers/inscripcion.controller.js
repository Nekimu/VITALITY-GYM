import { getConnection, sql } from "../config/connection.js";

export const getInscripciones = async (req, res) => {
  try {
    console.log('📋 GET /inscripciones - Cargando inscripciones...');
    const pool = await getConnection();
    const result = await pool.request().query("SELECT * FROM Inscripcion");
    console.log(`✅ Se encontraron ${result.recordset.length} inscripciones`);
    res.json(result.recordset);
  } catch (error) {
    console.error('❌ Error en GET /inscripciones:', error.message);
    res.status(500).send(error.message);
  }
};

export const createInscripcion = async (req, res) => {
  console.log('📥 [POST /inscripciones] Request recibido');
  console.log('📦 Body completo:', JSON.stringify(req.body, null, 2));
  
  const { Nombre, Correo, Telefono, Planes } = req.body;
  console.log('📝 Datos desestructurados:', { Nombre, Correo, Telefono, Planes });

  if (Nombre == null || Correo == null || Planes == null) {
    console.warn('⚠️ Faltan campos requeridos');
    console.warn('   Nombre:', Nombre);
    console.warn('   Correo:', Correo);
    console.warn('   Planes:', Planes);
    return res.status(400).json({ msg: "Bad Request. Faltan campos requeridos" });
  }

  try {
    console.log('🔄 Conectando a la base de datos...');
    const pool = await getConnection();
    console.log('✅ Conexión a BD establecida');
    
    console.log('💾 Ejecutando INSERT...');
    await pool.request()
      .input("Nombre", sql.VarChar(100), Nombre)
      .input("Correo", sql.VarChar(100), Correo)
      .input("Telefono", sql.VarChar(20), Telefono)
      .input("Planes", sql.VarChar(50), Planes)
      .query(
        "INSERT INTO Inscripcion (Nombre, Correo, Telefono, Planes) VALUES (@Nombre, @Correo, @Telefono, @Planes)"
      );

    console.log('✅ Inscripción creada exitosamente:', Nombre);
    res.json({ msg: "Inscripción creada", success: true });
  } catch (error) {
    console.error('❌ Error en POST /inscripciones:', error.message);
    console.error('📍 Stack trace:', error.stack);
    res.status(500).json({ msg: "Error al crear inscripción", error: error.message });
  }
};

export const updateInscripcion = async (req, res) => {
  const { Nombre, Correo, Telefono, Planes } = req.body;
  const { id } = req.params;
  console.log(`🔄 PUT /inscripciones/${id} - Actualizando inscripción:`, { Nombre, Correo, Telefono, Planes });

  try {
    const pool = await getConnection();
    await pool
      .request()
      .input("Id", sql.Int, id)
      .input("Nombre", sql.VarChar(100), Nombre)
      .input("Correo", sql.VarChar(100), Correo)
      .input("Telefono", sql.VarChar(20), Telefono)
      .input("Planes", sql.VarChar(50), Planes)
      .query(
        "UPDATE Inscripcion SET Nombre = @Nombre, Correo = @Correo, Telefono = @Telefono, Planes = @Planes WHERE ID = @Id"
      );

    console.log(`✅ Inscripción ${id} actualizada exitosamente`);
    res.json({ msg: "Inscripción actualizada" });
  } catch (error) {
    console.error(`❌ Error en PUT /inscripciones/${id}:`, error.message);
    res.status(500).send(error.message);
  }
};

export const deleteInscripcion = async (req, res) => {
  const { id } = req.params;
  console.log(`🗑️ DELETE /inscripciones/${id} - Eliminando inscripción...`);

  try {
    const pool = await getConnection();
    await pool.request().input("Id", sql.Int, id).query("DELETE FROM Inscripcion WHERE ID = @Id");
    console.log(`✅ Inscripción ${id} eliminada exitosamente`);
    res.sendStatus(204);
  } catch (error) {
    console.error(`❌ Error en DELETE /inscripciones/${id}:`, error.message);
    res.status(500).send(error.message);
  }
};
