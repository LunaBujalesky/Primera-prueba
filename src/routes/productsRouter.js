import { Router } from "express";
import fs from "fs";
import path from "path";

const router = Router();


const productsFile = path.resolve("src/data/products.json");

// leer productos
const getProducts = () => {
  const data = fs.readFileSync(productsFile, "utf-8");
  return JSON.parse(data);
};

// guardar productos
const saveProducts = (products) => {
  fs.writeFileSync(productsFile, JSON.stringify(products, null, 2));
};


// ROUTER

// GET /api/products/  Traer todos
router.get("/", (req, res) => {
  const products = getProducts();
  res.json(products);
});

// GET /api/products/:pid  Traer uno por ID
router.get("/:pid", (req, res) => {
  const { pid } = req.params;
  const products = getProducts();

  const product = products.find((p) => p.id == pid);

  if (!product) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  res.json(product);
});

// POST = Crear producto
router.post("/", (req, res) => {
  const products = getProducts();
  const data = req.body;

  // Validación 
  const requiredFields = ["title", "description", "code", "price", "status", "stock", "category"];

  for (const field of requiredFields) {
    if (!data[field]) {
      return res.status(400).json({ error: `Falta el campo obligatorio: ${field}` });
    }
  }

  const newProduct = {
    id: products.length > 0 ? products[products.length - 1].id + 1 : 1,
    ...data,
    thumbnails: data.thumbnails || []
  };

  products.push(newProduct);
  saveProducts(products);

  res.status(201).json(newProduct);
});

// PUT /api/products/:pid = Actualizar producto (sin tocar ID)
router.put("/:pid", (req, res) => {
  const { pid } = req.params;
  const updates = req.body;

  const products = getProducts();
  const index = products.findIndex((p) => p.id == pid);

  if (index === -1) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  // No permitir actualizar id
  if ("id" in updates) {
    delete updates.id;
  }

  const updatedProduct = {
    ...products[index],
    ...updates,
  };

  products[index] = updatedProduct;
  saveProducts(products);

  res.json(updatedProduct);
});

// DELETE /api/products/:pid = Eliminar producto
router.delete("/:pid", (req, res) => {
  const { pid } = req.params;

  const products = getProducts();
  const exists = products.some((p) => p.id == pid);

  if (!exists) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  const filtered = products.filter((p) => p.id != pid);
  saveProducts(filtered);

  res.json({ message: "Producto eliminado con éxito" });
});

export default router;