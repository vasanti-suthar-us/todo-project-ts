import { Request, Response } from 'express';
import { Op } from 'sequelize';
import db from '../../../sequelize-client';
import { decodeAccessToken, generateAccessToken } from '../../../utils/auth/jwt';
import config from '../../../config/config';
import moment from 'moment';
const { User: UserModel, AccessToken: AccessTokenModel } = db;

const registerUser = async (req: Request, res: Response) => {
  try {
    const { body: { name, email, password } } = req;

    const existingEmail = await UserModel.findOne({ where: { email: { [Op.iLike]: email } } });
    if (existingEmail) {
      throw new Error('Email already exists');
    }

    const user = await UserModel.create({ name, email, password });

    const token = await generateAccessToken(user.id);
    const { exp } = (await decodeAccessToken(token)) as { exp: number };

    const expiredAt = moment(exp * 1000).toDate();
    await AccessTokenModel.create({ token, userId: user.id, expiredAt })
    return res.status(200).send({
      token,
      message: 'User is registered successfully'
    });
  } catch (error) {
    console.log(`Error from registerUser api`, { error })
    if (error instanceof Error) {
      return res.status(500).send(error.message);
    }
    return res.status(500).send('An unexpected error occurred');
  }
}

export default registerUser;
