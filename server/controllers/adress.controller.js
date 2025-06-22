import AdressModel from "../models/adress.model.js";

export const addNewAdressController = async (req, res) => {
    try {
        const userId = req.userId
        const {
            saveAs,
            flatHouseNumber,
            floor,
            street,
            area,
            landmark,
            city,
            state,
            pincode,
            country,
            name,
            mobileNumber,
            latitude,
            longitude
        } = req.body

        if (!name || !saveAs || !mobileNumber || !latitude || !longitude || !flatHouseNumber || !city || !state || !area) {
            return res.status(400).json({
                message: "Please fill the required fields!",
                error: true,
                success: false
            });

        }
        await AdressModel.updateMany({ userId }, { defaulAdress: false })

        const newAdress = new AdressModel({
            saveAs,
            flatHouseNumber,
            floor,
            street,
            area,
            landmark,
            city,
            state,
            pincode,
            country,
            name,
            mobileNumber,
            latitude,
            longitude,
            userId,
            defaultAdress: true
        })

        const savedAdress = await newAdress.save();
        if (!savedAdress) {
            return res.status(500).json({
                message: "Failed to add new adress. Please try again",
                error: true,
                success: false
            })
        }

        return res.status(201).json({
            message: "Adress added successfully!",
            error: false,
            success: true,
            address: savedAdress
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message || "An error occurred while adding the address.",
            error: true,
            success: false
        });
    }
}

export const getAllAdressByIdController = async (req, res) => {
    try {
        const userId = req.userId;
        const adresses = await AdressModel.find({ userId });

        if (!adresses || adresses.length === 0) {
            return res.status(404).json({
                message: "No adress found for this user.",
                error: true,
                success: false
            })
        }
        return res.status(200).json({
            message: "Addresses retrieved successfully!",
            error: false,
            success: true,
            data: adresses
        })


    } catch (error) {
        return res.status(500).json({
            message: error.message || "An error occurred while fetching addresses.",
            error: true,
            success: false
        });
    }
}

export const deleteAdressController = async (req, res) => {
    try {
        const userId = req.userId;
        const { _id } = req.body;

        if (!userId) {  ///check it later
            return res.status(401).json({
                message: "User not authorized to access this endpoint.",
                error: true,
                success: false
            });
        }

        if (!_id) {
            return res.status(400).json({
                message: "Address _id is required!",
                error: true,
                success: false
            });
        }
        console.log({ _id, userId });

        const adressToDelete = await AdressModel.findOne({ _id, userId })

        console.log(adressToDelete);
        if (!adressToDelete) {
            return res.status(404).json({
                message: "Address not found!",
                error: true,
                success: false
            });
        }

        const wasDefault = adressToDelete.defaultAdress;

        await AdressModel.findByIdAndDelete(_id);

        if (wasDefault) {
            const firstAdress = await AdressModel.findOne({ userId }).sort({ createdAt: 1 })
            if (firstAdress) {
                await AdressModel.findByIdAndUpdate(firstAdress._id, { defeaultAdress: true })
            }
        }

        return res.status(200).json({
            message: "Address deleted successfully!",
            error: false,
            success: true
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message || "An error occurred while deleting the address.",
            error: true,
            success: false
        });
    }
}

export const setDefaultAdressController = async (req, res) => {
    try {
        const userId = req.body;
        const { _id } = req.body;

        if (!userId) {  ///check it later
            return res.status(401).json({
                message: "User not authorized to access this endpoint.",
                error: true,
                success: false
            });
        }

        if (!_id) {
            return res.status(400).json({
                message: "Address _id is required!",
                error: true,
                success: false
            });
        }

        const adressToSetAsDefault = await AdressModel.findById(_id);

        if (!adressToSetAsDefault) {
            return res.status(404).json({
                message: "Address not found!",
                error: true,
                success: false
            });
        }

        await AdressModel.updateMany({ userId }, { defaultAdress: false })

        const setDefaultAdress = await AdressModel.findByIdAndUpdate(
            _id,
            { defaultAdress: true },
            { new: true }
        )

        return res.status(200).json({
            message: "Deafault adress set successfully!",
            error: false,
            success: true,
            address: setDefaultAdress
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || "An error occurred while setting the default address.",
            error: true,
            success: false
        });
    }
}

export const updateAddressController = async (req, res) => {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({
                message: "User not authorized to access this endpoint.",
                error: true,
                success: false
            });
        }

        const {
            _id,
            saveAs,
            flatHouseNumber,
            floor,
            street,
            area,
            landmark,
            city,
            state,
            pincode,
            country,
            name,
            mobileNumber,
            latitude,
            longitude,
            defaultAddress
        } = req.body;

        if (!_id) {
            return res.status(400).json({
                message: "Address _id is required!",
                error: true,
                success: false
            });
        }

        if (!name || !saveAs || !mobileNumber || !latitude || !longitude || !flatHouseNumber || !city || !state || !area) {
            return res.status(400).json({
                message: "Please fill the required fields!",
                error: true,
                success: false
            });
        }

        // Check if the address exists
        const addressToUpdate = await AdressModel.findById(_id);
        if (!addressToUpdate) {
            return res.status(404).json({
                message: "Address not found!",
                error: true,
                success: false
            });
        }

        // Set defaultAddress = false for all user's addresses before updating the new one
        await AdressModel.updateMany({ userId }, { defaultAddress: false });

        // Update the selected address with defaultAddress: true
        const updatedAddress = await AdressModel.findByIdAndUpdate(
            _id,
            {
                saveAs,
                flatHouseNumber,
                floor,
                street,
                area,
                landmark,
                city,
                state,
                pincode,
                country,
                name,
                mobileNumber,
                latitude,
                longitude,
                defaultAddress: true // Always set this address as default
            },
            { new: true }
        );

        return res.status(200).json({
            message: "Address updated successfully!",
            success: true,
            address: updatedAddress
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || "An error occurred while updating the address.",
            error: true,
            success: false
        });
    }
};


/// adress.route.js ( ну и потестите !!!!!)