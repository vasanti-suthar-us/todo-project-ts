import config from '../../config/config';
import * as jwt from 'jsonwebtoken';

const JWT_SECRET = config.JWT.SECRET;
const JWT_LIFE_TIME = config.JWT.LIFE_TIME;

const generateAccessToken = (userId: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    jwt.sign({ userId }, JWT_SECRET as jwt.Secret, { expiresIn: JWT_LIFE_TIME as jwt.SignOptions['expiresIn'] },
      (error, token) => {
        if (error) {
          return reject(error);
        }
        if (!token) {
          return reject(new Error('Token generation failed'));
        }
        resolve(token);
      }
    );
  });
};

const decodeAccessToken = (token: string): Promise<jwt.JwtPayload> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (error, decodedToken) => {
      if (error) {
        if (error.name === 'TokenExpiredError') {
          return reject(new Error('Session is expired'));
        }
        return reject(new Error('Error from decoding access token'));
      }

      if (!decodedToken || typeof decodedToken !== 'object') {
        return reject(new Error('Invalid access token'));
      }

      resolve(decodedToken as jwt.JwtPayload);
    });
  });
};

export { generateAccessToken, decodeAccessToken };
