import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
    addNewAdressController,
    getAllAdressByIdController,
    deleteAdressController,
    setDefaultAdressController,
    updateAddressController
} from "../controllers/adress.controller.js"

const addressRoutes = Router();

addressRoutes.post('/add-new-address', authMiddleware, addNewAdressController)
addressRoutes.get('/get-address', authMiddleware, getAllAdressByIdController);
addressRoutes.put('/update-address', authMiddleware, updateAddressController);
addressRoutes.delete('/delete-address', authMiddleware, deleteAdressController);
addressRoutes.put('/set-default-address', authMiddleware, setDefaultAdressController);

export default addressRoutes;

