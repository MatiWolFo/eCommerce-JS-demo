// seccion constantes manipulacion DOM
const contenedorProductos = document.querySelector('#contenedor-productos');
const botonesCategorias = document.querySelectorAll('.boton-categoria');
const tituloPrincipal = document.querySelector('#titulo-principal');
let botonesAgregar = document.querySelectorAll(".producto-agregar");
const numerito = document.querySelector("#numerito");
const butonesCategoria = document.querySelectorAll('.boton-menu.boton-categoria');

// para cada boton del sidemenu
butonesCategoria.forEach((button) => {
    // escucha cuando hay click
    button.addEventListener("click", () => {
        // y al boton que estaba activo
        butonesCategoria.forEach((btn) => {
            // les quita el icono fill y la clase activa
            btn.classList.remove("active");
            let icon = btn.getElementsByTagName("i")[0];
            icon.classList.remove("bi-hand-index-thumb-fill");
            // y lo cambia por el icono inactive
            icon.classList.add("bi-hand-index-thumb");
        });
        // luego agrega la clase active, le quita el icono inactive y agrega el icono fill
        button.classList.add("active");
        let icon = button.getElementsByTagName("i")[0];
        icon.classList.remove("bi-hand-index-thumb");
        icon.classList.add("bi-hand-index-thumb-fill");
    });
});

//fetch DEMO de productos.json
let productos = [];

fetch("./js/productos.json")
    .then(response => response.json())
    .then(data => {
        productos = data;
        // llamar funcion, ALL products cuando el fetch se complete
        cargarProductos(productos);
    })
// function para mostrar todos los elementos productos, por cada item del fetch, crea un div
// productosElegidos para mostrar los datos deseados por categorias
function cargarProductos(productosElegidos) {
    //vaciar los append para cargar los coincidentes por ID
    contenedorProductos.innerHTML = "";
    //con la prop solo trae los coincidentes por ID
    productosElegidos.forEach(producto => {
        // creando elemento, agregando clase y creando la maqueta para recibir la data
        const div = document.createElement("div");
        div.classList.add("producto");
        div.innerHTML = `
            <img class="producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
            <div class="producto-detalles">
                <h3 class="producto-titulo">${producto.titulo}</h3>
                <p class="producto-precio">$${producto.precio}</p>
                <button class="producto-agregar" id="${producto.id}">Agregar</button>
            </div>
        `;
        // creando los distintos div para la data de los items fetcheados usando append
        contenedorProductos.append(div);
    });
    actualizarBotonesAgregar();
};

botonesCategorias.forEach(boton => {
    // agregar eventListener para los clicks en todos los btns
    boton.addEventListener('click', (e) => {
        // quitando active a todos los otros btns al dar click al btn deseado
        botonesCategorias.forEach(boton => boton.classList.remove('active'));
        // agregando active al btn especifico
        e.currentTarget.classList.add('active');
        // IF != todos, filtra, else, los trae todos, cambiando el nombre de la vista
        if (e.currentTarget.id != "todos") {
            // cambiar el titulo de la vista en base al ID, buscando el nombre de la categoria del item
            const productoCategoria = productos.find(producto => producto.categoria.id === e.currentTarget.id);
            tituloPrincipal.innerText = productoCategoria.categoria.nombre;
            // recorre y filtra los deseados por ID === al ID del boton
            const productosBoton = productos.filter(producto => producto.categoria.id === e.currentTarget.id);
            cargarProductos(productosBoton);
        } else {
            tituloPrincipal.innerText = "Todos los productos";
            cargarProductos(productos);
        }
    })
});

// los btn se crean fuera del html, para tomar los que se crean en JS y actualizarlos
function actualizarBotonesAgregar() {
    botonesAgregar = document.querySelectorAll(".producto-agregar");
    console.log(botonesAgregar);
    // asignar funcion carrito para cada boton
    botonesAgregar.forEach(boton => {
        boton.addEventListener('click', agregarAlCarrito);
    });
};

// agregar items a un array vacio en estado inicial o respetando las cantidades en localStorage
let productosEnCarrito;
let productosEnCarritoLS = localStorage.getItem("productos-en-carrito");
// si hay items en LS, se trae ese array, else, crea uno nuevo vacio
if (productosEnCarritoLS) {
    productosEnCarrito = JSON.parse(productosEnCarritoLS);
    actualizarNumerito();
} else {
    productosEnCarrito = [];
}

function agregarAlCarrito(e) {
    // traer el item por ID como evento y agregarlo a un array
    const idBoton = e.currentTarget.id;
    const productoAgregado = productos.find(producto => producto.id === idBoton);
    // checa ID del item a agregar al array, if some true, suma +1 a cantidad de items, else pushea el item como nuevo con 1 item en cantidad
    if (productosEnCarrito.some(producto => producto.id === idBoton)) {
        const index = productosEnCarrito.findIndex(producto => producto.id === idBoton)
        productosEnCarrito[index].cantidad++
    } else {
        productoAgregado.cantidad = 1;
        productosEnCarrito.push(productoAgregado);
    }
    console.log(productosEnCarrito);
    actualizarNumerito();
    // guardar y llevar el nuevo array formado en localStorage para llamarlo de la otra vista en formato JSON o desde index en caso de refresh
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
};
// usando reduce y llamandola cada vez que un nuevo item se agrega al carrito, se actualiza el elemento de ID #numerito en el html
function actualizarNumerito() {
    let nuevoNumerito = productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0);
    numerito.innerText = nuevoNumerito;
};

