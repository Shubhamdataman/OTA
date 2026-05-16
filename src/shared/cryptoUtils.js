import CryptoJS from "crypto-js";
/**
 * Encrypts the given data using AES encryption.
 * @param {Object} data - The data to encrypt.
 * @returns {string|null} - The encrypted string or null if an error occurs.
 */
export const encryptData = (data, secretKey) => {
  try {
    const stringifiedData = JSON.stringify(data);

    const encryptedData = CryptoJS.AES.encrypt(stringifiedData, secretKey, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    }).toString();

    return encryptedData;
  } catch (error) {
    console.error("Error during encryption:", error.message);
    return null;
  }
};

/**
 * Decrypts the given encrypted data.
 * @param {string} encryptedData - The encrypted string to decrypt.
 * @returns {Object|null} - The decrypted object or null if an error occurs.
 */
export const decryptData = (encryptedData, secretKey) => {
  try {
    if (!encryptedData) throw new Error("Encrypted data is empty or invalid.");

    const cipherText = CryptoJS.enc.Base64.parse(encryptedData);

    const decrypted = CryptoJS.AES.decrypt(
      { ciphertext: cipherText },
      secretKey,
      {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
      }
    );

    const decryptedString = CryptoJS.enc.Utf8.stringify(decrypted);

    if (!decryptedString || decryptedString.trim() === "") {
      console.error("Decrypted string is empty or invalid:", decryptedString);
      return null;
    }

    return JSON.parse(decryptedString);
  } catch (error) {
    console.error("Error during decryption:", error.message);
    return null;
  }
};
