import { Router } from "express";
import {
    addSubCategoryController,
    deleteSubCategoryController,
    getSubCategoryController,
    updateCategoryController
} from "../controllers/subCategoryController.js";
import authMiddleware from "../middleware/authMiddleware.js"

const subCategoryRoutes = Router()

subCategoryRoutes.post("/add-sub-category", authMiddleware, addSubCategoryController)
subCategoryRoutes.get("/get-sub-category", getSubCategoryController)
subCategoryRoutes.put("/update-sub-category", authMiddleware, updateCategoryController)
subCategoryRoutes.put("/delete-sub-category", authMiddleware, deleteSubCategoryController)

export default subCategoryRoutes;