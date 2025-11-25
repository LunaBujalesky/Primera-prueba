import express from "express";
import productsRouter from "./src/routes/productsRouter.js";

const app = express();

// leer JSON en requests
app.use(express.json());

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("Servidor funcionando en puerto 8080! :)");
});

app.use("/api/products", productsRouter);

// Servidor escuchando en el puerto 8080
app.listen(8080, () => {
  console.log("Servidor funcionando en http://localhost:8080");
});