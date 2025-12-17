import Joi from 'joi';

const createUserSchema = Joi.object({
  name: Joi.string().min(3).max(150).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(/^[0-9]{9,11}$/).required(),
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/]).*$/)
    .required()
    .messages({
      'string.min': 'Mật khẩu phải có ít nhất 8 ký tự',
      'string.pattern.base': 'Mật khẩu phải có ít nhất 1 chữ cái in hoa, 1 chữ số và 1 ký tự đặc biệt',
    }),
  introduce: Joi.string().allow(null, ''),
  role: Joi.string().valid('volunteer', 'manager', 'admin').default('volunteer'),
  status: Joi.string().valid('active', 'blocked').default('active'),
});

const updateUserSchema = Joi.object({
  name: Joi.string().min(3).max(150),
  // email: Joi.string().email(),
  phone: Joi.string().pattern(/^[0-9]{9,11}$/),
  introduce: Joi.string().allow(null, ''),
  avatarUrl: Joi.string().uri().allow(null, ''),
  status: Joi.string().valid('active', 'blocked'),
});

const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string()
    .min(8)
    .pattern(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/]).*$/)
    .required()
    .messages({
      'string.min': 'Mật khẩu phải có ít nhất 8 ký tự',
      'string.pattern.base': 'Mật khẩu phải có ít nhất 1 chữ cái in hoa, 1 chữ số và 1 ký tự đặc biệt',
    }),
});

export const userValidator = {
    createUser: createUserSchema,
    updateUser: updateUserSchema,
    changePassword: changePasswordSchema,
}


