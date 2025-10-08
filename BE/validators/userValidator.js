import Joi from 'joi';

const createUserSchema = Joi.object({
  name: Joi.string().min(3).max(150).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(/^[0-9]{9,11}$/).required(),
  password: Joi.string().min(6).required(),
  introduce: Joi.string().allow(null, ''),
  role: Joi.string().valid('volunteer', 'manager').default('volunteer'),
  status: Joi.string().valid('active', 'blocked').default('active'),
});

const updateUserSchema = Joi.object({
  name: Joi.string().min(3).max(150),
  // email: Joi.string().email(),
  phone: Joi.string().pattern(/^[0-9]{9,11}$/),
  introduce: Joi.string().allow(null, ''),
  status: Joi.string().valid('active', 'blocked'),
});

const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().min(6).required(),
  newPassword: Joi.string().min(6).required(),
});

export const userValidator = {
    createUser: createUserSchema,
    updateUser: updateUserSchema,
    changePassword: changePasswordSchema,
}


