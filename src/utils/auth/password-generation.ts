import config from "../../config/config";
import * as crypto from 'crypto';

const generatePassword = (passwordString: string): string => {
  try {
    const salt = config.ENCRYPTION.PASSWORD_SALT;
    const iterations = config.ENCRYPTION.PASSWORD_ITERATIONS;

    const hash = crypto.pbkdf2Sync(passwordString, salt, iterations, 64, 'sha512').toString('hex');
    return hash;
  } catch (error) {
    console.log(`Error from generatePassword => ${error}`, {});
    throw error;
  }
}

const comparePassword = (password: string, hashedPassword: string): boolean => {
  try {
    const salt = config.ENCRYPTION.PASSWORD_SALT;
    const iterations = config.ENCRYPTION.PASSWORD_ITERATIONS;

    const encryptedPassword = crypto
      .pbkdf2Sync(password, salt, iterations, 64, "sha512")
      .toString("hex");
    return encryptedPassword === hashedPassword;
  } catch (error) {
    console.log(`Error from comparePassword => ${error}`, {});
    throw error;
  }
}

export { generatePassword, comparePassword };
