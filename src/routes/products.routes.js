import { Router } from "express";
// Importamos la lógica desde el controlador
import { getProducts, createProduct, updateProduct, deleteProduct } from "../controllers/products.controller.js";

const router = Router();

// Definimos que cuando visiten '/', se ejecute 'getProducts'
router.get("/", getProducts); 

router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;