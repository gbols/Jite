import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import { DataStoredInToken } from "../modules/users/users.interface";
import RequestWithUser from '../interfaces/requestWithUser.interface';
import { UserService } from "../modules/users/users.services";
import HttpException from '../exceptions/HttpException';


export const authMiddleware = async (request: RequestWithUser, response: Response, next: NextFunction) => {
    try {
        const token = request.headers.authorization;
        const secret = process.env.JWT_SECRET;

        const verificationResponse = jwt.verify(token, secret) as DataStoredInToken;
        const id = verificationResponse._id;
        const user = await UserService.getUserById(id);
        if (!user) return next(new HttpException(400, "Invalid token"));
        request.user = user;
        return next();
    } catch (error) {
        return next(new HttpException(400, error));
    }

}