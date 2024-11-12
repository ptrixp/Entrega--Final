import express from "express";
const router = express.Router();
import ProductManager from "../managers/product-manager-db.js";
import CartManager from "../managers/cart-manager-db.js";

const productManager = new ProductManager();
const cartManager = new CartManager();


router.get("/products", async (req, res) => {
   try {
      const { page = 1, limit = 5 } = req.query;
      const productos = await productManager.getProducts({
         page: parseInt(page),
         limit: parseInt(limit)
      });

      const nuevoArray = productos.docs.map(producto => {
         const { _id, ...rest } = producto.toObject();
         return rest;
      });

      res.render("home", {
         productos: nuevoArray,
         hasPrevPage: productos.hasPrevPage,
         hasNextPage: productos.hasNextPage,
         prevPage: productos.prevPage,
         nextPage: productos.nextPage,
         currentPage: productos.page,
         totalPages: productos.totalPages
      });

   } catch (error) {
      console.error("Error al obtener productos", error);
      res.status(500).json({
         status: 'error',
         error: "Error interno del servidor"
      });
   }
});



// Ruta para obtener un producto específico por su ID
router.get("/products/:pid", async (req, res) => {
    const { pid } = req.params;
    try {
        const productos = await productManager.getProductById(pid);
        res.render('home', { productos });
    } catch (error) {
        console.error("Error al obtener el producto", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// Ruta para obtener los carritos por su ID
router.get('/carts/:cid', async (req, res) => {
    const { cid } = req.params;
    console.log(`Buscando carrito con ID: ${cid}`);
    try {
        const cart = await cartManager.getCarritoById(cid);
        console.log("Carrito encontrado:", cart);
        res.render('realtimeproducts', { cart });
    } catch (error) {
        console.error("Error al obtener el carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});
// router.get("/realtimeproducts", async (req, res) => {
//     res.render("realtimeproducts"); 
// })

/* Ruta para mostrar productos en tiempo real*/
router.get("/realtimeproducts", async (req, res) => {
    try {
        const productos = await productManager.getProducts();
        console.log("Productos en carrito:", productos);
        res.render("realtimeproducts", { productos });
    } catch (error) {
        console.error("Error al obtener productos en tiempo real", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});
 

export default router;