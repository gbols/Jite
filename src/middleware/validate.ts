import { NextFunction, Request, Response } from "express";
import { ObjectSchema } from "joi";
import HttpException from "../exceptions/HttpException";

export const validationMiddleware = (schema: ObjectSchema, path: string = '') => {
    return (request: Request, response: Response, next: NextFunction) => {
        const input = path ? request[path] : request.body;
        const { error } = schema.validate(input);
        if (error) return next(new HttpException(400, error.message));
        return next()
    };
};