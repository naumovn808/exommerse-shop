import mongoose from "mongoose";

const adressSchema = new mongoose.Schema(
    {
        saveAs: {
            type: String,
            default: "home"
        },
        flatHouseNumber: {
            type: String,
            default: ""
        },
        floor: {
            type: String,
            default: ""
        },
        street: {
            type: String,
            default: ""
        },
        area: {
            type: String,
            default: "",
        },
        landmark: {
            type: String,
            default: "",
        },
        city: {
            type: String,
            default: "",
        },
        state: {
            type: String,
            default: "",
        },
        pincode: {
            type: String,
            default: "",
        },
        country: {
            type: String,
            default: "",
        },
        name: {
            type: String,
            default: "",
        },
        mobileNumber: {
            type: Number,
            default: null,
        },
        latitude: {
            type: Number,
            default: null,
        },
        longitude: {
            type: Number,
            default: null,
        },
        userId: {
            type: mongoose.Schema.ObjectId,
            role: "USER",
            required: true
        },
        defaultAdress: {
            type: Boolean,
            default: false
        }
    }, {
    timestamps: true
}
)

const AdressModel = mongoose.model('adress', adressSchema);

export default AdressModel;