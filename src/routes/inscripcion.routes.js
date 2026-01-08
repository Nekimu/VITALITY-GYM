import { Router } from "express";
import { getInscripciones, createInscripcion, updateInscripcion, deleteInscripcion } from "../controllers/inscripcion.controller.js";

const router = Router();

router.get("/", getInscripciones);
router.post("/", createInscripcion);
router.put("/:id", updateInscripcion);
router.delete("/:id", deleteInscripcion);

export default router;
