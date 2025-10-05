import Joi from 'joi';

const createUserSchema = Joi.object({
  name: Joi.string().min(3).max(150).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(/^[0-9]{9,11}$/).required(),
  password: Joi.string().min(6).required(),
  introduce: Joi.string().allow(null, ''),
  role: Joi.string().valid('volunteer', 'manager').required(),

});


export const userValidator = {
    createUser: createUserSchema,
}


