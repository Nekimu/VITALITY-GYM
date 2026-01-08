import { getConnection, sql } from "../connection.js"; // Asegúrate de que connection.js esté en src

export const getProducts = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request().query("SELECT * FROM Productos");
        res.json(result.recordset);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

export const createProduct = async (req, res) => {
    console.log('📦 Datos recibidos:', req.body);
    const { Nombre, Descripcion, Precio, Cantidad } = req.body;
    
    // Validación simple
    if (Nombre == null || Precio == null) {
        return res.status(400).json({ msg: "Bad Request. Please fill all fields" });
    }

    try {
        const pool = await getConnection();
        console.log('✅ Conexión exitosa a la BD');
        await pool.request()
            .input("Nombre", sql.VarChar, Nombre)
            .input("Descripcion", sql.Text, Descripcion)
            .input("Precio", sql.Decimal, Precio)
            .input("Cantidad", sql.Int, Cantidad)
            .query("INSERT INTO Productos (Nombre, Descripcion, Precio, Cantidad) VALUES (@Nombre, @Descripcion, @Precio, @Cantidad)");
            console.log('💾 Producto guardado');
        res.json({ Nombre, Descripcion, Precio, Cantidad });
    } catch (error) {
        console.error('❌ Error:', error.message);
        res.status(500).send(error.message);
    }
};

export const updateProduct = async (req, res) => {
    const { Nombre, Descripcion, Precio, Cantidad } = req.body;
    const { id } = req.params;

    try {
        const pool = await getConnection();
        await pool.request()
            .input("Id", sql.Int, id)
            .input("Nombre", sql.VarChar, Nombre)
            .input("Descripcion", sql.Text, Descripcion)
            .input("Precio", sql.Decimal, Precio)
            .input("Cantidad", sql.Int, Cantidad)
            .query("UPDATE Productos SET Nombre = @Nombre, Descripcion = @Descripcion, Precio = @Precio, Cantidad = @Cantidad WHERE Id = @Id");
            
        res.json({ msg: "Producto Actualizado" });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

export const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const pool = await getConnection();
        await pool.request()
            .input("Id", sql.Int, id)
            .query("DELETE FROM Productos WHERE Id = @Id");
        res.sendStatus(204);
    } catch (error) {
        res.status(500).send(error.message);
    }
};