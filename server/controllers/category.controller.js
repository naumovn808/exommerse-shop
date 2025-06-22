import CategoryModel from "../models/category.model.js";
import ProductModel from "../models/product.model.js";
import SubCategoryModel from "../models/subCategory.model.js";
import deleteImgSupaBase from "../utils/deleteImgSupaBase.js";

export const addCategoryController = async (req, res) => {
    try {
        const { name, image } = req.body;

        if (!name || !image) {
            return res.status(400).json({
                message: "Both category name and image are required.",
                error: true,
                success: false
            });
        }

        const newCategory = new CategoryModel({ name, image });
        const savedCategory = await newCategory.save();

        if (!savedCategory) {
            return res.status(500).json({
                message: "Failed to add category. Please try again.",
                error: true,
                success: false
            });
        }

        return res.status(201).json({
            message: "Category added successfully!",
            error: false,
            success: true,
            category: savedCategory
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        });
    }
};

export const getCategoryController = async (req, res) => {
    try {
        const data = await CategoryModel.find()

        if (!data) {
            return res.status(400).json({
                message: "No category found!",
                error: true,
                success: false,
            });
        }

        return res.status(200).json({
            data: data,
            message: "Fetched Category successfully.",
            error: false,
            success: true
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        });
    }
}

export const updateCategoryController = async (req, res) => {
    try {
        const { categoryId, name, image } = req.body;

        if (!categoryId) {
            return res.status(400).json({
                message: "Category ID is required.",
                error: true,
                success: false
            });
        }

        const existingCategory = await CategoryModel.findById(categoryId);
        if (!existingCategory) {
            return res.status(404).json({
                message: "Category not found.",
                error: true,
                success: false
            });
        }

        const updateData = {};

        // Проверка имени
        if (name !== undefined) {
            if (typeof name !== 'string' || name.trim() === '') {
                return res.status(400).json({
                    message: "Name cannot be empty.",
                    error: true,
                    success: false
                });
            }
            updateData.name = name.trim();
        }

        // Проверка изображения
        if (image) {
            if (existingCategory.image?.publicId) {
                await deleteImgCloudinary(existingCategory.image.publicId, "category");
            }
            const { url, publicId } = await uploadImgSupabase(image, "category");
            updateData.image = { url, publicId };
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                message: "No valid fields provided to update.",
                error: true,
                success: false
            });
        }

        const updatedCategory = await CategoryModel.findByIdAndUpdate(
            categoryId,
            updateData,
            { new: true }
        );

        return res.status(200).json({
            message: "Category updated successfully.",
            error: false,
            success: true,
            data: updatedCategory
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        });
    }
};

export const deleteCategoryController = async (req, res) => {
    try {
        const { categoryId } = req.body;
        const existingCategory = await CategoryModel.findById(categoryId);
        if (!existingCategory) {
            return res.status(404).json({
                message: "Category not found.",
                error: true,
                success: false
            });
        }

        const subCategoryCount = await SubCategoryModel.countDocuments({ category: categoryId });
        if (subCategoryCount > 0) {
            return res.status(400).json({
                message: `Cannot delete this category. It is linked to ${subCategoryCount} subcategory(ies).`,
                error: true,
                success: false
            });
        }
        const productCount = await ProductModel.countDocuments({ category: categoryId });
        if (productCount > 0) {
            return res.status(400).json({
                message: `Cannot delete this category. It is linked to ${productCount} product(s).`,
                error: true,
                success: false
            });
        }

        if (existingCategory.image) {
            await deleteImgSupaBase(existingCategory.image, "category");
        }

        await CategoryModel.findByIdAndDelete(categoryId);

        return res.status(200).json({
            message: "Category deleted successfully.",
            error: false,
            success: true
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || "An unexpected error occurred.",
            error: true,
            success: false,
        });
    }
};