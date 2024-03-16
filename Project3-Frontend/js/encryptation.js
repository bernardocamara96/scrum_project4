export function encryptPassword(password) {
    return CryptoJS.SHA256(password).toString();
 }