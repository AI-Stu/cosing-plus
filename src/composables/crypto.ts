import CryptoJS from 'crypto-js';

/**
 * 随机生成32位的字符串
 * @returns {string}
 */
function generateRandomString() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < 32; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

/**
 * 随机生成aes 密钥
 * @returns {string}
 */
export function generateAesKey() {
  return CryptoJS.enc.Utf8.parse(generateRandomString());
}

/**
 * 加密base64
 * @param str 密钥
 * @returns {string}
 */
export function encryptBase64(str: CryptoJS.lib.WordArray) {
  return CryptoJS.enc.Base64.stringify(str);
}

/**
 * 解密base64
 */
export function decryptBase64(str: string) {
  return CryptoJS.enc.Base64.parse(str);
}

/**
 * 使用密钥对数据进行加密
 * @param message
 * @param aesKey
 * @returns { string } encrypted
 */
export function encryptWithAes(message: string, aesKey: CryptoJS.lib.WordArray): string {
  const encrypted = CryptoJS.AES.encrypt(message, aesKey, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  return encrypted.toString();
}

/**
 * 使用密钥对数据进行解密
 * @param message
 * @param aesKey
 * @returns { string } decrypted
 */
export function decryptWithAes(message: string, aesKey: CryptoJS.lib.WordArray): string {
  const decrypted = CryptoJS.AES.decrypt(message, aesKey, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
}
