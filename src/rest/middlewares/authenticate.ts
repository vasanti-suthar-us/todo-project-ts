import { Request, Response, NextFunction } from "express";
import db from "../../sequelize-client";
import encryption from "../../utils/auth/encryption";
import { decodeAccessToken } from "../../utils/auth/jwt";
import moment from "moment";
import { UserModelAttributes } from "../../schema/main-server/models/user.model";

const { AccessToken: AccessTokenModel, User: UserModel } = db;

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization token missing" });
    }

    const token = authHeader.split(" ")[1];
    const decodedToken = await decodeAccessToken(token);
    const session = await AccessTokenModel.findOne({
      where: {
        userId: decodedToken.userId,
        token: encryption.encryptWithAES(token),
      },
      raw: true,
    });
    if (!session) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    if (moment().isAfter(session.expiredAt)) {
      return res.status(401).json({ message: "Token expired" });
    }
    const user = await UserModel.findByPk(session.userId) as UserModelAttributes;
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error("Error in authenticate middleware:", error);
    return res.status(401).json({ message: "Unauthorized" });
  }
};
