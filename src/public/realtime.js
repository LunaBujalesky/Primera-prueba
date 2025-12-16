const socket = io();

const list = document.getElementById("products");
const form = document.getElementById("productForm");

socket.on("products", (products) => {
  list.innerHTML = "";
  products.forEach(p => {
    list.innerHTML += `<li>${p.title} - $${p.price}</li>`;
  });
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const data = {
    title: form.title.value,
    price: form.price.value
  };

  socket.emit("new-product", data);
  form.reset();
});