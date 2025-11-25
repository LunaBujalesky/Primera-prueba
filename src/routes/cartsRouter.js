import { Router } from "express";
import fs from "fs";
import path from "path";

const router = Router();

const cartsFile = path.resolve("src/data/carts.json");

// Leer carritos
const getCarts = () => {
  if (!fs.existsSync(cartsFile)) {
    fs.writeFileSync(cartsFile, "[]");
  }
  const data = fs.readFileSync(cartsFile, "utf-8");
  return JSON.parse(data);
};

// Guardar carritos
const saveCarts = (carts) => {
  fs.writeFileSync(cartsFile, JSON.stringify(carts, null, 2));
};


// POST /api/carts/  Crea el carrito

router.post("/", (req, res) => {
  const carts = getCarts();

  const newCart = {
    id: carts.length > 0 ? carts[carts.length - 1].id + 1 : 1,
    products: [] 
  };

  carts.push(newCart);
  saveCarts(carts);

  res.status(201).json(newCart);
});


// GET /api/carts/:cid Mostrar productos del carrito

router.get("/:cid", (req, res) => {
  const { cid } = req.params;
  const carts = getCarts();

  const cart = carts.find((c) => c.id == cid);

  if (!cart) {
    return res.status(404).json({ error: "Carrito no encontrado" });
  }

  res.json(cart.products);
});


// POST /api/carts/:cid/product/:pid Agregar producto al carrito / aumentar quantity

router.post("/:cid/product/:pid", (req, res) => {
  const { cid, pid } = req.params;

  const carts = getCarts();
  const cartIndex = carts.findIndex((c) => c.id == cid);

  if (cartIndex === -1) {
    return res.status(404).json({ error: "Carrito no encontrado" });
  }

  const cart = carts[cartIndex];


  const existingProduct = cart.products.find((p) => p.product == pid);

  if (existingProduct) {
  
    existingProduct.quantity += 1;
  } else {
  
    cart.products.push({
      product: pid,
      quantity: 1
    });
  }

  carts[cartIndex] = cart;
  saveCarts(carts);

  res.json(cart);
});

export default router;