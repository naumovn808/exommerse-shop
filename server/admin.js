import mongoose from "mongoose";
import dotenv from "dotenv";
import { hashPassword } from "./helper/passwordHashing.js";
import UserModel from "./models/user.model.js";

dotenv.config();

const createAdminUser = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('DataBase connected!');

        const adminEmail = "admin@gmail.com";
        const adminPassword = "Openm1nd";
        const adminName = "Admin";
        const adminMobile = "7777777";

        const existingAdmin = await UserModel.findOne({ email: adminEmail });

        if (existingAdmin) {
            console.log("Admin user already exists", existingAdmin.email);
            await mongoose.disconnect();
            process.exit(1);
        }

        const hashedPasword = await hashPassword(adminPassword);

        const newAdmin = new UserModel({
            name: adminName,
            email: adminEmail,
            password: hashedPasword,
            mobile: adminMobile,
            role: "ADMIN",
            verify_email: true,
            status: 'Active'
        })

        const savedAdmin = await newAdmin.save();

        console.log('Admin user created!');

        await mongoose.disconnect();
        process.exit(1);


    } catch (error) {
        console.log('error creating admin', error);
        await mongoose.disconnect();
        process.exit(1);
    }
}

createAdminUser()

// модель
// hashPassword


// в скрипте подключиться к монгодб

// создать админа

// отключиться от монгодб


// запустить через команду node имя файла