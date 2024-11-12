import express from "express";
const router = express.Router();
import CartManager from "../managers/cart-manager-db.js";
const cartManager = new CartManager();
// import CartModel from "../models/cart.model.js";


//1) Creamos un nuevo carrito: 

router.post("/", async (req, res) => {
    try {
        const nuevoCarrito = await cartManager.crearCarrito();
        res.json(nuevoCarrito);
    } catch (error) {
        console.error("Error al crear un nuevo carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

//2) Listamos los productos que pertenecen a determinado carrito. 

router.get("/:cid", async (req, res) => {
    const cartId = req.params.cid;

    try {
        const carrito = await CartModel.findById(cartId)
            
        if (!carrito) {
            console.log("No existe ese carrito con el id");
            return res.status(404).json({ error: "Carrito no encontrado" });
        }

        return res.json(carrito.products);
    } catch (error) {
        console.error("Error al obtener el carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

//3) Agregar productos a distintos carritos.

router.post("/:cid/product/:pid", async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1;

    try {
        const actualizarCarrito = await cartManager.agregarProductoAlCarrito(cartId, productId, quantity);
        res.json(actualizarCarrito.products);
    } catch (error) {
        console.error("Error al agregar producto al carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// DELETE api/carts/:cid/products/:pid
router.delete("/:cid/products/:pid", async (req, res) => {
    const { cid, pid } = req.params;
    try {
        await cartManager.removeProductFromCart(cid, pid); // MODIFICACIÓN
        res.json({ message: "Producto eliminado del carrito exitosamente" });
    } catch (error) {
        console.error("Error al eliminar producto del carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// PUT api/carts/:cid
router.put("/:cid", async (req, res) => {
    const { cid } = req.params;
    const productosActualizados = req.body.products;
    try {
        await cartManager.updateCart(cid, productosActualizados); // MODIFICACIÓN
        res.json({ message: "Carrito actualizado exitosamente" });
    } catch (error) {
        console.error("Error al actualizar carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// PUT api/carts/:cid/products/:pid
router.put("/:cid/products/:pid", async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    try {
        await cartManager.updateProductQuantity(cid, pid, quantity); // MODIFICACIÓN
        res.json({ message: "Cantidad actualizada exitosamente" });
    } catch (error) {
        console.error("Error al actualizar cantidad del producto en el carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// DELETE api/carts/:cid
router.delete("/:cid", async (req, res) => {
    const { cid } = req.params;
    try {
        await cartManager.clearCart(cid); // MODIFICACIÓN
        res.json({ message: "Carrito eliminado exitosamente" });
    } catch (error) {
        console.error("Error al eliminar carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

export default router;