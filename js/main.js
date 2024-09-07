

// Cargar carrito desde el localStorage
const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// Seleccionar elementos del DOM
const contenedorProductos = document.querySelector("#productos");
const carritoVacio = document.querySelector("#carrito-vacio");
const carritoProductos = document.querySelector("#carrito-productos");
const carritoTotal = document.querySelector("#carrito-total");
const vaciarCarrito = document.querySelector("#vaciar-carrito");
const finalizarCompra = document.querySelector("#finalizar-compra");

// Mostrar productos en el contenedor
const mostrarProductos = (productos) => {
    productos.forEach((producto) => {
        let div = document.createElement("div");
        div.classList.add("producto");
        div.innerHTML = `
            <img class="producto-img" src="${producto.img}" alt="${producto.titulo}">
            <h3>${producto.titulo}</h3>
            <p>$${producto.precio}</p>
        `;

        let button = document.createElement("button");
        button.classList.add("producto-btn");
        button.innerText = "Agregar al carrito";
        button.addEventListener("click", () => {
            agregarAlCarrito(producto);
        });

        div.append(button);
        contenedorProductos.append(div);
    });
};

// Agregar producto al carrito
const agregarAlCarrito = (producto) => {
    let productoEnCarrito = carrito.find((item) => item.id === producto.id);

    if (productoEnCarrito) {
        productoEnCarrito.cantidad++;
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }

    actualizarCarrito();
    Toastify({
        text: "Producto agregado",
        duration: 3000,
        close: true,
        style: {
            background: " #181615",
            color: "#f2ebd9",
        },
    }).showToast();
};

// Actualizar visualización del carrito
function actualizarCarrito() {
    if (carrito.length === 0) {
        carritoVacio.classList.remove("d-none");
        carritoProductos.classList.add("d-none");
        vaciarCarrito.classList.add("d-none");
        finalizarCompra.classList.add("show");
    } else {
        carritoVacio.classList.add("d-none");
        carritoProductos.classList.remove("d-none");
        vaciarCarrito.classList.remove("d-none");
        finalizarCompra.classList.remove("d-none");

        carritoProductos.innerHTML = "";
        carrito.forEach((producto) => {
            let div = document.createElement("div");
            div.classList.add("carrito-producto");
            div.innerHTML = `
                <h3>${producto.titulo}</h3>
                <p>$${producto.precio}</p>
                <p>Cantidad: ${producto.cantidad}</p>
                <p>Total: $${producto.cantidad * producto.precio}</p>
            `;

            let button = document.createElement("button");
            button.classList.add("carrito-producto-btn");
            button.innerText = "✖️";
            button.addEventListener("click", () => {
                borrarDelCarrito(producto);
            });

            div.append(button);
            carritoProductos.append(div);
        });
    }
    actualizarTotal();
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

// Borrar producto del carrito
function borrarDelCarrito(producto) {
    const indice = carrito.findIndex((item) => item.id === producto.id);
    carrito.splice(indice, 1);
    actualizarCarrito();
}

// Actualizar el total del carrito
function actualizarTotal() {
    const total = carrito.reduce((acc, prod) => acc + prod.precio * prod.cantidad, 0);
    carritoTotal.innerText = "$" + total;
}

// Vaciar carrito
vaciarCarrito.addEventListener("click", () => {
    const cantidadTotal = carrito.reduce((acc, prod) => acc + prod.cantidad, 0);
    Swal.fire({
        title: "¿Seguro querés vaciar el carrito?",
        text: `Se van a borrar ${cantidadTotal} productos.`,
        icon: "question",
        showDenyButton: true,
        denyButtonText: "No",
        confirmButtonText: "Sí",
    }).then((result) => {
        if (result.isConfirmed) {
            carrito.length = 0;
            actualizarCarrito();
            Swal.fire({
                icon: "success",
                title: "Carrito vaciado",
                showConfirmButton: false,
                timer: 1500,
            });
        }
    });
});

// Finalizar compra
finalizarCompra.addEventListener("click", () => {
    Swal.fire({
        title: "Compra finalizada",
        text: "Gracias por tu compra!",
        icon: "success",
        confirmButtonText: "Aceptar",
    }).then(() => {
        carrito.length = 0;
        actualizarCarrito();
    });
});

// Cargar productos desde el archivo JSON
fetch("../data/productos.json")
    .then((resp) => resp.json())
    .then((data) => {
        mostrarProductos(data);
    })
    .catch((error) => console.error("Error al cargar los productos:", error));

// Inicializar carrito
actualizarCarrito();