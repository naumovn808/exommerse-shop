import SubCategoryModel from "../models/subCategory.model.js";
import deleteImgSupaBase from "../utils/deleteImgSupaBase.js";

export const addSubCategoryController = async (req, res) => {
    try {
        const { name, image, category } = req.body
        if (!name || !image || !category) {
            return res.status(400).json({
                message: "All fields are required",
                error: true,
                success: false
            })
        }

        const newSubCategory = new SubCategoryModel({
            name, image, category
        })

        const savedSubCategory = await newSubCategory.save();

        if (!savedSubCategory) {
            return res.status(500).json({
                message: "Failed to add subcategory. Please try again",
                error: true,
                success: false
            })
        }

        return res.status(201).json({
            message: "SubCategory added successfully",
            error: false,
            success: true
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export const getSubCategoryController = async (req, res) => {
    try {
        const data = await SubCategoryModel
        .find().sort({ createdAt: -1 }).populate("category")
        if (!data) {
            return res.status(400).json({
                message: "No subcategory found!",
                error: true,
                success: false
            })
        }

        return res.status(200).json({
            message: "Fetched Subcategories successfully",
            error: false,
            success: true,
            data: data
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export const updateCategoryController = async (req, res) => {
    try {
        const { subCategoryId, name, image, category } = req.body

        if (!subCategoryId || !name || !image || !category) {
            return res.status(400).json({
                message: "All fields are required",
                error: true,
                success: false
            })
        }

        const existingSubCategory = await SubCategoryModel.findById(subCategoryId)
        if (!existingSubCategory) {
            return res.status(400).json({
                message: "Category not found",
                error: true,
                success: false
            })
        }

        if (!existingSubCategory.image) {
            await deleteImgSupaBase(existingSubCategory.image, "subcategory")
        }

        const updatedSubCategory = await SubCategoryModel.findByIdAndUpdate(
            subCategoryId,
            {
                name,
                image,
                category
            },
            { new: true }
        )
        return res.status(200).json({
            message: "Category updated successfully",
            error: false,
            success: true,
            data: updatedSubCategory
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export const deleteSubCategoryController = async (req, res) => {
    try {
        const { subCategoryId } = req.body

        if (!subCategoryId) {
            return res.status(400).json({
                message: "subCategory Id is required",
                error: true,
                success: false
            })
        }

        const existingSubCategory = await SubCategoryModel.findById(subCategoryId)
        if (!existingSubCategory) {
            return res.status(400).json({
                message: "subCategory not found",
                error: true,
                success: false
            })
        }

        if (existingSubCategory.image) {
            await deleteImgSupaBase(existingSubCategory.image, "subCategory")
        }

        await SubCategoryModel.findByIdAndDelete(existingSubCategory)

        return res.status(200).json({
            message: "SubCategory deleted successfully",
            error: false,
            success: true
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}