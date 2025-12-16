import express from "express";
import http from "http";
import { Server } from "socket.io";
import { engine } from "express-handlebars";

import productsRouter from "./src/routes/productsRouter.js";
import cartsRouter from "./src/routes/cartsRouter.js";
import viewsRouter from "./src/routes/viewsRouter.js";

import ProductManager from "./src/managers/ProductManager.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const productManager = new ProductManager();


// MIDDLEWARES

app.use(express.json());
app.use(express.static("./src/public"));


// HANDLEBARS

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");


// ROUTERS

app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);


// SOCKET.IO

io.on("connection", async (socket) => {
  console.log("Cliente conectado");

  const products = await productManager.getProducts();
  socket.emit("products", products);

  socket.on("new-product", async (data) => {
    await productManager.addProduct({
      ...data,
      description: "sin desc",
      code: Date.now(),
      stock: 1,
      category: "general"
    });

    const updatedProducts = await productManager.getProducts();
    io.emit("products", updatedProducts);
  });
});

// SERVER

server.listen(8080, () => {
  console.log("Servidor funcionando en http://localhost:8080");
});