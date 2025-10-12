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

const createEventUpdateSchema = Joi.object({
  title: Joi.string().min(3).max(255),
  description: Joi.string().allow(null, ''),
  location: Joi.string().min(3).max(255),
  start_time: Joi.date(),
  end_time: Joi.date().greater(Joi.ref('start_time')),
  capacity: Joi.number().min(1),
  // category_id: Joi.number().integer(),
  // manager_id: Joi.number().integer(),
});


export const eventValidator = {
  createEvent: createEventSchema,
  updateEvent: createEventUpdateSchema,
};