import CartModel from "../models/cart.model.js";
import mongoose from "mongoose";
//MODIFICACION: Adaptado para MongoDB en lugar de archivos JSON.
class CartManager {
  async crearCarrito() {
    try {
      const nuevoCarrito = new CartModel({ products: [] });
      await nuevoCarrito.save();
      return nuevoCarrito;
    } catch (error) {
      console.error("Error al crear el carrito", error);
      throw new Error("Error al crear el carrito");
    }
  }

  async getCarritoById(cartId) {
    try {
      const carrito = await CartModel.findById(cartId).populate('products.product').lean();
      if (!carrito) {
        throw new Error("Carrito no encontrado");
      }
      return carrito;
    } catch (error) {
      console.error("Error al obtener el carrito", error);
      throw new Error("Error al obtener el carrito");
    }
  }

  async agregarProductoAlCarrito(cartId, productId, quantity = 1) {
    try {
      const carrito = await CartModel.findById(cartId);
      if (!carrito) throw new Error("Carrito no encontrado");

      const existeProducto = carrito.products.find(item => item.product.toString() === productId);
      if (existeProducto) {
        existeProducto.quantity += quantity;
      } else {
        carrito.products.push({ product: productId, quantity });
      }

      await carrito.save();
      return carrito;
    } catch (error) {
      console.error("Error al agregar producto al carrito", error);
      throw new Error("Error al agregar producto al carrito");
    }
  }

  async eliminarProductoDelCarrito(cartId, productId) {
    try {
      const carrito = await CartModel.findById(cartId);
      if (!carrito) throw new Error("Carrito no encontrado");

      carrito.products = carrito.products.filter(item => item.product.toString() !== productId);
      await carrito.save();
      return carrito;
    } catch (error) {
      console.error("Error al eliminar producto del carrito", error);
      throw new Error("Error al eliminar producto del carrito");
    }
  }

  async vaciarCarrito(cartId) {
    try {
      const carrito = await CartModel.findByIdAndUpdate(cartId, { products: [] }, { new: true });
      if (!carrito) throw new Error("Carrito no encontrado");
      return carrito;
    } catch (error) {
      console.error("Error al vaciar el carrito", error);
      throw new Error("Error al vaciar el carrito");
    }
  }
}

export default CartManager;
