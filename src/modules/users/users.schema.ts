import Joi from 'joi';

export const create = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required()
  });

  export const modify =  Joi.object({
    firstName: Joi.string(),
    lastName: Joi.string(),
    email: Joi.string().email(),
    password: Joi.string()
  });

  export const login =  Joi.object({
    email: Joi.string().email(),
    password: Joi.string()
  });
