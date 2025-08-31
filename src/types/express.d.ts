import { UserModelAttributes } from '../schema/main-server/models/user.model'
declare global {
  namespace Express {
    interface Request {
      user: UserModelAttributes;
    }
  }
}
