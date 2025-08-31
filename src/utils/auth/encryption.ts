import config from '../../config/config';
import * as crypto from 'crypto';

const getEncryptionConfig = () => {
  return {
    secret: config.ENCRYPTION.SECRET,
    iv: config.ENCRYPTION.IV
  };
};

export const encryptWithAES = (text: string): string => {
  const { secret, iv } = getEncryptionConfig();
  
  const cipher = crypto.createCipheriv('aes-256-cbc', secret, iv);
  let encrypted = cipher.update(text, 'utf8', 'base64');
  encrypted += cipher.final('base64');

  return encrypted;
};

export const decryptWithAES = (cipherText: string): string => {
  const { secret, iv } = getEncryptionConfig();
  
  const decipher = crypto.createDecipheriv('aes-256-cbc', secret, iv);
  let decrypted = decipher.update(cipherText, 'base64', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
};

const encryption = {
  encryptWithAES,
  decryptWithAES
};

export default encryption;
