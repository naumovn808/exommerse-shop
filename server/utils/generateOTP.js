const generateOTP = () => {
    return Math.floor(Math.random() * 900000) + 100000 // 100000 to 999999
}

console.log(generateOTP());


export default generateOTP