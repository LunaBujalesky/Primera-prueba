import { Router } from "express";
import CartManager from "../managers/CartManager.js";

const router = Router();
const cartManager = new CartManager();

// POST /api/carts crea carrito
router.post("/", async (req, res) => {
    const cart = await cartManager.createCart();
    res.status(201).json(cart);
});

// GET /api/carts/:cid  listar productos del carrito
router.get("/:cid", async (req, res) => {
    const cid = req.params.cid;
    const cart = await cartManager.getCartById(cid);

    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

    res.json(cart.products);
});

// POST /api/carts/:cid/product/:pid agregar producto
router.post("/:cid/product/:pid", async (req, res) => {
    const { cid, pid } = req.params;

    const updatedCart = await cartManager.addProductToCart(cid, pid);

    if (!updatedCart) {
        return res.status(404).json({ error: "Carrito no encontrado" });
    }

    res.json(updatedCart);
});

export default router;