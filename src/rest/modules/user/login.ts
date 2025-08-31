import { Request, Response } from 'express';
import { Op } from 'sequelize';
import db from '../../../sequelize-client';
import { decodeAccessToken, generateAccessToken } from '../../../utils/auth/jwt';
import moment from 'moment';
import { comparePassword } from '../../../utils/auth/password-generation';

const { User: UserModel, AccessToken: AccessTokenModel } = db;

const loginUser = async (req: Request, res: Response) => {
  try {
    const { body: { email, password } } = req;

    const user = await UserModel.findOne({ where: { email: { [Op.iLike]: email } } });
    if (!user) {
      return res.status(400).send('Invalid email or password');
    }

    if (!comparePassword(password, user.password as string)) {
      return res.status(400).send('Invalid email or password');
    }

    const token = await generateAccessToken(user.id);
    const { exp } = (await decodeAccessToken(token)) as { exp: number };

    const expiredAt = moment(exp * 1000).toDate();
    await AccessTokenModel.create({ token, userId: user.id, expiredAt });

    return res.status(200).send({
      token,
      message: 'User logged in successfully'
    });
  } catch (error) {
    console.log(`Error from loginUser api`, { error });
    if (error instanceof Error) {
      return res.status(500).send(error.message);
    }
    return res.status(500).send('An unexpected error occurred');
  }
};

export default loginUser;
