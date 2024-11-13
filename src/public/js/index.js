const socket = io(); 
//La instancia de Socket.io del lado del cliente. 


//Lo que tengo que hacer es escuchar al Backend, que este me va a mandar los productos: 

socket.on("productos", (data) => {
    renderProductos(data);
})

// Función para renderizar nuestros productos

const renderProductos = (productos) => {
    const contenedorProductos = document.getElementById("contenedorProductos"); 
    contenedorProductos.innerHTML ="";

    productos.forEach( item => {
        console.log(item)
        const card = document.createElement("div"); 
        card.classList.add("card"); 

        card.innerHTML = `
                            <p> ${item._id} </p>
                            <p class="text"> ${item.title} </p>
                            <p class="text"> ${item.price} </p>
                            <button class="eliminarBtn"> Eliminar </button>
                         `
        
        contenedorProductos.appendChild(card);
        //Evento para eliminar productos: 
        card.querySelector("button").addEventListener("click", () => {
            eliminarProductos(item._id); 
        })
    })
}

const eliminarProductos = (id) => {
    console.log("Eliminando producto con ID:", id); 
    socket.emit("eliminarProducto", id);
}

//Agregamos productos del formulario: 
document.getElementById("btnEnviar").addEventListener("click", () => {
    agregarProducto(); 
})

const agregarProducto = () => {
     // Obtén los valores de los campos del formulario
       const title= document.getElementById("title").value.trim();
       const description= document.getElementById("description").value;
       const price = parseFloat(document.getElementById("price").value);
       const img= document.getElementById("img").value;
       const code= document.getElementById("code").value.trim();
       const stock = parseInt(document.getElementById("stock").value);
       const category= document.getElementById("category").value.trim();
       const status= document.getElementById("status").value === "true";
    
    // Validaciones de los campos
    // Verifica que solo contenga letras y espacios (título y descripción)
    const letrasYEspacios = /^[A-Za-z\s]+$/;

    if (!title || !letrasYEspacios.test(title)) {
        alert("El título debe contener solo letras y espacios");
        return;
    }

    if (!description || !letrasYEspacios.test(description)) {
        alert("La descripción debe contener solo letras y espacios");
        return;
    }

    // Precio: debe ser un número positivo
    if (isNaN(price) || price <= 0) {
        alert("El precio debe ser un número positivo");
        return;
    }

    // Código: debe ser una cadena no vacía
    if (!code || !letrasYEspacios.test(code)) {
        alert("El código debe contener solo letras y espacios");
        return;
    }

    // Stock: debe ser un número positivo o igual a cero
    if (isNaN(stock) || stock < 0) {
        alert("El stock debe ser un número positivo o igual a cero");
        return;
    }

    // Categoría: debe ser una cadena no vacía
    if (!category) {
        alert("La categoría es obligatoria");
        return;
    }


    // Si todas las validaciones pasan, crea el objeto del producto
    const producto = {
        title,
        description,
        price,
        img,
        code,
        stock,
        category,
        status,
    };

    socket.emit("agregarProducto", producto); 

    // Limpia los campos del formulario después de enviar
    document.getElementById("title").value = "";
    document.getElementById("description").value = "";
    document.getElementById("price").value = "";
    document.getElementById("img").value = "Sin imagen";
    document.getElementById("code").value = "";
    document.getElementById("stock").value = "";
    document.getElementById("category").value = "";
    document.getElementById("status").value = "true";
}