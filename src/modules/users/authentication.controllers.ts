import { Router, Request, Response, NextFunction } from "express";
import bcrypt from 'bcrypt';
import { User, DataStoredInToken, TokenData } from "./users.interface";
import { UserService } from "./users.services";
import HttpException from "../../exceptions/HttpException";
import UserNotFoundException from "../../exceptions/UserNotFoundException";
import * as UsersSchema from "./users.schema";
import { validationMiddleware } from "../../middleware/validate";
import { authMiddleware } from "../../middleware/auth"
import jwt from "jsonwebtoken";
import RequestWithUser from "../../interfaces/requestWithUser.interface"

class AuthenticationController {
    path = "/auth";
    router = Router();

    constructor() {
        this.initializeRoutes()
    }

    public initializeRoutes() {
        this.router.get("/users", this.getAllUsers);
        this.router.post(`${this.path}/register`, validationMiddleware(UsersSchema.create), this.signUp);
        this.router.post(`${this.path}/login`, validationMiddleware(UsersSchema.login), this.login);
        this.router.patch(`${this.path}/:id`, authMiddleware, validationMiddleware(UsersSchema.modify), this.modifyUser);
        this.router.delete(`${this.path}/:id`, authMiddleware, this.deleteUser);
        this.router.get("/dashboard", authMiddleware, this.getDashboard);
    }

    private createToken(user): TokenData {
        const expiresIn = 60 * 60; // an hour
        const secret = process.env.JWT_SECRET;
        const dataStoredInToken: DataStoredInToken = {
            _id: user._id,
        };
        return {
            expiresIn,
            token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
        };
    }

    signUp = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const userData: User = request.body;
            const userAlreadyExists = await UserService.findOne({ email: userData.email });
            if (userAlreadyExists) return next(new HttpException(400, `user with ${userData.email} already exits`));
            const hashedPassword = await bcrypt.hash(userData.password, 10);
            userData.password = hashedPassword;
            const newUser = await UserService.SignUp(userData);

            const token = this.createToken(newUser);
            newUser.password = undefined;
            response.send({ success: true, message: "user has been successfully created", data: newUser, token })
        } catch (error) {
            return next(error);
        }
    }

    getAllUsers = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const users = await UserService.getAllUsers();
            response.send({ success: true, message: "users has been successfully returned", data: users })
        } catch (error) {
            return next(error);
        }
    }

    login = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const { email, password } = request.body;
            const user = await UserService.findOne({ email });
            if (!user) return next(new HttpException(400, "Invalid credentials"));

            const isPasswordMatching = await bcrypt.compare(password, user.password);
            if (!isPasswordMatching) return next(new HttpException(400, "Invalid credentials"));

            user.password = undefined;
            const token = this.createToken(user);
            response.send({ success: true, message: "user has been successfully returned", data: user, token });
        } catch (error) {
            return next(error);
        }
    }

    modifyUser = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const id = request.params.id;
            const newData: User = request.body;
            const user = await UserService.modifyUser(id, newData);
            if (!user) next(new UserNotFoundException(id));
            response.send({ success: true, message: "user has been successfully modified", data: user });
        } catch (error) {
            return next(error);
        }
    }

    deleteUser = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const id = request.params.id;
            const user = await UserService.deleteUser(id);
            if (!user) next(new UserNotFoundException(id));
            response.send({ success: true, message: "user has been successfully deleted", data: user });
        } catch (error) {
            return next(error);
        }
    }

    getDashboard = async (request: RequestWithUser, response: Response, next: NextFunction) => {
        try {
            const { firstName, lastName } = request.user;
            response.send({ success: true, message: `Welcome to your dashboard, [${firstName} ${lastName}]!` });
        } catch (error) {
            return next(error);
        }
    }
}

export default AuthenticationController;