import CryptoJS from "crypto-js";

export const computeFileHash = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    
    reader.onload = () => {
      const wordArray = CryptoJS.lib.WordArray.create(reader.result);
      const hash = CryptoJS.SHA256(wordArray).toString(CryptoJS.enc.Hex);
      resolve(hash);
    };

    reader.onerror = (error) => reject(error);
  });
};
