// traer items del localStorage
let productosEnCarrito = localStorage.getItem("productos-en-carrito");
productosEnCarrito = JSON.parse(productosEnCarrito);

// seccion constantes manipulacion DOM
const contenedorCarritoVacio = document.querySelector("#carrito-vacio");
const contenedorCarritoProductos = document.querySelector("#carrito-productos");
const contenedorCarritoAcciones = document.querySelector("#carrito-acciones");
const contenedorCarritoComprado = document.querySelector("#carrito-comprado");
let botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");
const botonVaciar = document.querySelector("#carrito-acciones-vaciar");
const contenedorTotal = document.querySelector("#total");
const botonComprar = document.querySelector("#carrito-acciones-comprar");

// funcion para cargar todos los items agregados al carro con condicional
function cargarProductosCarrito() {
    // if true, quitar mensaje, else mostrarlo
    if (productosEnCarrito && productosEnCarrito.length > 0) {
        contenedorCarritoVacio.classList.add('disabled');
        contenedorCarritoProductos.classList.remove('disabled');
        contenedorCarritoAcciones.classList.remove('disabled');
        contenedorCarritoComprado.classList.add('disabled');
        // misma logica que al mapear los items del fetch API en la grid de la vista productos
        contenedorCarritoProductos.innerHTML = "";
        productosEnCarrito.forEach(producto => {
            const div = document.createElement("div");
            div.classList.add("carrito-producto");
            div.innerHTML = `
        <img class="carrito-producto-imagen" src="${producto.images[0]}" alt="${producto.title}">
        <div class="carrito-producto-titulo">
            <small>Título</small>
            <h3>${producto.category.name}</h3>
        </div>
        <div class="carrito-producto-cantidad">
            <small>Cantidad</small>
            <p>${producto.cantidad}</p>
        </div>
        <div class="carrito-producto-precio">
            <small>Precio</small>
            <p>$${producto.price}</p>
        </div>
        <div class="carrito-producto-subtotal">
            <small>Subtotal</small>
            <p>$${producto.price * producto.cantidad}</p>
        </div>
        <button class="carrito-producto-eliminar" id="${producto.id}"><i class="bi bi-trash-fill"></i></button>
    `;
            contenedorCarritoProductos.append(div);
        })
        // cada render ejecutar funcion
        actualizarBotonesEliminar();

    } else {
        contenedorCarritoVacio.classList.remove('disabled');
        contenedorCarritoProductos.classList.add('disabled');
        contenedorCarritoAcciones.classList.add('disabled');
        contenedorCarritoComprado.classList.add('disabled');
    }
    // cada vez que se renderice, llama las funciones
    actualizarBotonesEliminar();
    actualizarTotal();
};
// cada render ejecutar funcion
cargarProductosCarrito();

// agregar funcionalidad a los botones de eliminar item del carrito
function actualizarBotonesEliminar() {
    botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");

    botonesEliminar.forEach(boton => {
        boton.addEventListener("click", eliminarDelCarrito);
    });
};
// funcion para borrar items del carrito
function eliminarDelCarrito(e) {
    // toma el ID del boton seleccionado y lo guarda en const index
    const idBoton = parseInt(e.currentTarget.id);
    const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);
    // eliminar cantidad 1 del array del carrito en base al index
    productosEnCarrito.splice(index, 1);
    // actualizar el carrito
    cargarProductosCarrito();
    // actualizar la informacion del LS con el nuevo array
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
};

// automaticamente deja el array en 0, limpio usando un listener
botonVaciar.addEventListener("click", vaciarCarrito);
function vaciarCarrito(){
    productosEnCarrito.length = 0;
    // actualizar la informacion del LS con el nuevo array
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito)); 
    // actualizar el carrito
    cargarProductosCarrito();
};

// se ejecuta cada vez que se cargan o actualizan los productos en el carrito
function actualizarTotal() {
    const totalCalculado = productosEnCarrito.reduce((acc, producto) => acc + (producto.price * producto.cantidad), 0);
    total.innerText = `$${totalCalculado}`;
}

// SIMULA COMPRA, borrando el array y actualizando el LS, muestra carritoComprado
botonComprar.addEventListener("click", comprarCarrito);
function comprarCarrito() {
    productosEnCarrito.length = 0;
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));   
    contenedorCarritoVacio.classList.add("disabled");
    contenedorCarritoProductos.classList.add("disabled");
    contenedorCarritoAcciones.classList.add("disabled");
    contenedorCarritoComprado.classList.remove("disabled");
};