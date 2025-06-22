import uploadImgSupaBase from "../utils/uploadImgSupaBase.js";
import deleteImgSupaBase from "../utils/deleteImgSupaBase.js";

export const uploadImageController = async (req, res) => {
    try {
        const file = req.file;
        const path = req.body.path;

        console.log(file, path);
        

        if (!file || !path) {
            return res.status(400).json({
                message: "No file or path provided",
                error: true,
                success: false
            });
        }

        // const uploadImage = await uploadImgSupaBase(file, path);

        // переписать логику сохранения изображений в нашу базу монгодб!!! или в юзере или в категориях или в пролуктакх!!

        // if (!uploadImage) {
        //     return res.status(500).json({
        //         message: "Image upload failed",
        //         error: true,
        //         success: false
        //     });
        // }

        return res.status(200).json({
            message: "Image uploaded successfully",
            error: false,
            success: true,
            data: "uploadImage" //url
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal server error",
            error: true,
            success: false
        });
    }
};

export const deleteImageController = async (req, res) => {
    try {
        const { image } = req.body;

        if (!image) {
            return res.status(400).json({
                message: "Image identifier is not provided",
                error: true,
                success: false
            });
        }

        const deleteResult = await deleteImgSupaBase(image);

        return res.status(200).json({
            message: "Image deleted successfully!",
            error: false,
            success: true,
            data: deleteResult
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || "Failed to delete image",
            error: true,
            success: false
        });
    }
};
