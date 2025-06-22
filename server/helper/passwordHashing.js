import bcryptjs from "bcryptjs";

export const hashPassword = async (password) => {
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
    return hashedPassword;
};

export const comparePasswords = async (plainPassword, hashedPassword) => {
    const isMatch = await bcryptjs.compare(plainPassword, hashedPassword);
    return isMatch;
};
