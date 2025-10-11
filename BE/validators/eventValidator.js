import Joi from 'joi';

const createEventSchema = Joi.object({
  title: Joi.string().min(3).max(255).required(),
  description: Joi.string().allow(null, ''),
  location: Joi.string().min(3).max(255).required(),
  start_time: Joi.date().required(),
  end_time: Joi.date().greater(Joi.ref('start_time')).required(),
  capacity: Joi.number().min(1).required(),
  category_id: Joi.number().integer().required(),
  manager_id: Joi.number().integer().required(),
});


export const eventValidator = {
  createEvent: createEventSchema,
};