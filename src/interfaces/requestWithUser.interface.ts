import { Request } from 'express';
import {User} from '../modules/users/users.interface';
 
interface RequestWithUser extends Request {
  user: User;
}
 
export default RequestWithUser;