import { Router } from "express";
import {
    addProductController,
    deleteProductController,
    getProductsByCategoryAndSubCategoryController,
    getProductById,
    getProductsByCategoryController,
    getProductsController,
    searchProductController,
    updateProductController
} from "../controllers/product.controller.js";
import authMiddleware from "../middleware/authMiddleware.js"

const productRouters = Router()

productRouters.post("/add-product", authMiddleware, addProductController)
productRouters.post("/get-product", getProductsController)
productRouters.put("/update-product/:id", authMiddleware, updateProductController)
productRouters.delete("/delete-product/:id", authMiddleware, deleteProductController)
productRouters.post("/get-products-by-category", getProductsByCategoryController)
productRouters.post("/get-products-by-category-and-sub-category", getProductsByCategoryAndSubCategoryController)
productRouters.post("/get-product-by-id", getProductById)
productRouters.post("/search-product", searchProductController)

export default productRouters;