import fs from "fs";
import path from "path";

export default class CartManager {
    constructor() {
        this.path = path.join("src", "data", "carts.json");
    }

    async _readFile() {
        try {
            const data = await fs.promises.readFile(this.path, "utf-8");
            return JSON.parse(data);
        } catch (e) {
            return [];
        }
    }

    async _writeFile(data) {
        await fs.promises.writeFile(this.path, JSON.stringify(data, null, 2));
    }

    // Crear carrito
    async createCart() {
        const carts = await this._readFile();

        const newCart = {
            id: carts.length === 0 ? 1 : carts[carts.length - 1].id + 1,
            products: []
        };

        carts.push(newCart);
        await this._writeFile(carts);

        return newCart;
    }

    // Obtener carrito por ID
    async getCartById(id) {
        const carts = await this._readFile();
        return carts.find(c => c.id == id) || null;
    }

    // Agregar producto al carrito
    async addProductToCart(cid, pid) {
        const carts = await this._readFile();
        const cart = carts.find(c => c.id == cid);

        if (!cart) return null;

        const existingProd = cart.products.find(p => p.product === pid);

        if (existingProd) {
            existingProd.quantity++;
        } else {
            cart.products.push({
                product: pid,
                quantity: 1
            });
        }

        await this._writeFile(carts);
        return cart;
    }
}